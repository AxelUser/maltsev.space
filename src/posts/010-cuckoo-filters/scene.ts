/**
 * PS1-style orbital station deck, rendered with three.js. A landing deck stretches into the
 * distance along the station wall, with 4 hangar bays (B1–B4) of 4 landing pads each: a cuckoo
 * filter with 4 buckets × 4 slots. Every ship is known only by its hull code (the fingerprint)
 * and is cleared for exactly two bays.
 *
 * Ships arrive from the lower-right corner and hold there. Hovering shows the codes and the next
 * ship's two bays; each click sends it in. If both bays are full, it lands on an occupied pad,
 * the resident gets bumped off and flies to its other bay, possibly bumping the next one. Clicks
 * queue up and play in order. Ships fly VTOL-style: vertical lift-off and touchdown, and in
 * between they face where they go, pitch with climbs and bank into turns.
 *
 * Everything renders at 384×256 into a float target, then a post pass applies a vignette and
 * quantises to 15-bit colour with a 4×4 ordered dither. Mesh materials are patched for PS1
 * vertex snapping, affine texture mapping and capped linear fog. Space and the planet are a
 * shader; stars, lights, thrusters and labels are 2D pixel layers, so they stay pixel-aligned.
 *
 * Pass order (each later pass draws over the earlier ones):
 * space + planet → stars → station and ships → HUD (lights, thrusters, labels) → caption → dither.
 */
import * as THREE from 'three';

/** Render resolution (PS1-ish 3:2). */
export const W = 384;
export const H = 256;
export const LOOP = 20;

type V3 = [number, number, number];
type M3 = number[];

export interface StationScene {
	render(t: number): void;
	dispose(): void;
}

/* ---------- math ---------- */
const { sin, cos } = Math;
const PI = Math.PI;
const TAU = PI * 2;
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a: V3, b: V3): V3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];
const nrm = (a: V3): V3 => {
	const l = Math.hypot(a[0], a[1], a[2]) || 1;
	return [a[0] / l, a[1] / l, a[2] / l];
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const smooth = (e0: number, e1: number, x: number) => {
	const t = clamp((x - e0) / (e1 - e0), 0, 1);
	return t * t * (3 - 2 * t);
};
/** Shortest signed angle from a to b. */
const angDiff = (a: number, b: number) => ((((b - a + PI) % TAU) + TAU) % TAU) - PI;
const angLerp = (a: number, b: number, t: number) => a + angDiff(a, b) * t;
const mmul = (a: M3, b: M3): M3 => {
	const r = new Array<number>(9);
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++)
			r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
	return r;
};
const Ry = (a: number): M3 => [cos(a), 0, sin(a), 0, 1, 0, -sin(a), 0, cos(a)];
const Rx = (a: number): M3 => [1, 0, 0, 0, cos(a), -sin(a), 0, sin(a), cos(a)];
const Rz = (a: number): M3 => [cos(a), -sin(a), 0, sin(a), cos(a), 0, 0, 0, 1];
const I3: M3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const det3 = (m: M3) =>
	m[0] * (m[4] * m[8] - m[5] * m[7]) -
	m[1] * (m[3] * m[8] - m[5] * m[6]) +
	m[2] * (m[3] * m[7] - m[4] * m[6]);
const mv = (m: M3, v: V3): V3 => [
	m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
	m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
	m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
];
/** Yaw that points a ship's nose (local +x) along `d` in the ground plane. */
const yawTo = (d: V3) => Math.atan2(-d[2], d[0]);
/** Ship attitude: yaw about y, then pitch (nose up), then roll about the nose. */
const attitude = (yaw: number, pitch = 0, roll = 0) => mmul(mmul(Ry(yaw), Rz(pitch)), Rx(roll));
const C = (c: V3) => new THREE.Color(c[0], c[1], c[2]);

/* ---------- flight paths: cubic Béziers ---------- */
type Path = [V3, V3, V3, V3];
const bez = ([a, b, c, d]: Path, t: number): V3 => {
	const u = 1 - t;
	return add(
		add(mul(a, u * u * u), mul(b, 3 * u * u * t)),
		add(mul(c, 3 * u * t * t), mul(d, t * t * t))
	);
};
const bezD = ([a, b, c, d]: Path, t: number): V3 => {
	const u = 1 - t;
	return add(
		add(mul(sub(b, a), 3 * u * u), mul(sub(c, b), 6 * u * t)),
		mul(sub(d, c), 3 * t * t)
	);
};

/* ---------- noise ---------- */
function hash2(x: number, y: number) {
	let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	h ^= h >>> 16;
	return (h >>> 0) / 4294967296;
}
function vnoise(x: number, y: number) {
	const xi = Math.floor(x),
		yi = Math.floor(y),
		xf = x - xi,
		yf = y - yi;
	const u = xf * xf * (3 - 2 * xf),
		v = yf * yf * (3 - 2 * yf);
	return lerp(
		lerp(hash2(xi, yi), hash2(xi + 1, yi), u),
		lerp(hash2(xi, yi + 1), hash2(xi + 1, yi + 1), u),
		v
	);
}
const fbm = (x: number, y: number) =>
	vnoise(x, y) * 0.55 + vnoise(x * 2.1 + 7, y * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3 + 3) * 0.15;

/* ---------- lighting & camera ---------- */
const SUN = nrm([-0.35, 0.55, -0.75]); // behind the station: rims and the planet's lit edge
const SUNC: V3 = [0.75, 0.82, 1.0];
const AMB: V3 = [0.035, 0.038, 0.055];
const ORANGE: V3 = [1.0, 0.48, 0.12];
const FOG: V3 = [0.015, 0.02, 0.04];
const FOG0 = 70;
const FOG1 = 320;
const FOV = 0.9;
const NEAR = 0.15;
const F = H / 2 / Math.tan(FOV / 2);
// camera rest pose; it drifts a little around it
const CAM: V3 = [-20, 23, 52];
const LOOK: V3 = [36, -4, -16];
const CF = nrm(sub(LOOK, CAM));
const CR = nrm(cross(CF, [0, 1, 0]));
const CU = cross(CR, CF);
/** A point in front of the rest camera: `f` ahead, `r` right, `u` up. */
const camPt = (f: number, r: number, u: number) =>
	add(add(add(CAM, mul(CF, f)), mul(CR, r)), mul(CU, u));
const PLANET = { c: camPt(1000, 470, 270), r: 280 };
/** Sun direction for the planet: lighting its upper-left limb, as seen from the camera. */
const PLANET_SUN = nrm(add(add(mul(CR, -0.55), mul(CU, 0.6)), mul(CF, -0.35)));

/* ---------- station layout ---------- */
const BUCKETS = 4;
const SLOTS = 4;
const BAY_DX = 30; // bay spacing along the deck
const DOOR_W = 15.5;
const PILLAR_W = 6;
const DOOR_H = 8;
const WALL_Z = -18; // station wall face
const EDGE_Z = 10; // deck edge
const DECK_X0 = -26;
const DECK_X1 = BAY_DX * BUCKETS + 20;
const PAD = 9; // pad size
const SHIP_S = 1.45; // ship model scale
const PAD_YAW = 0; // parked ships point down the deck
const bayX = (b: number) => b * BAY_DX;
/** Pads 0 1 at the back row, 2 3 at the front. */
const pad = (b: number, s: number): V3 => [
	bayX(b) + (s % 2 ? 5.6 : -5.6),
	0,
	s < 2 ? -11 : 0
];
/** Where a bumped ship hovers before setting down in bay `b`. */
const holdAt = (b: number): V3 => [bayX(b), 11, 9];
/** The next ship holds near the lower-right corner, nose toward the bays. */
const WAIT = camPt(21, 8.5, -5);
const WAIT_YAW = yawTo(nrm([1, 0, -0.55]));
const ENTRY = camPt(14, 30, -16); // off-screen, low and to the right
const EXIT: V3 = [120, 60, 60];
const queueAt = (i: number) => camPt(30 + i * 7, 16 + i * 3, -4 - i);

const STARS: V3[] = [];
for (let i = 0; i < 140; i++) STARS.push([hash2(i, 11), hash2(i, 12), hash2(i, 13)]);
const LAMPS: V3[] = [];
for (let x = DECK_X0 + 8; x < DECK_X1; x += 30) LAMPS.push([x, 6.5, EDGE_Z - 1]);

const GLYPH: Record<string, string> = {
	'0': '111101101101111',
	'1': '010110010010111',
	'2': '111001111100111',
	'3': '111001111001111',
	'4': '101101111001001',
	'5': '111100111001111',
	'6': '111100111101111',
	'7': '111001001001001',
	'8': '111101111101111',
	'9': '111101111001111',
	A: '010101111101101',
	B: '110101110101110',
	C: '011100100100011',
	D: '110101101101110',
	E: '111100111100111',
	F: '111100111100100',
	G: '011100101101011',
	H: '101101111101101',
	I: '111010010010111',
	J: '001001001101010',
	K: '101101110101101',
	L: '100100100100111',
	M: '101111111101101',
	N: '110101101101101',
	O: '010101101101010',
	P: '110101110100100',
	Q: '010101101111011',
	R: '110101110101101',
	S: '011100010001110',
	T: '111010010010010',
	U: '101101101101111',
	V: '101101101101010',
	W: '101101111111101',
	X: '101101010101101',
	Y: '101101010010010',
	Z: '111001010100111',
	':': '000010000010000',
	'.': '000000000000010',
	'-': '000000111000000',
	'/': '001001010100100',
	'+': '000010111010000'
};
const hex = (v: number) => v.toString(16).toUpperCase().padStart(2, '0');
const bayName = (b: number) => `B${b + 1}`;

/* ---------- cuckoo filter ---------- */
const MAX_KICKS = 8;
const EMPTY = -1;
/** Index hash of a fingerprint; the alternate bucket is `i ^ fpHash(f)` (partial-key cuckoo hashing). */
const fpHash = (f: number) => 1 + Math.floor(hash2(f, 77) * (BUCKETS - 1));

type Step =
	| { kind: 'probe'; f: number; b1: number; b2: number }
	| { kind: 'kick'; f: number; b: number; s: number; victim: number; to: number }
	| { kind: 'place'; f: number; b: number; s: number; kicks: number }
	| { kind: 'fail'; f: number };

/** Plans one insertion without touching `table`; `applyStep` replays the plan. */
function planInsert(table: number[][], f: number, b1: number, rnd: () => number): Step[] {
	const t = table.map((r) => r.slice());
	const b2 = b1 ^ fpHash(f);
	const steps: Step[] = [{ kind: 'probe', f, b1, b2 }];
	for (const b of [b1, b2]) {
		const s = t[b].indexOf(EMPTY);
		if (s >= 0) return [...steps, { kind: 'place', f, b, s, kicks: 0 }];
	}
	let b = rnd() < 0.5 ? b1 : b2,
		cur = f;
	for (let k = 1; k <= MAX_KICKS; k++) {
		const s = Math.floor(rnd() * SLOTS);
		const victim = t[b][s];
		t[b][s] = cur;
		const to = b ^ fpHash(victim);
		steps.push({ kind: 'kick', f: cur, b, s, victim, to });
		const free = t[to].indexOf(EMPTY);
		if (free >= 0) return [...steps, { kind: 'place', f: victim, b: to, s: free, kicks: k }];
		cur = victim;
		b = to;
	}
	return [...steps, { kind: 'fail', f }];
}
function applyStep(table: number[][], st: Step) {
	if (st.kind === 'kick' || st.kind === 'place') table[st.b][st.s] = st.f;
}
/** A table at ~60 % load, filled by real insertions so every ship sits in one of its bays. */
function initialTable(seed: number) {
	const table = Array.from({ length: BUCKETS }, () => Array<number>(SLOTS).fill(EMPTY));
	let n = 0;
	const rnd = () => hash2(seed, n++);
	for (let i = 0; i < 10; i++) {
		const f = 1 + Math.floor(rnd() * 255);
		const plan = planInsert(table, f, Math.floor(rnd() * BUCKETS), rnd);
		if (plan[plan.length - 1].kind !== 'fail') plan.forEach((s) => applyStep(table, s));
	}
	return table;
}
const countFilled = (t: number[][]) => t.flat().filter((v) => v !== EMPTY).length;

/* ---------- shaders ---------- */
/** Snap a clip-space position to the 384×256 pixel grid (PS1 integer vertices). */
const snap = (v: string) =>
	`if (${v}.w > 0.0) ${v}.xy = floor(${v}.xy / ${v}.w * vec2(${W / 2}.0, ${H / 2}.0) + 0.5) / vec2(${W / 2}.0, ${H / 2}.0) * ${v}.w;`;

/** Patch a built-in material: vertex snapping, affine (non-perspective) UVs, fog capped at 75 %. */
function ps1Patch(sh: { vertexShader: string; fragmentShader: string }) {
	const decl = '#include <common>\n#ifdef USE_MAP\nvarying vec3 vAffine;\n#endif';
	sh.vertexShader = sh.vertexShader.replace('#include <common>', decl).replace(
		'#include <project_vertex>',
		`#include <project_vertex>
			${snap('gl_Position')}
			#ifdef USE_MAP
			vAffine = vec3(vMapUv * gl_Position.w, gl_Position.w);
			#endif`
	);
	sh.fragmentShader = sh.fragmentShader
		.replace('#include <common>', decl)
		.replace(
			'#include <map_fragment>',
			'#ifdef USE_MAP\ndiffuseColor *= texture2D(map, vAffine.xy / vAffine.z);\n#endif'
		)
		.replace(
			'#include <fog_fragment>',
			`#ifdef USE_FOG
			gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, clamp((vFogDepth - fogNear) / (fogFar - fogNear), 0.0, 1.0) * 0.75);
			#endif`
		);
}

const FULLSCREEN_VS = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

/** Deep space with faint nebula, and a planet: oceans, clouds, a lit rim and city lights at night. */
const SPACE_FS = /* glsl */ `
uniform vec2 pc;   // planet centre, pixels (y down)
uniform float pr;  // planet radius, pixels
uniform vec3 ld;   // sun direction in camera space
uniform float ph;

float hash2(float x, float y) {
	uint h = uint(int(x)) * 374761393u + uint(int(y)) * 668265263u;
	h = (h ^ (h >> 13u)) * 1274126177u;
	h ^= h >> 16u;
	return float(h) / 4294967296.0;
}
float vnoise(float x, float y) {
	float xi = floor(x), yi = floor(y), xf = x - xi, yf = y - yi;
	float u = xf * xf * (3.0 - 2.0 * xf), v = yf * yf * (3.0 - 2.0 * yf);
	return mix(mix(hash2(xi, yi), hash2(xi + 1.0, yi), u), mix(hash2(xi, yi + 1.0), hash2(xi + 1.0, yi + 1.0), u), v);
}
float fbm(float x, float y) {
	return vnoise(x, y) * 0.55 + vnoise(x * 2.1 + 7.0, y * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3 + 3.0) * 0.15;
}

void main() {
	float x = floor(gl_FragCoord.x), y = ${H - 1}.0 - floor(gl_FragCoord.y);
	vec3 col = vec3(0.004, 0.006, 0.016);
	col += vec3(0.03, 0.015, 0.05) * smoothstep(0.5, 0.85, fbm(x * 0.011 + 3.0, y * 0.017));
	vec2 d = (vec2(x, y) - pc) / pr;
	float r = length(d);
	if (r < 1.0) {
		vec3 n = vec3(d.x, -d.y, sqrt(1.0 - r * r));
		float l = dot(n, ld);
		float day = clamp(l * 1.6 + 0.15, 0.0, 1.0);
		vec2 g = vec2(atan(n.x, n.z), asin(n.y)) * 3.0;
		float land = smoothstep(0.5, 0.56, fbm(g.x + 11.0, g.y * 1.4 + 2.0));
		vec3 surf = mix(vec3(0.02, 0.07, 0.2), vec3(0.12, 0.13, 0.08), land);
		float cl = smoothstep(0.5, 0.74, fbm(g.x * 1.7 + ph * 0.3 + 4.0, g.y * 3.0));
		surf = mix(surf, vec3(0.75, 0.8, 0.88), cl * 0.8);
		col = surf * (day * 1.4 + 0.02);
		// city lights on the night side, in clusters on land
		vec2 cell = floor(g * 40.0);
		float city = step(0.9, hash2(cell.x + 500.0, cell.y + 500.0)) * land * step(0.5, fbm(g.x * 2.0, g.y * 2.0 + 5.0));
		col += vec3(1.0, 0.5, 0.15) * city * (1.0 - smoothstep(0.0, 0.25, day)) * (1.0 - cl) * 0.9;
		col += vec3(0.15, 0.45, 1.0) * pow(1.0 - n.z, 2.5) * clamp(l + 0.4, 0.0, 1.0) * 1.1;
	} else {
		vec3 n = vec3(d.x / r, -d.y / r, 0.0);
		float rim = exp(-(r - 1.0) * pr / 5.0) * clamp(dot(n, ld) + 0.5, 0.0, 1.0);
		col += vec3(0.12, 0.35, 0.9) * rim;
	}
	gl_FragColor = vec4(col, 1.0);
}`;

const POST_FS = /* glsl */ `
uniform sampler2D tDiffuse;
const int BAYER[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
void main() {
	ivec2 ip = ivec2(gl_FragCoord.xy);
	int iy = ${H - 1} - ip.y;
	vec3 c = texelFetch(tDiffuse, ip, 0).rgb;
	float dx = (float(ip.x) - ${W / 2}.0) / ${W / 2}.0, dy = (float(iy) - ${H / 2}.0) / ${H / 2}.0;
	float v = 1.0 - 0.3 * (dx * dx * 0.6 + dy * dy);
	float d = (float(BAYER[(iy & 3) * 4 + (ip.x & 3)]) + 0.5) / 16.0;
	gl_FragColor = vec4(min(vec3(31.0), floor(clamp(c * v, 0.0, 1.0) * 31.0 + d)) / 31.0, 1.0);
}`;

/** Soft round sprite in screen pixels: (1 - d)² falloff, optional vertical squash. */
const GLOW_VS = /* glsl */ `
attribute vec3 gcol;
attribute float rad;
attribute float squash;
varying vec3 vC;
varying float vR, vS, vSize;
void main() {
	vC = gcol; vR = rad; vS = squash;
	vSize = 2.0 * ceil(rad) + 1.0;
	gl_PointSize = vSize;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const GLOW_FS = /* glsl */ `
varying vec3 vC;
varying float vR, vS, vSize;
void main() {
	vec2 p = (gl_PointCoord - 0.5) * vSize;
	float d = length(vec2(p.x, p.y / vS)) / vR;
	if (d >= 1.0) discard;
	gl_FragColor = vec4(vC * (1.0 - d) * (1.0 - d), 1.0);
}`;

/* ---------- cuckoo mark ---------- */
/** 24×16 white bird silhouette, wing raised, facing left: the fleet mark painted on every hull. */
function cuckooMark(x: number, y: number): V3 | null {
	const px = x + 0.5,
		py = y + 0.5;
	const ell = (cx: number, cy: number, rx: number, ry: number) =>
		((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 < 1;
	const tri = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => {
		const s = (x1: number, y1: number, x2: number, y2: number) =>
			(px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
		const d1 = s(ax, ay, bx, by),
			d2 = s(bx, by, cx, cy),
			d3 = s(cx, cy, ax, ay);
		return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
	};
	const WHITE: V3 = [1.6, 1.55, 1.45];
	if (ell(12, 10, 6, 2.6)) return WHITE; // body
	if (ell(5, 8.5, 2.4, 2.1)) return WHITE; // head
	if (tri(2.8, 8, 0, 9.2, 3, 9.6)) return WHITE; // beak
	if (tri(9, 9, 16, 9, 21, 1)) return WHITE; // raised wing
	if (tri(11, 9, 14, 9, 13, 2)) return WHITE;
	if (tri(17, 9, 24, 7, 23, 12)) return WHITE; // tail
	return null;
}

/* ---------- scene ---------- */
export interface StationOptions {
	/** Read every frame: while true, labels show and the next ship's bays light up. */
	hovered?: () => boolean;
	/** Read every frame: a click counter; each increment sends the next ship in. */
	clicks?: () => number;
}

/** Resolves once all shaders are compiled. */
export async function createStationScene(
	canvas: HTMLCanvasElement,
	{ hovered = () => false, clicks = () => 0 }: StationOptions = {}
): Promise<StationScene> {
	const trash: { dispose(): void }[] = [];
	const keep = <T extends { dispose(): void }>(x: T): T => (trash.push(x), x);

	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: false,
		powerPreference: 'low-power'
	});
	renderer.setPixelRatio(1);
	renderer.setSize(W, H, false);
	renderer.autoClear = false;
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
	const target = keep(
		new THREE.WebGLRenderTarget(W, H, {
			type: THREE.HalfFloatType,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter
		})
	);

	const camera = new THREE.PerspectiveCamera((FOV * 180) / PI, W / H, NEAR, 3000);
	const cam2d = new THREE.OrthographicCamera(0, W, 0, H, -1, 1); // pixel space, y down

	/* textures: float data so texel values can exceed 1 (paint, lights) */
	const makeTex = (w: number, h: number, fn: (x: number, y: number) => V3 | null) => {
		const d = new Float32Array(w * h * 4);
		for (let y = 0; y < h; y++)
			for (let x = 0; x < w; x++) {
				const c = fn(x, y);
				// texture rows go bottom-up; flip so `fn` draws top-down
				d.set(c ? [c[0], c[1], c[2], 1] : [0, 0, 0, 0], ((h - 1 - y) * w + x) * 4);
			}
		const t = keep(new THREE.DataTexture(d, w, h, THREE.RGBAFormat, THREE.FloatType));
		t.magFilter = THREE.NearestFilter;
		t.minFilter = THREE.NearestFilter;
		t.wrapS = t.wrapT = THREE.RepeatWrapping;
		t.generateMipmaps = false;
		t.needsUpdate = true;
		return t;
	};
	const gr = (v: number): V3 => [v, v, v];
	const glyphTex = (s: string, c: V3) =>
		makeTex(s.length * 4 + 1, 7, (x, y) => {
			const k = Math.floor((x - 1) / 4),
				gx = (x - 1) % 4,
				gy = y - 1;
			const g = GLYPH[s[k]];
			return g && gx < 3 && gy >= 0 && gy < 5 && g[gy * 3 + gx] === '1' ? c : null;
		});
	const TEX = {
		hull: makeTex(32, 32, (x, y) => {
			let v = 0.85 + 0.2 * fbm(x * 0.25, y * 0.25);
			if (x === 0 || y === 0 || (y === 16 && x > 8)) v *= 0.6; // panel seams
			if (vnoise(x * 0.4, y * 0.4 + 9) > 0.72) v *= 0.8; // scorch marks
			return gr(v);
		}),
		plating: makeTex(32, 32, (x, y) => {
			let v = 0.9 + 0.14 * fbm(x * 0.2, y * 0.2);
			if (x % 16 === 0 || y % 16 === 0) v *= 0.6;
			if (x % 16 === 8 && y % 16 === 8) v *= 1.3; // vents
			if (hash2(x >> 4, y >> 4) > 0.6) v *= 0.88; // patched panels
			return gr(v);
		}),
		deck: makeTex(32, 32, (x, y) => {
			let v = 0.85 + 0.2 * fbm(x * 0.15, y * 0.15);
			if (x % 16 === 0 || y % 16 === 0) v *= 0.55;
			if (hash2(x >> 4, (y >> 4) + 7) > 0.7) v *= 0.85;
			if (vnoise(x * 0.3 + 5, y * 0.3) > 0.75) v *= 0.85; // skid marks
			return gr(v);
		}),
		pad: makeTex(16, 16, (x, y) => {
			const e = Math.min(x, y, 15 - x, 15 - y);
			const corner = (x < 4 || x > 11) && (y < 4 || y > 11);
			if (e === 0 && corner) return [1.8, 0.8, 0.2]; // corner brackets
			if (e === 0) return (x + y) % 4 < 2 ? [1.1, 0.5, 0.12] : gr(0.12); // dashed edge
			if (Math.abs(Math.hypot(x - 7.5, y - 7.5) - 4.5) < 0.6) return [0.6, 0.55, 0.45];
			return gr(0.13 + 0.03 * hash2(x, y));
		}),
		door: makeTex(16, 16, (x, y) => {
			if (y === 1) return [2.0, 1.0, 0.3]; // light strip under the lintel
			let v = 0.14 + 0.08 * (y / 16);
			if (x % 4 === 0) v *= 0.6; // interior frames
			if (y > 11 && hash2(x >> 1, 3) > 0.6) v *= 1.8; // equipment
			return [v, v * 0.5, v * 0.18];
		}),
		windows: makeTex(16, 8, (x, y) =>
			y === 3 && x % 8 > 4
				? [0.9, 0.4, 0.1]
				: y === 5 && x % 8 === 2
					? [0.3, 1.0, 1.4]
					: gr(0.18)
		),
		mark: makeTex(24, 16, cuckooMark),
		bays: Array.from({ length: BUCKETS }, (_, b) => glyphTex(bayName(b), [1.6, 1.45, 1.2]))
	};
	for (const t of [TEX.mark, ...TEX.bays]) t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;

	/* materials */
	const ps1 = <T extends THREE.Material>(m: T): T => {
		m.onBeforeCompile = ps1Patch;
		return keep(m);
	};
	const lam = (col: V3, o: THREE.MeshLambertMaterialParameters = {}) =>
		ps1(new THREE.MeshLambertMaterial({ color: C(col), flatShading: true, ...o }));
	const basic = (col: V3, o: THREE.MeshBasicMaterialParameters = {}) =>
		ps1(new THREE.MeshBasicMaterial({ color: C(col), ...o }));

	/* geometry helpers */
	const BOX = keep(new THREE.BoxGeometry(1, 1, 1));
	const PLANE = keep(new THREE.PlaneGeometry(1, 1));
	const CYL = keep(new THREE.CylinderGeometry(1, 1, 1, 8));
	const DISC = keep(new THREE.CylinderGeometry(1, 1, 1, 18));
	const shared = new Set<THREE.BufferGeometry>([BOX, PLANE, CYL, DISC]);
	const boxUV = (us: [number, number]) => {
		const g = keep(BOX.clone()),
			a = g.getAttribute('uv');
		for (let i = 0; i < a.count; i++) a.setXY(i, a.getX(i) * us[0], a.getY(i) * us[1]);
		return g;
	};
	/** Set an object's local transform to translate(pos) · rotate(m) · scale(s). */
	const place = <T extends THREE.Object3D>(o: T, p: V3, m: M3 = I3, s: V3 = [1, 1, 1]): T => {
		o.matrixAutoUpdate = false;
		// prettier-ignore
		o.matrix.set(
			m[0] * s[0], m[1] * s[1], m[2] * s[2], p[0],
			m[3] * s[0], m[4] * s[1], m[5] * s[2], p[1],
			m[6] * s[0], m[7] * s[1], m[8] * s[2], p[2],
			0, 0, 0, 1
		);
		o.matrixWorldNeedsUpdate = true;
		return o;
	};
	type Mat = THREE.Material | THREE.Material[];
	const mesh = (
		parent: THREE.Object3D,
		geo: THREE.BufferGeometry,
		mat: Mat,
		p: V3,
		m: M3 = I3,
		s: V3 = [1, 1, 1]
	) => {
		const o = place(new THREE.Mesh(geo, mat), p, m, s);
		parent.add(o);
		return o;
	};
	const box = (parent: THREE.Object3D, c: V3, s: V3, mat: Mat, m: M3 = I3, geo = BOX) =>
		mesh(parent, geo, mat, c, m, s);
	const cyl = (
		parent: THREE.Object3D,
		c: V3,
		r: number,
		h: number,
		mat: Mat,
		m: M3 = I3,
		geo = CYL
	) => mesh(parent, geo, mat, c, m, [r, h, r]);

	/** Triangle soup from a list of polygons (fan-triangulated). */
	const polys = (list: { p: V3[]; uv: number[][] }[]) => {
		const pos: number[] = [],
			uv: number[] = [];
		for (const q of list)
			for (let i = 1; i + 1 < q.p.length; i++)
				for (const k of [0, i, i + 1]) {
					pos.push(...q.p[k]);
					uv.push(...q.uv[k]);
				}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
		return geo;
	};
	/** Loft of chamfered-box cross sections [x, half-width, bottom, top]; from +x (nose) to −x. */
	type Sec = [x: number, w: number, yb: number, yt: number];
	const ring = ([x, w, yb, yt]: Sec): V3[] => {
		const c = Math.min(w, (yt - yb) / 2) * 0.45;
		return [
			[x, yt, w - c],
			[x, yt - c, w],
			[x, yb + c, w],
			[x, yb, w - c],
			[x, yb, -(w - c)],
			[x, yb + c, -w],
			[x, yt - c, -w],
			[x, yt, -(w - c)]
		];
	};
	const loft = (secs: Sec[]) => {
		const faces: { p: V3[]; uv: number[][] }[] = [];
		for (let i = 0; i + 1 < secs.length; i++) {
			const a = ring(secs[i]),
				b = ring(secs[i + 1]);
			const u0 = secs[i][0] * 0.4,
				u1 = secs[i + 1][0] * 0.4;
			for (let k = 0; k < 8; k++) {
				const k1 = (k + 1) % 8;
				faces.push({
					p: [a[k], b[k], b[k1], a[k1]],
					uv: [
						[u0, k / 4],
						[u1, k / 4],
						[u1, (k + 1) / 4],
						[u0, (k + 1) / 4]
					]
				});
			}
		}
		for (const [r, flip] of [
			[ring(secs[0]), false],
			[ring(secs[secs.length - 1]), true]
		] as const) {
			const p = flip ? r.slice().reverse() : r;
			faces.push({ p, uv: p.map((q) => [q[2] * 0.3, q[1] * 0.3]) });
		}
		return polys(faces);
	};
	/** Flat 2D outline (in the xz plane) extruded `t` thick around y = 0. */
	const slab = (outline: [number, number][], t: number) => {
		const top = outline.map(([x, z]): V3 => [x, t / 2, z]),
			bot = outline.map(([x, z]): V3 => [x, -t / 2, z]);
		const faces: V3[][] = [top.slice().reverse(), bot];
		for (let i = 0; i < outline.length; i++) {
			const j = (i + 1) % outline.length;
			faces.push([top[i], top[j], bot[j], bot[i]]);
		}
		return polys(faces.map((p) => ({ p, uv: p.map((q) => [q[0] * 0.4, q[2] * 0.4]) })));
	};
	/** Bake transformed parts into one geometry with per-part vertex colours. */
	const merge = (parts: { geo: THREE.BufferGeometry; c: V3; p?: V3; m?: M3; s?: V3 }[]) => {
		const pos: number[] = [],
			uv: number[] = [],
			col: number[] = [];
		for (const { geo, c, p = [0, 0, 0] as V3, m = I3, s = [1, 1, 1] as V3 } of parts) {
			const g = geo.index ? geo.toNonIndexed() : geo;
			const P = g.getAttribute('position'),
				U = g.getAttribute('uv');
			const flip = det3(m) * s[0] * s[1] * s[2] < 0; // mirrored: keep faces outward
			for (let i = 0; i < P.count; i += 3)
				for (const k of flip ? [0, 2, 1] : [0, 1, 2]) {
					const v = i + k;
					pos.push(...add(p, mv(m, [P.getX(v) * s[0], P.getY(v) * s[1], P.getZ(v) * s[2]])));
					uv.push(U ? U.getX(v) : 0, U ? U.getY(v) : 0);
					col.push(...c);
				}
			if (g !== geo) g.dispose();
			if (!shared.has(geo)) geo.dispose();
		}
		const out = keep(new THREE.BufferGeometry());
		out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
		out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
		out.computeVertexNormals();
		return out;
	};

	/** Growable-per-frame vertex buffer (rebuilt from scratch every frame). */
	const dynBuffer = (max: number, attrs: Record<string, number>) => {
		const geo = keep(new THREE.BufferGeometry());
		const arrays: Record<string, Float32Array> = {};
		for (const [name, size] of Object.entries(attrs)) {
			arrays[name] = new Float32Array(max * size);
			geo.setAttribute(
				name,
				new THREE.BufferAttribute(arrays[name], size).setUsage(THREE.DynamicDrawUsage)
			);
		}
		let n = 0;
		return {
			geo,
			reset: () => (n = 0),
			push(v: Record<string, number[]>) {
				if (n >= max) return;
				for (const name in v) arrays[name].set(v[name], n * attrs[name]);
				n++;
			},
			commit() {
				for (const name in attrs) geo.getAttribute(name).needsUpdate = true;
				geo.setDrawRange(0, n);
			}
		};
	};
	const noCull = <T extends THREE.Object3D>(o: T, ro: number) => {
		o.frustumCulled = false;
		o.renderOrder = ro;
		return o;
	};

	/** A 2D pixel layer: additive pixels, opaque pixels (text) and soft glow sprites. */
	const layer = (max: number) => {
		const scene = new THREE.Scene();
		const pixels = (blending: THREE.Blending, ro: number) => {
			const buf = dynBuffer(max, { position: 3, color: 3 });
			const mat = keep(
				new THREE.PointsMaterial({
					size: 1,
					sizeAttenuation: false,
					vertexColors: true,
					blending,
					depthTest: false,
					depthWrite: false,
					fog: false
				})
			);
			scene.add(noCull(new THREE.Points(buf.geo, mat), ro));
			return buf;
		};
		const glows = dynBuffer(max, { position: 3, gcol: 3, rad: 1, squash: 1 });
		const glowMat = keep(
			new THREE.ShaderMaterial({
				vertexShader: GLOW_VS,
				fragmentShader: GLOW_FS,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				depthWrite: false
			})
		);
		scene.add(noCull(new THREE.Points(glows.geo, glowMat), 0));
		const addPx = pixels(THREE.AdditiveBlending, 1),
			setPx = pixels(THREE.NormalBlending, 2);
		const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H;
		return {
			scene,
			plot: (x: number, y: number, c: V3) =>
				inside(x, y) && addPx.push({ position: [x + 0.5, y + 0.5, 0], color: c }),
			set: (x: number, y: number, c: V3) =>
				inside(x, y) && setPx.push({ position: [x + 0.5, y + 0.5, 0], color: c }),
			sprite: (x: number, y: number, rad: number, c: V3, sq = 1) =>
				glows.push({ position: [x + 0.5, y + 0.5, 0], gcol: c, rad: [rad], squash: [sq] }),
			reset() {
				addPx.reset();
				setPx.reset();
				glows.reset();
			},
			commit() {
				addPx.commit();
				setPx.commit();
				glows.commit();
			}
		};
	};
	const under = layer(256); // stars
	const hud = layer(8192); // lights, thrusters, labels
	const caption = layer(4096); // 2× text prompt at the bottom

	const fullscreen = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) => {
		const scene = new THREE.Scene();
		const mat = keep(
			new THREE.ShaderMaterial({
				vertexShader: FULLSCREEN_VS,
				fragmentShader,
				uniforms,
				depthTest: false,
				depthWrite: false
			})
		);
		scene.add(noCull(new THREE.Mesh(keep(new THREE.PlaneGeometry(2, 2)), mat), 0));
		return { scene, uniforms };
	};
	const space = fullscreen(SPACE_FS, {
		pc: { value: new THREE.Vector2() },
		pr: { value: 1 },
		ld: { value: new THREE.Vector3() },
		ph: { value: 0 }
	});
	const post = fullscreen(POST_FS, { tDiffuse: { value: target.texture } });

	/* --- station --- */
	const scene = new THREE.Scene();
	scene.fog = new THREE.Fog(C(FOG), FOG0, FOG1);
	{
		const sun = new THREE.DirectionalLight(C(SUNC), 0.8 * PI);
		sun.position.set(...SUN);
		scene.add(sun, new THREE.AmbientLight(C(AMB), PI));
		// cool bounce from the planet, warm spill from the nearest hangars
		const planet = new THREE.DirectionalLight(C([0.15, 0.28, 0.5]), 0.6 * PI);
		planet.position.set(0.8, 0.3, 0.5);
		// soft fill from the camera side, so parked ships don't turn into silhouettes
		const fill = new THREE.DirectionalLight(C([0.5, 0.52, 0.6]), 0.45 * PI);
		fill.position.set(...mul(CF, -1));
		scene.add(planet, fill);
		for (let b = 0; b < 4; b++) {
			const l = new THREE.PointLight(C(ORANGE), 90 * PI, 0, 2);
			l.position.set(bayX(b), 6, WALL_Z + 4);
			scene.add(l);
		}
	}
	const plating = lam([0.24, 0.24, 0.26], { map: TEX.plating });
	const steel = lam([0.16, 0.16, 0.18]);
	const dark = lam([0.06, 0.06, 0.07]);
	const orangeM = basic([1.6, 0.7, 0.18]);
	const cyanM = basic([0.3, 1.1, 1.5]);
	const DL = DECK_X1 - DECK_X0,
		DC = (DECK_X0 + DECK_X1) / 2,
		DW = EDGE_Z - WALL_Z;

	// the deck: a long slab with an edge rail, light strips and a truss underneath
	box(
		scene,
		[DC, -1.5, (WALL_Z + EDGE_Z) / 2],
		[DL, 3, DW],
		lam([0.3, 0.3, 0.32], { map: TEX.deck }),
		I3,
		boxUV([DL / 8, DW / 8])
	);
	box(scene, [DC, -4.5, -6], [DL, 3, 24], plating, I3, boxUV([DL / 8, 1]));
	for (let i = 0, x = DECK_X0 + 4; x < DECK_X1; x += 3.2, i++) {
		box(scene, [x, -1.2, EDGE_Z + 0.02], [1.6, 0.2, 0.05], i % 7 === 3 ? cyanM : orangeM);
		box(scene, [x, 1.0, EDGE_Z - 0.3], [0.12, 2, 0.12], steel);
	}
	box(scene, [DC, 2.0, EDGE_Z - 0.3], [DL, 0.15, 0.15], steel);
	box(scene, [DC, 1.0, EDGE_Z - 0.3], [DL, 0.1, 0.1], steel);
	for (let x = DECK_X0 + 10; x < DECK_X1; x += 24) {
		box(scene, [x, -14, -8], [3, 22, 3], steel);
		box(scene, [x, -10, -2], [1.2, 14, 1.2], steel, Rx(0.5));
		box(scene, [x + 1.5, -6.5, EDGE_Z - 2], [2, 0.3, 0.2], orangeM);
	}

	// the station wall: hangar doors between angular pillars, bay plates, light strips
	const wallTop = 20;
	box(
		scene,
		[DC, wallTop / 2, WALL_Z - 5],
		[DL, wallTop, 10],
		plating,
		I3,
		boxUV([DL / 8, wallTop / 8])
	);
	const doorM = basic([1, 1, 1], { map: TEX.door });
	const bayMats = Array.from({ length: BUCKETS }, () => basic([0.3, 1.1, 1.5]));
	for (let b = 0; b < BUCKETS; b++) {
		const x = bayX(b);
		mesh(scene, PLANE, doorM, [x, DOOR_H / 2, WALL_Z + 0.02], I3, [DOOR_W, DOOR_H, 1]);
		box(scene, [x, DOOR_H + 0.4, WALL_Z + 0.6], [DOOR_W + 1, 0.8, 1.2], steel); // lintel
		box(scene, [x, DOOR_H + 0.95, WALL_Z + 1.25], [DOOR_W - 1, 0.15, 0.1], orangeM);
		const plate = basic([1, 1, 1], { map: TEX.bays[b], alphaTest: 0.5 });
		mesh(scene, PLANE, plate, [x - 3.5, 13.6, WALL_Z + 0.05], I3, [8.4, 6.5, 1]);
		box(scene, [x + 4.5, 12.4, WALL_Z + 0.1], [4.5, 0.4, 0.1], bayMats[b]); // bay status strip
		box(scene, [x + 4.5, 13.8, WALL_Z + 0.1], [2.5, 0.2, 0.1], orangeM);
	}
	for (let b = 0; b <= BUCKETS; b++) {
		const x = bayX(b) - BAY_DX / 2;
		box(scene, [x, 8, WALL_Z + 1.2], [PILLAR_W, 16, 2.4], plating);
		box(scene, [x, 17, WALL_Z + 0.6], [PILLAR_W + 1.5, 3, 3.6], plating, Rx(-0.3));
		box(scene, [x, 3.5, WALL_Z + 2.45], [0.25, 3, 0.1], orangeM);
		box(scene, [x, 15.2, WALL_Z + 2.2], [1.6, 0.3, 0.1], cyanM);
	}
	// superstructure: stepped upper decks with window strips, towers, antennas, a dish, a saucer
	const winM = lam([1, 1, 1], {
		map: TEX.windows,
		emissive: C([0.18, 0.1, 0.04]),
		emissiveMap: TEX.windows
	});
	box(scene, [DC, 24, WALL_Z - 9], [DL, 8, 10], winM, I3, boxUV([DL / 16, 1]));
	box(scene, [DC - 20, 31, WALL_Z - 14], [DL - 60, 6, 8], winM, I3, boxUV([(DL - 60) / 16, 1]));
	for (const [x, h] of [
		[-22, 46],
		[10, 38],
		[54, 34]
	]) {
		box(scene, [x, h / 2, WALL_Z - 14], [9, h, 9], plating, I3, boxUV([1, h / 8]));
		box(scene, [x, h + 4, WALL_Z - 14], [0.3, 8, 0.3], steel);
	}
	cyl(scene, [40, 40, WALL_Z - 16], 2, 1.5, steel);
	cyl(scene, [40, 42.5, WALL_Z - 16], 4, 0.5, lam([0.5, 0.5, 0.52]), Rx(-0.8), DISC);
	cyl(scene, [118, 30, WALL_Z - 30], 26, 2.2, plating, I3, DISC);
	cyl(scene, [118, 32.5, WALL_Z - 30], 16, 3, winM, I3, DISC);
	cyl(scene, [118, 15, WALL_Z - 30], 3, 30, steel);
	// cargo on the deck
	const crate = lam([0.45, 0.43, 0.4], { map: TEX.hull });
	for (let b = 0; b <= BUCKETS; b++) {
		const x = bayX(b) - BAY_DX / 2;
		if (b % 3 === 1) continue;
		box(scene, [x, 0.8, -14], [2.6, 1.6, 2.2], crate, Ry(0.1 * b));
		box(scene, [x + 0.3, 2.2, -14.2], [2, 1.2, 1.8], crate);
	}
	box(scene, [DECK_X1 - 10, 1.4, -6], [8, 2.8, 4], crate);
	box(scene, [DECK_X1 - 10, 3.6, -6], [6, 1.6, 3.6], crate);
	for (const p of LAMPS) {
		box(scene, [p[0], p[1] / 2, p[2]], [0.25, p[1], 0.25], steel);
		box(scene, p, [0.9, 0.3, 0.5], dark);
	}
	// landing pads
	const padM = basic([1, 1, 1], { map: TEX.pad });
	const padGeo = keep(new THREE.PlaneGeometry(1, 1).rotateX(-PI / 2));
	for (let b = 0; b < BUCKETS; b++)
		for (let s = 0; s < SLOTS; s++)
			mesh(scene, padGeo, padM, add(pad(b, s), [0, 0.03, 0]), I3, [PAD, 1, PAD]);
	// cargo carts running along the deck
	const carts = [0, 1, 2].map(() => {
		const g = new THREE.Group();
		scene.add(g);
		box(g, [0, 0.6, 0], [2.4, 1, 1.4], lam([0.5, 0.42, 0.2]));
		box(g, [-0.5, 1.3, 0], [0.9, 0.5, 1.2], dark);
		return g;
	});

	/* --- ships: a pool, placed from scratch every frame --- */
	const HULLS: V3[] = [
		[0.5, 0.5, 0.54],
		[0.72, 0.72, 0.75],
		[0.36, 0.36, 0.4],
		[0.62, 0.6, 0.55]
	];
	const FUSE: Sec[] = [
		[3.1, 0.05, -0.02, 0.1],
		[2.0, 0.38, -0.22, 0.32],
		[0.4, 0.6, -0.32, 0.55],
		[-1.6, 0.66, -0.32, 0.52],
		[-2.4, 0.56, -0.28, 0.42]
	];
	const CANOPY: Sec[] = [
		[1.7, 0.05, 0.3, 0.34],
		[1.0, 0.26, 0.32, 0.64],
		[0.0, 0.3, 0.4, 0.62],
		[-0.7, 0.16, 0.45, 0.5]
	];
	const WING: [number, number][] = [
		[0.9, 0.5],
		[-1.7, 2.4],
		[-2.4, 2.4],
		[-2.4, 0.5]
	];
	const FIN: [number, number][] = [
		[-1.2, 0],
		[-2.2, 1.0],
		[-2.6, 1.0],
		[-2.5, 0]
	];
	const sweep = yawTo([-2.6, 0, 1.9]);
	const along = Rz(-PI / 2);
	const engine = { geo: CYL, c: [0.12, 0.12, 0.13] as V3, m: along, s: [0.38, 1.5, 0.38] as V3 };
	const shipGeos = HULLS.map((hullC) =>
		merge([
			{ geo: loft(FUSE), c: hullC },
			{ geo: loft(CANOPY), c: [0.05, 0.08, 0.1] },
			{ geo: slab(WING, 0.1), c: mul(hullC, 0.7), p: [0, -0.08, 0] },
			{ geo: slab(WING, 0.1), c: mul(hullC, 0.7), p: [0, -0.08, 0], s: [1, 1, -1] },
			{ geo: slab(FIN, 0.08), c: hullC, p: [0, 0.4, 0.8], m: Rx(-PI / 2 + 0.3) },
			{ geo: slab(FIN, 0.08), c: hullC, p: [0, 0.4, -0.8], m: Rx(-PI / 2 - 0.3) },
			{ ...engine, p: [-2.1, 0, 0.55] },
			{ ...engine, p: [-2.1, 0, -0.55] }
		])
	);
	// accent lights: wing leading edges, side stripes, nozzles (unlit, so they glow)
	const AMBER: V3 = [1.6, 0.7, 0.15],
		ICE: V3 = [0.4, 1.3, 1.8];
	const nozzle = { geo: CYL, c: ICE, m: along, s: [0.3, 0.04, 0.3] as V3 };
	const glowGeo = merge([
		{ geo: BOX, c: AMBER, p: [-0.4, -0.02, 1.45], m: Ry(sweep), s: [3.1, 0.06, 0.1] },
		{ geo: BOX, c: AMBER, p: [-0.4, -0.02, -1.45], m: Ry(-sweep), s: [3.1, 0.06, 0.1] },
		{ geo: BOX, c: AMBER, p: [0.6, 0.12, 0.6], s: [1.4, 0.06, 0.04] },
		{ geo: BOX, c: AMBER, p: [0.6, 0.12, -0.6], s: [1.4, 0.06, 0.04] },
		{ ...nozzle, p: [-2.86, 0, 0.55] },
		{ ...nozzle, p: [-2.86, 0, -0.55] }
	]);
	// the fleet mark on top of both wings
	const markGeo = merge([
		{ geo: PLANE, c: [1, 1, 1], p: [-1.0, 0.0, 1.25], m: Rx(-PI / 2), s: [1.3, 0.85, 1] },
		{ geo: PLANE, c: [1, 1, 1], p: [-1.0, 0.0, -1.25], m: Rx(-PI / 2), s: [1.3, 0.85, 1] }
	]);
	const shipMat = lam([1, 1, 1], { map: TEX.hull, vertexColors: true });
	const glowMat = basic([1, 1, 1], { vertexColors: true });
	const markMat = lam([1, 1, 1], {
		map: TEX.mark,
		alphaTest: 0.5,
		polygonOffset: true,
		polygonOffsetFactor: -2
	});
	const POOL = 48;
	const pool = Array.from({ length: POOL }, () => {
		const g = new THREE.Group();
		g.visible = false;
		scene.add(g);
		const hull = new THREE.Mesh(shipGeos[0], shipMat);
		g.add(hull, new THREE.Mesh(glowGeo, glowMat), new THREE.Mesh(markGeo, markMat));
		return { g, hull };
	});

	/* ---------- per-frame ---------- */
	const tmp = new THREE.Vector3();
	const setCamera = (pos: V3, look: V3) => {
		camera.position.set(...pos);
		camera.lookAt(...look);
		camera.updateMatrixWorld();
	};
	const proj = (p: V3): V3 | null => {
		const q = tmp.set(...p).applyMatrix4(camera.matrixWorldInverse),
			z = -q.z;
		if (z < NEAR) return null;
		return [Math.round(W / 2 + (q.x * F) / z), Math.round(H / 2 - (q.y * F) / z), z];
	};
	const screenDir = (d: V3) => {
		const q = tmp.set(...d).transformDirection(camera.matrixWorldInverse);
		return [W / 2 + (q.x * F) / -q.z, H / 2 - (q.y * F) / -q.z];
	};
	/** Pixel-font text; a fractional `scale` is nearest-neighbour, so cells are 2 or 3 px etc. */
	const text = (x: number, y: number, s: string, c: V3, scale = 1, into = hud) => {
		for (let k = 0; k < s.length; k++) {
			const g = GLYPH[s[k]];
			if (g)
				for (let i = 0; i < 15; i++) {
					if (g[i] !== '1') continue;
					const gx = k * 4 + (i % 3),
						gy = (i / 3) | 0;
					const x1 = Math.round(x + (gx + 1) * scale),
						y1 = Math.round(y + (gy + 1) * scale);
					for (let py = Math.round(y + gy * scale); py < y1; py++)
						for (let px = Math.round(x + gx * scale); px < x1; px++) into.set(px, py, c);
				}
		}
	};

	/* flight paths: VTOL hops between pads, approaches from the corner, holds over a bay */
	const UP = (p: V3, h: number) => add(p, [0, h, 0]);
	const toward = (a: V3, b: V3, d: number) => add(a, mul(nrm([b[0] - a[0], 0, b[2] - a[2]]), d));
	const WAIT_FWD = mv(Ry(WAIT_YAW), [1, 0, 0]);
	// leave the corner heading for the target bay, climbing a little, then drop onto the pad
	const pathWaitToPad = (p: V3): Path => [WAIT, UP(toward(WAIT, p, 16), 3), UP(p, 12), p];
	const pathHoldToPad = (h: V3, p: V3): Path => [h, toward(h, p, 3), UP(p, 7), p];
	// bumped toward the deck edge, then lifting away to hover over the other bay
	const pathPadToHold = (p: V3, h: V3): Path => [p, add(p, [0, 2.5, 4.5]), toward(h, p, 7), h];
	const pathEntry: Path = [ENTRY, add(ENTRY, [-6, 2, -16]), add(WAIT, mul(WAIT_FWD, -9)), WAIT];
	const pathAway = (h: V3): Path => [h, UP(h, 6), add(EXIT, [-30, -20, -40]), EXIT];

	type ShipDraw = { f: number; p: V3; m: M3; thrust: number; c?: V3; b?: number };
	/**
	 * A ship along `path` at k ∈ [0, 1]. It faces its direction of travel (turning from `yaw0`
	 * at the start and to `yaw1` at the end, when given), pitches only with horizontal flight, so
	 * lift-offs and touchdowns stay level, and banks into turns.
	 */
	const flyPose = (path: Path, k: number, yaw0: number | null, yaw1: number | null) => {
		const e = smooth(0, 1, k);
		const travelYaw = (u: number) => {
			const d = bezD(path, clamp(u, 0.12, 0.88));
			return Math.hypot(d[0], d[2]) > 1e-3 ? yawTo(d) : (yaw1 ?? yaw0 ?? 0);
		};
		let yaw = travelYaw(e);
		if (yaw0 !== null) yaw = angLerp(yaw0, yaw, smooth(0, 0.3, e));
		if (yaw1 !== null) yaw = angLerp(yaw, yaw1, smooth(0.65, 1, e));
		const d = bezD(path, e);
		const len = Math.hypot(d[0], d[1], d[2]) || 1,
			horiz = Math.hypot(d[0], d[2]) / len;
		const pitch = (d[1] / len) * horiz * 0.9;
		const rate = angDiff(travelYaw(e - 0.03), travelYaw(e + 0.03)) / 0.06;
		const roll =
			clamp(-rate * 0.12, -0.7, 0.7) * horiz * smooth(0, 0.15, e) * (1 - smooth(0.8, 1, e));
		return { p: bez(path, e), m: attitude(yaw, pitch, roll), moving: k > 0 && k < 1 };
	};
	const bob = (p: V3, i = 0) => add(p, [0, 0.3 * sin(t0 * 1.7 + i), 0]);
	const hoverAtt = (yaw: number, i = 0) =>
		attitude(yaw, 0.04 * sin(t0 * 1.3 + i), 0.05 * sin(t0 * 0.9 + i));
	let t0 = 0;

	// Insertion state; advanced by the time between rendered frames.
	const STEP = 1.7, // seconds per plan step
		FAST_STEP = 0.8, // while more clicks are queued
		HOLD = 1.2, // seconds the result stays up before the next ship comes in
		MAX_QUEUE = 8,
		BOOT = 0.5; // seconds for the labels to come up bay by bay
	let lastT = NaN,
		boot = 0,
		arrive = 1, // 0..1: the next ship flying in from the corner
		departed = true,
		handled = 0,
		resets = 0,
		table = initialTable(1),
		plan: Step[] = [],
		/** Progress through `plan`, in steps; past its end, the result holds. */
		prog = 0,
		hold = 0,
		/** Table before the current plan; the deck replays the plan on top of it. */
		base = table;
	let rngN = 0;
	const rnd = () => hash2(9001, rngN++);
	const propose = () => ({ f: 1 + Math.floor(rnd() * 255), b1: Math.floor(rnd() * BUCKETS) });
	let next = propose();

	const startInsert = () => {
		base = table.map((r) => r.slice());
		plan = planInsert(base, next.f, next.b1, rnd);
		prog = 0;
		hold = 0;
		departed = false;
		// a real filter would resize; the station starts over with a fresh table
		if (plan[plan.length - 1].kind === 'fail') table = initialTable(2 + resets++);
		else {
			table = base.map((r) => r.slice());
			plan.forEach((s) => applyStep(table, s));
		}
		next = propose();
	};

	function render(t: number) {
		const dt = Number.isNaN(lastT) ? 0 : clamp(t - lastT, 0, 0.1);
		lastT = t;
		t0 = t;
		const T = ((t % LOOP) + LOOP) % LOOP,
			ph = (T / LOOP) * TAU;

		// slow drift around the rest pose
		setCamera(
			add(CAM, [2.5 * sin(ph), 1.2 * sin(ph * 2), 2 * cos(ph)]),
			add(LOOK, [2 * sin(ph + 1), 0.8 * sin(ph * 2 + 1), 0])
		);

		// clicks queue insertions (up to MAX_QUEUE); a plan keeps playing if the pointer leaves
		const hovering = hovered();
		const total = clicks();
		handled = Math.max(handled, total - MAX_QUEUE);
		if (plan.length) {
			const queued = total > handled;
			if (prog < plan.length) prog = Math.min(plan.length, prog + dt / (queued ? FAST_STEP : STEP));
			else if ((hold += dt) >= (queued ? 0.3 : HOLD)) plan = [];
		}
		if (!plan.length && total > handled && arrive > 0.9) {
			handled++;
			startInsert();
		}
		boot = clamp(boot + (hovering ? dt / BOOT : -dt / 0.2), 0, 1);
		const si = plan.length ? Math.min(plan.length - 1, Math.floor(prog)) : -1;
		const sf = plan.length ? clamp(prog - si, 0, 1) : 1;
		const step = si >= 0 ? plan[si] : undefined;
		const live = !!step && prog < plan.length; // a step is animating (not holding the result)
		// the next ship flies in from the corner once the current one has left
		if (live && si >= 1 && !departed) {
			departed = true;
			arrive = 0;
		}
		arrive = clamp(arrive + dt / 2.2, 0, 1);

		// what the deck shows: base + completed steps while a plan plays, else the settled table
		let shown = table;
		if (live) {
			shown = base.map((r) => r.slice());
			for (let i = 0; i < si; i++) applyStep(shown, plan[i]);
		}

		/* ships: parked, in flight, holding at the corner */
		const draws: ShipDraw[] = [];
		for (let b = 0; b < BUCKETS; b++)
			for (let s = 0; s < SLOTS; s++) {
				const v = shown[b][s];
				if (v === EMPTY) continue;
				if (live && (step.kind === 'kick' || step.kind === 'place') && step.b === b && step.s === s)
					continue;
				draws.push({ f: v, p: pad(b, s), m: Ry(PAD_YAW), thrust: 0, b });
			}
		const NEW: V3 = [1.3, 1.25, 0.7],
			HOT: V3 = [1.6, 0.3, 0.15],
			TXT: V3 = [0.5, 1.05, 1.3];
		const fly = (
			f: number,
			path: Path,
			k: number,
			yaw0: number | null,
			yaw1: number | null,
			c?: V3
		) => {
			const pose = flyPose(path, k, yaw0, yaw1);
			draws.push({ f, p: pose.p, m: pose.m, thrust: pose.moving ? 1 : 0, c });
		};
		let impact: V3 | null = null;
		if (live) {
			const prev = plan[si - 1];
			const fromHold = prev?.kind === 'kick';
			const c = fromHold ? HOT : NEW;
			if (step.kind === 'probe') {
				draws.push({ f: step.f, p: bob(WAIT), m: hoverAtt(WAIT_YAW), thrust: 0.6, c: NEW });
			} else if (step.kind === 'kick' || step.kind === 'place') {
				const target = pad(step.b, step.s);
				const path =
					prev?.kind === 'kick' ? pathHoldToPad(holdAt(prev.to), target) : pathWaitToPad(target);
				const k = step.kind === 'kick' ? Math.min(1, sf / 0.7) : sf;
				fly(step.f, path, k, fromHold ? null : WAIT_YAW, PAD_YAW, c);
				if (step.kind === 'kick') {
					// the resident gets shoved off its pad and heads for its other bay
					const kv = clamp((sf - 0.42) / 0.58, 0, 1);
					if (kv <= 0)
						draws.push({ f: step.victim, p: target, m: Ry(PAD_YAW), thrust: 0, c: HOT });
					else fly(step.victim, pathPadToHold(target, holdAt(step.to)), kv, PAD_YAW, null, HOT);
					if (sf > 0.4 && sf < 0.7) impact = add(target, [0, 1, 0]);
				}
			} else if (prev?.kind === 'kick') {
				fly(step.f, pathAway(holdAt(prev.to)), sf, null, null, HOT);
			}
		}
		// the next ship at the corner, flying in when the lane clears, and the queue behind it
		if (!live || si >= 1) {
			if (arrive < 1) fly(next.f, pathEntry, arrive, null, WAIT_YAW, NEW);
			else draws.push({ f: next.f, p: bob(WAIT), m: hoverAtt(WAIT_YAW), thrust: 0.6, c: NEW });
		}
		const q = total - handled;
		for (let i = 0; i < Math.min(q, 3); i++)
			draws.push({
				f: 0,
				p: bob(queueAt(i), i + 1),
				m: hoverAtt(WAIT_YAW, i + 1),
				thrust: 0.5
			});

		pool.forEach(({ g, hull }, i) => {
			const d = draws[i];
			g.visible = !!d;
			if (!d) return;
			hull.geometry = shipGeos[d.f % shipGeos.length];
			place(g, d.p, d.m, [SHIP_S, SHIP_S, SHIP_S]);
		});
		carts.forEach((g, i) => {
			const x = DECK_X0 + 6 + ((t * (3 + i) + i * 61) % (DL - 12));
			place(g, [x, 0, i === 1 ? -15.5 : 4]);
		});

		// bay status strips: cleared bays for the next ship, then the bays a step touches
		const cand =
			live && step.kind === 'probe' ? step : { b1: next.b1, b2: next.b1 ^ fpHash(next.f) };
		const showCand = (hovering && !plan.length) || (live && step.kind === 'probe');
		const bayState = (b: number) => {
			if (live && step.kind === 'kick' && (b === step.b || b === step.to)) return 2;
			if (live && step.kind === 'place' && b === step.b) return 2;
			if (showCand && (b === cand.b1 || b === cand.b2)) return 1;
			return 0;
		};
		const pulse = 0.75 + 0.25 * sin(t * 8);
		bayMats.forEach((m, b) => {
			const st = bayState(b);
			const idle: V3 = shown[b].includes(EMPTY) ? [0.3, 1.1, 1.5] : [0.35, 0.4, 0.5];
			m.color.setRGB(...(st === 2 ? mul(HOT, pulse) : st === 1 ? mul(NEW, pulse) : idle));
		});

		// space, planet, stars
		{
			const pp = proj(PLANET.c);
			if (pp) {
				space.uniforms.pc.value.set(pp[0], pp[1]);
				space.uniforms.pr.value = (PLANET.r * F) / pp[2];
			}
			space.uniforms.ld.value.copy(
				tmp.set(...PLANET_SUN).transformDirection(camera.matrixWorldInverse)
			);
			space.uniforms.ph.value = ph;
		}
		under.reset();
		for (const s of STARS) {
			const dir = add(CF, add(mul(CR, (s[0] - 0.5) * 2), mul(CU, (s[1] - 0.5) * 1.4)));
			const [x, y] = screenDir(nrm(dir));
			const tw = 0.2 + 0.3 * s[2] + 0.08 * sin(ph * 6 + s[2] * 40);
			under.plot(Math.round(x), Math.round(y), [tw * 0.8, tw * 0.85, tw]);
		}
		under.commit();

		/* HUD: lamps, bay glows, pad lights, thrusters, sparks, labels */
		hud.reset();
		for (const p of LAMPS) {
			const s = proj(add(p, [0, -0.3, 0]));
			if (!s) continue;
			const r = clamp(90 / s[2], 1.5, 6);
			hud.sprite(s[0], s[1], r * 2, [0.25, 0.25, 0.3]);
			hud.plot(s[0], s[1], [1.4, 1.4, 1.5]);
		}
		for (let b = 0; b < BUCKETS; b++) {
			// warm spill on the deck in front of each door
			const s = proj([bayX(b), 0.2, WALL_Z + 3]);
			if (s) hud.sprite(s[0], s[1], clamp(1400 / s[2], 6, 40), [0.12, 0.05, 0.01], 0.3);
			const st = bayState(b);
			const g = proj([bayX(b) + 4.5, 12.4, WALL_Z + 0.2]);
			if (st && g)
				hud.sprite(g[0], g[1], clamp(500 / g[2], 4, 14), mul(st === 2 ? HOT : NEW, 0.3 * pulse), 0.4);
		}
		for (let b = 0; b < BUCKETS; b++)
			for (let s = 0; s < SLOTS; s++) {
				const sp = proj(add(pad(b, s), [PAD / 2 - 0.4, 0.05, PAD / 2 - 0.4]));
				if (sp) hud.plot(sp[0], sp[1], shown[b][s] === EMPTY ? [0.2, 1.3, 0.5] : [1.4, 0.5, 0.1]);
			}
		for (const d of draws) {
			if (!d.thrust) continue;
			for (const sz of [0.55, -0.55]) {
				const n = proj(add(d.p, mv(d.m, mul([-2.95, 0, sz], SHIP_S))));
				if (!n) continue;
				const k = d.thrust * (0.85 + 0.15 * sin(t * 40 + d.p[0] + sz));
				const r = clamp((0.5 * SHIP_S * F) / n[2], 1.5, 14);
				hud.sprite(n[0], n[1], r * (0.8 + k * 0.6), mul([0.15, 0.45, 1.2], k));
				hud.sprite(n[0], n[1], r * 0.45, mul([0.8, 1.2, 1.5], k));
				// exhaust plume trailing behind
				for (let j = 1; j <= 4; j++) {
					const pl = proj(add(d.p, mv(d.m, mul([-2.95 - j * 0.9 * k, 0, sz], SHIP_S))));
					if (pl)
						hud.sprite(pl[0], pl[1], r * (0.9 - j * 0.12), mul([0.08, 0.25, 0.7], k * (1 - j / 5)));
				}
			}
		}
		if (impact) {
			const s = proj(impact);
			if (s) {
				const r = clamp(700 / s[2], 6, 18);
				hud.sprite(s[0], s[1], r, [0.7, 0.3, 0.06]);
				for (let i = 0; i < 16; i++) {
					const a = hash2(i, Math.floor(t * 20)) * TAU,
						rr = r * (0.3 + hash2(i, 7) * 0.9);
					hud.plot(
						Math.round(s[0] + cos(a) * rr),
						Math.round(s[1] + sin(a) * rr * 0.6),
						[1.6, 0.9, 0.3]
					);
				}
			}
		}
		// labels come up bay by bay on hover: a hull code over every ship
		if (boot > 0) {
			const upTo = boot * (BUCKETS + 1);
			for (const d of draws) {
				if (!d.f || (d.b ?? BUCKETS) >= upTo) continue;
				const s = proj(add(d.p, [0, 2.2, 0]));
				if (s) text(s[0] - 3, s[1] - 5, hex(d.f), d.c ?? TXT);
			}
			if (upTo >= BUCKETS) {
				text(6, 6, `PADS ${countFilled(shown)}/${BUCKETS * SLOTS}`, [0.5, 0.65, 0.75]);
				if (q > 0) text(6, 13, `QUEUE +${q}`, NEW);
			}
		}
		hud.commit();

		// caption: idle prompt, the next ship, then a narration of the current step
		caption.reset();
		let msg = 'HOVER TO SEE THE PADS',
			msgC: V3 = [0.6, 0.63, 0.7];
		if (step) {
			msgC = [1.5, 0.75, 0.25];
			if (step.kind === 'probe') {
				msg = `SHIP ${hex(step.f)}: CLEARED FOR ${bayName(step.b1)} OR ${bayName(step.b2)}`;
				msgC = NEW;
			} else if (step.kind === 'kick')
				msg = `${bayName(step.b)} FULL. ${hex(step.victim)} BUMPED TO ${bayName(step.to)}`;
			else if (step.kind === 'place') {
				const k = step.kicks;
				msg = live
					? `FREE PAD IN ${bayName(step.b)}`
					: k
						? `LANDED AFTER ${k} BUMP${k > 1 ? 'S' : ''}`
						: `LANDED IN ${bayName(step.b)}`;
				msgC = [0.5, 1.2, 0.9];
			} else msg = 'TOO MANY BUMPS: STATION RESET';
		} else if (hovering) {
			msg = `CLICK TO LAND ${hex(next.f)}: ${bayName(cand.b1)} OR ${bayName(cand.b2)}`;
			msgC = NEW;
		}
		const x = Math.round((W - (msg.length * 4 - 1) * 2) / 2),
			y = H - 18;
		text(x + 1, y + 1, msg, [0.01, 0.01, 0.03], 2, caption);
		text(x, y, msg, msgC, 2, caption);
		caption.commit();

		renderer.setRenderTarget(target);
		renderer.clear();
		renderer.render(space.scene, cam2d);
		renderer.render(under.scene, cam2d);
		renderer.render(scene, camera);
		renderer.render(hud.scene, cam2d);
		renderer.render(caption.scene, cam2d);
		renderer.setRenderTarget(null);
		renderer.render(post.scene, cam2d);
	}

	const dispose = () => {
		for (const x of trash) x.dispose();
		renderer.dispose();
	};

	// Compile shaders without blocking; otherwise the first render() waits for every program to link.
	try {
		// Programs depend on the active render target, so match what render() uses for each pass.
		renderer.setRenderTarget(target);
		const offscreen = [
			renderer.compileAsync(space.scene, cam2d),
			renderer.compileAsync(under.scene, cam2d),
			renderer.compileAsync(scene, camera),
			renderer.compileAsync(hud.scene, cam2d),
			renderer.compileAsync(caption.scene, cam2d)
		];
		renderer.setRenderTarget(null);
		await Promise.all([...offscreen, renderer.compileAsync(post.scene, cam2d)]);
	} catch (err) {
		dispose();
		throw err;
	}

	return { render, dispose };
}
