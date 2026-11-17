/**
 * PS1-style harbor at dusk, rendered with three.js: a drone scans four container "lanes".
 *
 * Everything renders at 384×256 into a float target, then a post pass applies a vignette and
 * quantises to 15-bit colour with a 4×4 ordered dither. Mesh materials are patched for PS1
 * vertex snapping, affine texture mapping and capped linear fog. Sky and water are a shader;
 * stars, light sprites and HUD digits are 2D pixel layers, so they stay crisp and pixel-aligned.
 *
 * Pass order (each later pass draws over the earlier ones):
 * sky/water → stars + light reflections → far silhouettes → far lights → harbor → HUD → dither.
 */
import * as THREE from 'three';

/** Render resolution (PS1-ish 3:2). */
export const W = 384;
export const H = 256;
export const LOOP = 12;

type V3 = [number, number, number];
type M3 = number[];

export interface HarborScene {
	render(t: number): void;
	dispose(): void;
}

/* ---------- math ---------- */
const { sin, cos } = Math;
const TAU = Math.PI * 2;
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
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
const mix3 = (a: V3, b: V3, t: number): V3 => [
	lerp(a[0], b[0], t),
	lerp(a[1], b[1], t),
	lerp(a[2], b[2], t)
];
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const smooth = (e0: number, e1: number, x: number) => {
	const t = clamp((x - e0) / (e1 - e0), 0, 1);
	return t * t * (3 - 2 * t);
};
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
const mv = (m: M3, v: V3): V3 => [
	m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
	m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
	m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
];
const polar = (a: number, d: number, y: number): V3 => [d * sin(a), y, -d * cos(a)];
const yawTo = (d: V3) => Math.atan2(-d[2], d[0]);
const C = (c: V3) => new THREE.Color(c[0], c[1], c[2]);

/* ---------- noise (mirrored in the sky shader) ---------- */
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

/* ---------- lighting & camera constants ---------- */
const SUN_VIS = nrm([sin(-0.5), 0.012, -cos(-0.5)]);
const SUN = nrm([sin(-0.5), 0.25, -cos(-0.5)]);
const SUNC: V3 = [1.0, 0.48, 0.2];
const AMB: V3 = [0.1, 0.11, 0.18];
const BLUE: V3 = [0.18, 0.55, 1.0];
const ORANGE: V3 = [1.0, 0.5, 0.12];
const FOG: V3 = [0.17, 0.09, 0.11];
const FOG0 = 25;
const FOG1 = 480;
const FOV = 0.9;
const NEAR = 0.15;
const F = H / 2 / Math.tan(FOV / 2);

/* ---------- static layout ---------- */
// dock edge line: DA + u*DE, inland along DN
const DA: V3 = [-19.7, 0, 1.1];
const DE = nrm([7.1, 0, -4.5]);
const DN: V3 = [-DE[2], 0, DE[0]];
const dockP = (u: number, v: number, y = 0): V3 => [
	DA[0] + DE[0] * u + DN[0] * v,
	y,
	DA[2] + DE[2] * u + DN[2] * v
];
const US: number[] = [];
for (let u = 0; u <= 60; u += 2.5) US.push(u);
US.push(72, 90, 120, 170);
const VS = [0, 2, 4, 6.5, 9, 12, 16, 22, 30, 45, 70];

// 2×2 container stack; cpt(along, up, depth) in stack space
const PHI = 0.32;
const CA: V3 = [cos(PHI), 0, sin(PHI)];
const CN: V3 = [-sin(PHI), 0, cos(PHI)];
const CK = mul(CN, -1);
const UP: V3 = [0, 1, 0];
const CO = dockP(26.2, 1.0);
const CW = 2.44,
	CGAP = 0.08,
	CHH = 2.6,
	CL = 6.06,
	SW = CW * 2 + CGAP,
	SH = CHH * 2 + 0.05;
const cpt = (a: number, u: number, k: number) =>
	add(add(add(CO, mul(CA, a)), mul(UP, u)), mul(CK, k));
const FACE_C = cpt(SW / 2, SH / 2, 0);

const CRANES = [
	{ a: -0.66, d: 230, s: 1.0 },
	{ a: -0.33, d: 330, s: 1.0 },
	{ a: -0.235, d: 420, s: 1.0 },
	{ a: -0.83, d: 300, s: 0.9 }
];
const SHIP = { a: -0.13, d: 300 };
const TOWER = polar(0.74, 44, 0);

interface FarLight {
	p: V3;
	c: V3;
	k: number;
	blink?: boolean;
}
const FAR: FarLight[] = [];
for (let i = 0; i < 70; i++) {
	const a = -1.3 + (i / 70) * 1.9 + hash2(i, 3) * 0.02,
		d = 520 + hash2(i, 7) * 120;
	FAR.push({
		p: polar(a, d, 1 + hash2(i, 9) * 5),
		c: hash2(i, 1) > 0.25 ? [1.0, 0.62, 0.25] : [1.0, 0.9, 0.7],
		k: 0.5 + hash2(i, 2) * 0.6
	});
}
for (const cr of CRANES) {
	const b = polar(cr.a, cr.d, 0);
	FAR.push({ p: add(b, [0, 56 * cr.s, 0]), c: [1, 0.2, 0.1], k: 1.2, blink: true });
	FAR.push({ p: add(b, [0, 34, 0]), c: [1, 0.75, 0.35], k: 1 });
}
{
	const sb = polar(SHIP.a, SHIP.d, 0);
	for (let i = 0; i < 12; i++)
		FAR.push({ p: add(sb, [-25 + i * 4.5, 7 + (i > 7 ? 6 : 0), 0]), c: [1, 0.7, 0.35], k: 0.9 });
	FAR.push({ p: add(sb, [10, 26, 0]), c: [1, 0.3, 0.15], k: 1, blink: true });
}
const STARS: V3[] = [];
for (let i = 0; i < 90; i++)
	STARS.push([hash2(i, 11) * 700 - 250, 0.45 + hash2(i, 12) * 0.55, hash2(i, 13)]);

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
	'.': '000000000000010'
};
const LANE_BYTES = [
	[0x3a, 0x80, 0x7f, 0x3a],
	[0x80, 0x1c, 0x9e, 0x5d]
];

/* ---------- shaders ---------- */
/** Snap a clip-space position to the 384×256 pixel grid (PS1 integer vertices). */
const snap = (v: string) =>
	`if (${v}.w > 0.0) ${v}.xy = floor(${v}.xy / ${v}.w * vec2(${W / 2}.0, ${H / 2}.0) + 0.5) / vec2(${W / 2}.0, ${H / 2}.0) * ${v}.w;`;

/** Patch a built-in material: vertex snapping, affine (non-perspective) UVs, fog capped at 62 %. */
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
			gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, clamp((vFogDepth - fogNear) / (fogFar - fogNear), 0.0, 1.0) * 0.62);
			#endif`
		);
}

const FULLSCREEN_VS = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const SKY_FS = /* glsl */ `
uniform float hy;
uniform vec2 sun;
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
vec3 skyCol(float h) {
	if (h <= 0.05) return mix(vec3(1.0, 0.55, 0.2), vec3(0.9, 0.32, 0.13), h / 0.05);
	if (h <= 0.18) return mix(vec3(0.9, 0.32, 0.13), vec3(0.45, 0.15, 0.15), (h - 0.05) / 0.13);
	if (h <= 0.38) return mix(vec3(0.45, 0.15, 0.15), vec3(0.15, 0.09, 0.17), (h - 0.18) / 0.2);
	if (h <= 0.65) return mix(vec3(0.15, 0.09, 0.17), vec3(0.05, 0.06, 0.13), (h - 0.38) / 0.27);
	return mix(vec3(0.05, 0.06, 0.13), vec3(0.02, 0.025, 0.07), (h - 0.65) / 0.35);
}

void main() {
	float x = floor(gl_FragCoord.x), y = ${H - 1}.0 - floor(gl_FragCoord.y);
	float rx = x - sun.x;
	vec3 col;
	if (y < hy) {
		float h = clamp((hy - y) / hy, 0.0, 1.0), yy = hy - y;
		col = skyCol(h);
		// thin cloud streaks, lit from the sun side
		float band = smoothstep(0.06, 0.2, h) * (1.0 - smoothstep(0.62, 0.85, h));
		if (band > 0.0) {
			float c = smoothstep(0.5, 0.68, fbm((rx + sin(ph) * 4.0) * 0.014, yy * 0.09)) * band;
			if (c > 0.0) {
				float lit = clamp(1.1 - h * 1.2, 0.15, 1.0) * (0.6 + 0.4 * exp(-(rx * rx) / 40000.0));
				vec3 cc = mix(vec3(0.07, 0.05, 0.11), vec3(0.95, 0.38, 0.18), lit * smoothstep(0.55, 0.75, fbm(rx * 0.03 + 5.0, yy * 0.2)));
				col = mix(col, cc, c * 0.9);
			}
		}
		float gx = rx / 90.0, gy = (y - sun.y) / 28.0;
		col += vec3(0.75, 0.33, 0.1) * exp(-(gx * gx + gy * gy));
	} else {
		float k = clamp((y - hy) / (${H}.0 - hy), 0.0, 1.0), dy = y - hy;
		col = mix(vec3(0.42, 0.17, 0.1), vec3(0.035, 0.045, 0.08), smoothstep(0.0, 0.45, k));
		float n = vnoise(rx * 2.2 / (dy + 4.0) + cos(ph) * 3.0, dy * 0.75 + sin(ph) * 3.0);
		float wv = (n - 0.5) * 0.1 * (1.0 - k);
		col += vec3(wv, wv * 0.5, wv * 0.6);
		// sun glitter column
		float wdt = 5.0 + dy * 0.9;
		if (n > 0.52) { float s = exp(-(rx * rx) / (wdt * wdt)) * (1.0 - k * 0.6) * 1.3; col += vec3(s, s * 0.45, s * 0.13); }
		float gl = exp(-(rx * rx) / 9000.0 - dy / 25.0) * 0.25;
		col += vec3(gl, gl * 0.4, 0.0);
	}
	vec2 d = vec2(x, y) - floor(sun + 0.5);
	if (dot(d, d) <= 30.0 && sun.y + d.y < hy) col = vec3(1.4, 0.95, 0.6);
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
	float v = 1.0 - 0.28 * (dx * dx * 0.6 + dy * dy);
	float d = (float(BAYER[(iy & 3) * 4 + (ip.x & 3)]) + 0.5) / 16.0;
	gl_FragColor = vec4(min(vec3(31.0), floor(clamp(c * v, 0.0, 1.0) * 31.0 + d)) / 31.0, 1.0);
}`;

/** 1px lines; drawn 5× with pixel offsets to fake the glow halo. */
const LINE_VS = /* glsl */ `
attribute vec3 lcol;
attribute float glow;
uniform vec2 off;
uniform float halo;
varying vec3 vC;
void main() {
	vC = halo > 0.5 ? lcol * glow : lcol;
	vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	${snap('p')}
	p.xy += (off + vec2(0.5, -0.5)) * vec2(${2 / W}, ${2 / H}) * p.w;
	gl_Position = p;
}`;
const COLOR_FS = /* glsl */ `varying vec3 vC; void main() { gl_FragColor = vec4(vC, 1.0); }`;

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

/* ---------- scene ---------- */
export interface HarborOptions {
	/** Read every frame: while true, the drone locks on and reports the matching slots. */
	detecting?: () => boolean;
}

export function createHarborScene(
	canvas: HTMLCanvasElement,
	{ detecting = () => false }: HarborOptions = {}
): HarborScene {
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

	const camera = new THREE.PerspectiveCamera((FOV * 180) / Math.PI, W / H, NEAR, 2000);
	const cam2d = new THREE.OrthographicCamera(0, W, 0, H, -1, 1); // pixel space, y down

	/* textures: float data so texel values can exceed 1 (bright paint, bolts) */
	const makeTex = (w: number, h: number, fn: (x: number, y: number) => V3) => {
		const d = new Float32Array(w * h * 4);
		for (let y = 0; y < h; y++)
			for (let x = 0; x < w; x++) {
				const c = fn(x, y);
				d.set([c[0], c[1], c[2], 1], (y * w + x) * 4);
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
	const TEX = {
		end: makeTex(32, 32, (x, y) => {
			let v = x % 4 === 0 ? 0.72 : x % 4 === 1 ? 1.12 : 0.95;
			if (x === 9 || x === 22) v = 1.4;
			if ((y === 9 || y === 23) && ((x >= 7 && x <= 11) || (x >= 20 && x <= 24))) v = 1.45;
			if (x === 15 || x === 16) v = 0.5;
			if (x < 2 || x > 29 || y < 2 || y > 29) v = 0.5;
			if ((x < 3 || x > 28) && (y < 3 || y > 28)) v = 1.0;
			return gr(v * (0.88 + hash2(x, y) * 0.18));
		}),
		side: makeTex(32, 32, (x, y) => {
			let v = x % 3 === 0 ? 0.7 : x % 3 === 1 ? 1.15 : 0.95;
			if (y < 2 || y > 29) v = 0.55;
			if (x === 0) v = 0.5;
			const rust = vnoise(x * 0.3, y * 0.3) > 0.72 ? 0.8 : 1;
			return [v * (0.9 + hash2(x, y) * 0.15), v * rust * 0.95, v * rust * 0.9];
		}),
		top: makeTex(16, 16, (x, y) => gr((y % 3 === 0 ? 0.7 : 1) * (0.85 + hash2(x + 9, y) * 0.2))),
		concrete: makeTex(32, 32, (x, y) => {
			let v = 0.7 + 0.45 * fbm(x * 0.22, y * 0.22) + (hash2(x, y) > 0.93 ? 0.35 : 0);
			if (x === 0 || y === 0) v *= 0.55;
			return gr(v);
		}),
		dash: makeTex(16, 4, (x) => (x < 9 ? [1.7, 1.25, 0.25] : gr(0.6))),
		grid: makeTex(16, 16, (x, y) =>
			x % 8 === 0 || y % 8 === 0 ? gr(1) : x % 4 === 0 && y % 4 === 0 ? gr(0.5) : gr(0.05)
		),
		panel: makeTex(16, 16, (x, y) =>
			gr(
				x === 0 || y === 0
					? 0.6
					: ((x === 2 || x === 13) && (y === 2 || y === 13) ? 1.3 : 1) *
							(0.92 + hash2(x + 3, y + 5) * 0.12)
			)
		)
	};

	/* materials */
	const ps1 = <T extends THREE.Material>(m: T): T => {
		m.onBeforeCompile = ps1Patch;
		return keep(m);
	};
	const lam = (col: V3, o: THREE.MeshLambertMaterialParameters = {}) =>
		ps1(new THREE.MeshLambertMaterial({ color: C(col), flatShading: true, ...o }));
	const basic = (col: V3, o: THREE.MeshBasicMaterialParameters = {}) =>
		ps1(new THREE.MeshBasicMaterial({ color: C(col), ...o }));
	// Additive, unsorted overlays (beam, grid, rotor blur): blending without the transparent queue,
	// so renderOrder alone decides when they draw.
	const ADD = {
		blending: THREE.AdditiveBlending,
		depthTest: false,
		depthWrite: false,
		fog: false,
		side: THREE.DoubleSide
	} as const;

	/* geometry helpers */
	const BOX = keep(new THREE.BoxGeometry(1, 1, 1)); // face groups +x −x +y −y +z −z
	const boxUV = (us: [number, number]) => {
		const g = keep(BOX.clone()),
			a = g.getAttribute('uv');
		for (let i = 0; i < a.count; i++) a.setXY(i, a.getX(i) * us[0], a.getY(i) * us[1]);
		return g;
	};
	const cylCache = new Map<string, THREE.CylinderGeometry>();
	const cylGeo = (segs: number, open = false) => {
		const key = `${segs}:${open}`;
		if (!cylCache.has(key))
			cylCache.set(key, keep(new THREE.CylinderGeometry(1, 1, 1, segs, 1, open)));
		return cylCache.get(key)!;
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
		m: M3,
		s: V3,
		ro = 3
	) => {
		const o = place(new THREE.Mesh(geo, mat), p, m, s);
		o.renderOrder = ro;
		parent.add(o);
		return o;
	};
	const box = (parent: THREE.Object3D, c: V3, s: V3, m: M3, mat: Mat, ro = 3, geo = BOX) =>
		mesh(parent, geo, mat, c, m, s, ro);
	const cyl = (
		parent: THREE.Object3D,
		c: V3,
		r: number,
		h: number,
		segs: number,
		m: M3,
		mat: Mat,
		open = false
	) => mesh(parent, cylGeo(segs, open), mat, c, m, [r, h, r]);

	/** Static quads with per-corner colours that can change every frame. */
	const quads = (list: { p: V3[]; uv: number[][]; n: V3 }[]) => {
		const count = list.length * 6;
		const pos = new Float32Array(count * 3),
			uv = new Float32Array(count * 2),
			col = new Float32Array(count * 3).fill(1);
		const order = list.map((q, qi) => {
			const flip = dot(cross(sub(q.p[1], q.p[0]), sub(q.p[2], q.p[0])), q.n) < 0;
			const idx = flip ? [0, 2, 1, 0, 3, 2] : [0, 1, 2, 0, 2, 3];
			idx.forEach((k, s) => {
				pos.set(q.p[k], (qi * 6 + s) * 3);
				uv.set(q.uv[k], (qi * 6 + s) * 2);
			});
			return idx;
		});
		const geo = keep(new THREE.BufferGeometry());
		const colAttr = new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage);
		geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
		geo.setAttribute('color', colAttr);
		geo.computeVertexNormals();
		return {
			geo,
			color(qi: number, cs: V3[]) {
				order[qi].forEach((k, s) => col.set(cs[k], (qi * 6 + s) * 3));
				colAttr.needsUpdate = true;
			}
		};
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
		const addPx = pixels(THREE.AdditiveBlending, 0),
			setPx = pixels(THREE.NormalBlending, 1);
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
		scene.add(noCull(new THREE.Points(glows.geo, glowMat), 2));
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
	const under = layer(4096); // stars + water reflections
	const far = layer(256); // distant lights over the silhouettes
	const hud = layer(1024); // sprites + byte readouts over the harbor
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
	const sky = fullscreen(SKY_FS, {
		hy: { value: 0 },
		sun: { value: new THREE.Vector2() },
		ph: { value: 0 }
	});
	const post = fullscreen(POST_FS, { tDiffuse: { value: target.texture } });

	const withLights = (scene: THREE.Scene) => {
		scene.fog = new THREE.Fog(C(FOG), FOG0, FOG1);
		// three's Lambert divides by π; scale intensities so colours match the hand-tuned values
		const sun = new THREE.DirectionalLight(C(SUNC), 0.95 * Math.PI);
		sun.position.set(...SUN);
		scene.add(sun, new THREE.AmbientLight(C(AMB), Math.PI));
		scene.add(new THREE.HemisphereLight(C([0.08, 0.08, 0.128]), C([0, 0, 0]), Math.PI));
		return scene;
	};

	/* --- far silhouettes: cranes, ship, opposite shore --- */
	const bgScene = withLights(new THREE.Scene());
	const darkMat = lam([0.07, 0.05, 0.07]);
	for (const cr of CRANES) {
		const base = polar(cr.a, cr.d, 0),
			m = Ry(yawTo(nrm([-1, 0, 0.35]))),
			s = cr.s;
		const P = (x: number, y: number, z: number) => add(base, mv(m, [x * s, y * s, z * s]));
		const b = (c: V3, size: V3, mm = m) => box(bgScene, c, mul(size, s), mm, darkMat, 0);
		for (const lx of [-8, 8]) for (const lz of [-6, 6]) b(P(lx, 17, lz), [1.6, 34, 1.6]);
		for (const z of [-6, 6]) {
			b(P(0, 33, z), [18, 2.2, 1.6]);
			b(P(0, 12, z), [16, 1.2, 1]);
		}
		b(P(15, 37, 0), [82, 2.6, 3]);
		b(P(2, 41, 0), [10, 5, 9]);
		b(P(-3, 47, 0), [1.4, 18, 1.4], mmul(m, Rz(-0.25)));
		b(P(3, 47, 0), [1.4, 18, 1.4], mmul(m, Rz(0.25)));
	}
	{
		const sb = polar(SHIP.a, SHIP.d, 0),
			sm = Ry(0.08),
			mat = lam([0.06, 0.05, 0.07]);
		box(bgScene, add(sb, [0, 3, 0]), [62, 7, 10], sm, mat, 0);
		box(bgScene, add(sb, [16, 11, 0]), [10, 10, 9], sm, mat, 0);
		box(bgScene, add(sb, [-8, 9, 0]), [26, 5, 9], sm, mat, 0);
		box(bgScene, add(sb, [10, 20, 0]), [1, 12, 1], sm, mat, 0);
		box(bgScene, polar(-0.3, 600, 3), [1400, 6, 20], Ry(-0.3), lam([0.05, 0.04, 0.06]), 0);
	}

	/* --- harbor --- */
	const scene = withLights(new THREE.Scene());
	const blueLight = new THREE.PointLight(C(BLUE), 5 * Math.PI, 0, 1); // glow off the container face
	scene.add(blueLight);

	// dock slab: per-vertex colours carry the sun streak, the container's blue spill and drone glow
	const dockQuads: { p: V3[]; uv: number[][]; n: V3 }[] = [];
	for (let i = 0; i + 1 < US.length; i++)
		for (let j = 0; j + 1 < VS.length; j++) {
			const p = [
				dockP(US[i], VS[j]),
				dockP(US[i + 1], VS[j]),
				dockP(US[i + 1], VS[j + 1]),
				dockP(US[i], VS[j + 1])
			];
			dockQuads.push({ p, uv: p.map((q) => [q[0] * 0.25, q[2] * 0.25]), n: UP });
		}
	const dock = quads(dockQuads);
	scene.add(
		noCull(new THREE.Mesh(dock.geo, basic([1, 1, 1], { map: TEX.concrete, vertexColors: true })), 1)
	);

	// painted edge band + lane line, drawn over the slab without depth test
	const decalQuads: { p: V3[]; uv: number[][]; n: V3 }[] = [];
	for (let i = 0; i + 1 < US.length; i++) {
		const u0 = US[i],
			u1 = US[i + 1];
		decalQuads.push({
			p: [dockP(u0, 0), dockP(u1, 0), dockP(u1, 0.35), dockP(u0, 0.35)],
			uv: [
				[u0 / 2, 0],
				[u1 / 2, 0],
				[u1 / 2, 1],
				[u0 / 2, 1]
			],
			n: UP
		});
		decalQuads.push({
			p: [dockP(u0, 7.2), dockP(u1, 7.2), dockP(u1, 7.45), dockP(u0, 7.45)],
			uv: [
				[u0 / 3, 0],
				[u1 / 3, 0],
				[u1 / 3, 1],
				[u0 / 3, 1]
			],
			n: UP
		});
	}
	const decals = quads(decalQuads);
	scene.add(
		noCull(
			new THREE.Mesh(
				decals.geo,
				basic([1, 1, 1], {
					map: TEX.dash,
					vertexColors: true,
					depthTest: false,
					depthWrite: false,
					side: THREE.DoubleSide
				})
			),
			2
		)
	);

	// wet reflection of the glowing container face
	const wet = quads([
		{
			p: [cpt(0, 0, 0), cpt(SW, 0, 0), cpt(SW, -SH * 0.8, 0), cpt(0, -SH * 0.8, 0)],
			uv: [
				[0, 2],
				[2, 2],
				[2, 0.4],
				[0, 0.4]
			],
			n: CN
		}
	]);
	scene.add(
		noCull(
			new THREE.Mesh(wet.geo, basic([1, 1, 1], { map: TEX.end, vertexColors: true, ...ADD })),
			2
		)
	);

	// bollards
	for (const u of [19.5, 22.3, 24.6]) {
		const b = dockP(u, 0.75);
		cyl(scene, add(b, [0, 0.22, 0]), 0.19, 0.44, 7, I3, lam([0.5, 0.42, 0.4]));
		cyl(scene, add(b, [0, 0.48, 0]), 0.28, 0.1, 7, I3, lam([0.55, 0.46, 0.42]));
	}

	// lattice tower
	{
		const m = Ry(0.3),
			mat = lam([0.13, 0.1, 0.11]);
		const P = (x: number, y: number, z: number) => add(TOWER, mv(m, [x, y, z]));
		for (const [lx, lz] of [
			[-2, -2],
			[2, -2],
			[2, 2],
			[-2, 2]
		])
			box(scene, P(lx, 24, lz), [0.5, 48, 0.5], m, mat);
		box(scene, P(6, 47, 0), [22, 1.6, 2], m, mat);
	}

	// containers: hand-lit faces (front glows with the scan)
	const F00 = cpt(0, 0, 0),
		F10 = cpt(SW, 0, 0),
		F11 = cpt(SW, SH, 0),
		F01 = cpt(0, SH, 0);
	const B00 = cpt(0, 0, CL),
		B10 = cpt(SW, 0, CL),
		B11 = cpt(SW, SH, CL),
		B01 = cpt(0, SH, CL);
	const faceUV = [
		[0, 2],
		[2, 2],
		[2, 0],
		[0, 0]
	];
	const contFront = quads([{ p: [F00, F10, F11, F01], uv: faceUV, n: CN }]);
	const contRight = quads([{ p: [F10, B10, B11, F11], uv: faceUV, n: CA }]);
	const contLeft = quads([{ p: [B00, F00, F01, B01], uv: faceUV, n: mul(CA, -1) }]);
	const contTop = quads([
		{
			p: [F01, F11, B11, B01],
			uv: [
				[0, 0],
				[2, 0],
				[2, 3],
				[0, 3]
			],
			n: UP
		}
	]);
	contLeft.color(0, [
		[0.1, 0.1, 0.14],
		[0.1, 0.1, 0.14],
		[0.1, 0.1, 0.14],
		[0.1, 0.1, 0.14]
	]);
	contTop.color(0, [
		[0.3, 0.33, 0.42],
		[0.3, 0.3, 0.38],
		[0.25, 0.18, 0.18],
		[0.25, 0.18, 0.2]
	]);
	for (const [q, map] of [
		[contFront, TEX.end],
		[contRight, TEX.side],
		[contLeft, TEX.side],
		[contTop, TEX.top]
	] as const)
		mesh(scene, q.geo, basic([1, 1, 1], { map, vertexColors: true }), [0, 0, 0], I3, [1, 1, 1]);

	// drone (local +x is the lens direction); fill light from the camera is baked into emissive
	const drone = new THREE.Group();
	scene.add(drone);
	const blades: { mesh: THREE.Mesh; rc: V3; spin: number; phase: number }[] = [];
	{
		const body: V3 = [1.0, 0.98, 1.0],
			dark: V3 = [0.2, 0.2, 0.23],
			EO: V3 = [1.4, 0.65, 0.12];
		const dlam = (col: V3, o: THREE.MeshLambertMaterialParameters = {}) =>
			lam(col, { emissive: C([col[0] * 0.28, col[1] * 0.27, col[2] * 0.3]), ...o });
		const darkM = dlam(dark),
			glowM = basic(EO, { fog: false });
		box(drone, [0, 0, 0], [1.35, 0.72, 1.05], I3, dlam(body, { map: TEX.panel }), 3, boxUV([2, 1]));
		box(drone, [-0.05, 0.47, 0], [0.95, 0.24, 0.8], I3, dlam(mul(body, 1.05), { map: TEX.panel }));
		box(drone, [0.05, -0.43, 0], [0.9, 0.16, 0.7], I3, [darkM, darkM, darkM, glowM, darkM, darkM]);
		for (const sz of [1, -1])
			for (const sy of [0.12, -0.05])
				box(drone, [0.05, sy, sz * 0.535], [0.55, 0.07, 0.03], I3, glowM);
		cyl(drone, [0.78, -0.12, 0], 0.24, 0.3, 8, Rz(-Math.PI / 2), [
			darkM,
			basic([0.6, 1.2, 1.6]),
			darkM
		]);
		const armM = dlam(mul(body, 0.8)),
			ringM = dlam([0.4, 0.4, 0.43], { side: THREE.DoubleSide });
		const bladeM = dlam([0.25, 0.25, 0.28]),
			blurM = basic([0.035, 0.03, 0.03], ADD);
		const disc = keep(new THREE.CircleGeometry(0.66, 10).rotateX(-Math.PI / 2));
		for (const sx of [1, -1])
			for (const sz of [1, -1]) {
				const rc: V3 = [sx * 1.2, 0.18, sz * 1.2];
				box(drone, [sx * 0.65, 0.12, sz * 0.65], [1.2, 0.12, 0.14], Ry(Math.atan2(-sz, sx)), armM);
				cyl(drone, rc, 0.72, 0.14, 12, I3, ringM, true);
				cyl(drone, add(rc, [0, -0.02, 0]), 0.13, 0.22, 6, I3, [darkM, darkM, glowM]);
				blades.push({ mesh: box(drone, rc, [1, 1, 1], I3, bladeM), rc, spin: sx * sz, phase: sx });
				mesh(drone, disc, blurM, add(rc, [0, 0.1, 0]), I3, [1, 1, 1], 4);
			}
		box(drone, [-0.3, 0.9, 0.25], [0.05, 0.7, 0.05], I3, darkM);
	}

	// scan beam, scan plane, face grid
	const beam = dynBuffer(15, { position: 3, color: 3 });
	scene.add(noCull(new THREE.Mesh(beam.geo, basic([1, 1, 1], { vertexColors: true, ...ADD })), 4));
	const e = 0.03;
	const Fc = [cpt(-e, -e, -e), cpt(SW + e, -e, -e), cpt(SW + e, SH + e, -e), cpt(-e, SH + e, -e)];
	const grid = quads([
		{
			p: Fc,
			uv: [
				[0, 3],
				[3, 3],
				[3, 0],
				[0, 0]
			],
			n: CN
		}
	]);
	const gridMat = basic([1, 1, 1], { map: TEX.grid, ...ADD });
	scene.add(noCull(new THREE.Mesh(grid.geo, gridMat), 4));

	// glowing 1px lines: core + four offset halo passes
	const lines = dynBuffer(512, { position: 3, lcol: 3, glow: 1 });
	for (const [x, y, halo] of [
		[0, 0, 0],
		[1, 0, 1],
		[-1, 0, 1],
		[0, 1, 1],
		[0, -1, 1]
	]) {
		const mat = keep(
			new THREE.ShaderMaterial({
				vertexShader: LINE_VS,
				fragmentShader: COLOR_FS,
				uniforms: { off: { value: new THREE.Vector2(x, y) }, halo: { value: halo } },
				blending: THREE.AdditiveBlending,
				depthTest: false,
				depthWrite: false
			})
		);
		scene.add(noCull(new THREE.LineSegments(lines.geo, mat), 5));
	}
	const line = (a: V3, b: V3, c: V3, glow = 0) => {
		lines.push({ position: a, lcol: c, glow: [glow] });
		lines.push({ position: b, lcol: c, glow: [glow] });
	};

	/* ---------- per-frame ---------- */
	let CP: V3 = [0, 0, 0],
		CF: V3 = [0, 0, -1];
	const tmp = new THREE.Vector3();
	const setCamera = (pos: V3, yaw: number, pitch: number) => {
		CP = pos;
		CF = [sin(yaw) * cos(pitch), sin(pitch), -cos(yaw) * cos(pitch)];
		camera.position.set(...pos);
		camera.lookAt(pos[0] + CF[0], pos[1] + CF[1], pos[2] + CF[2]);
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

	// Detection state; advanced by the time between rendered frames.
	const LOCK_IN = 0.5,
		LOCK_OUT = 0.7,
		RESOLVE = 0.7; // seconds after hover until the bytes settle
	let lastT = NaN,
		det = 0,
		scanPh = 0,
		hovering = false,
		since = 0,
		hovers = 0,
		bytes = LANE_BYTES[0];

	function render(t: number) {
		const dt = Number.isNaN(lastT) ? 0 : clamp(t - lastT, 0, 0.1);
		lastT = t;
		const T = ((t % LOOP) + LOOP) % LOOP,
			ph = (T / LOOP) * TAU;
		setCamera(
			[0.35 * sin(ph), 1.15 + 0.06 * sin(ph * 2 + 1), 0.4 * cos(ph) - 0.4],
			0.025 * sin(ph),
			0.125 + 0.008 * sin(ph * 2)
		);

		// idle: the scan line sweeps; detecting: lock on, then the bytes resolve and matches flash
		const wanted = detecting();
		if (wanted !== hovering) {
			since = 0;
			if (wanted) bytes = LANE_BYTES[hovers++ % LANE_BYTES.length];
		}
		hovering = wanted;
		since += dt;
		det = clamp(det + (wanted ? dt / LOCK_IN : -dt / LOCK_OUT), 0, 1);
		const lock = smooth(0, 1, det);
		const resolved = hovering && since > RESOLVE;
		const flash = resolved ? lock * (0.5 + 0.5 * cos((since - RESOLVE) * 9)) : 0;
		scanPh += dt * (1.3 + 1.5 * lock);
		const scanY = 0.5 + 0.45 * sin(scanPh);
		const blueK = 0.85 + lock * 0.25;

		// drone hovers and turns toward the container face
		const P = add(
			[-2.9, 4.0, -9.6],
			[0.12 * sin(ph * 2), 0.14 * sin(ph * 3), 0.1 * sin(ph * 2 + 2)]
		);
		const m = mmul(
			mmul(Ry(yawTo(sub(FACE_C, P)) + 0.04 * sin(ph * 2)), Rz(-0.1 + 0.03 * sin(ph * 3 + 1))),
			Rx(0.05 * sin(ph * 4))
		);
		place(drone, P, m);
		const rotA = T * ((TAU * 290) / LOOP);
		for (const b of blades)
			place(b.mesh, add(b.rc, [0, 0.1, 0]), Ry(rotA * b.spin + b.phase), [1.3, 0.02, 0.1]);
		blueLight.position.set(...add(FACE_C, mul(CN, 1.5)));
		blueLight.intensity = 5 * Math.PI * blueK;

		// sky, stars, light reflections on the water
		const hy = screenDir(nrm([CF[0], 0, CF[2]]))[1];
		const [sx, sy] = screenDir(SUN_VIS);
		sky.uniforms.hy.value = hy;
		sky.uniforms.sun.value.set(sx, sy);
		sky.uniforms.ph.value = ph;
		under.reset();
		for (const s of STARS) {
			const x = Math.round(sx + s[0]),
				y = Math.round(hy - s[1] * hy);
			if (y < 0 || y >= hy - 10) continue;
			const tw = 0.3 + 0.25 * sin(ph * 6 + s[2] * 40);
			under.plot(x, y, [tw * 0.8, tw * 0.85, tw]);
		}
		const farProj = FAR.map((L) => ({
			s: proj(L.p),
			c: L.c,
			k: L.k * (L.blink ? (sin(ph * 6 + L.p[0]) > 0.3 ? 1 : 0.15) : 1)
		}));
		farProj.forEach((L, idx) => {
			if (!L.s) return;
			const len = Math.min(30, 6 + (900 / L.s[2]) * 4);
			for (let d = 2; d < len; d++) {
				const y = Math.round(hy) + d;
				if (y >= H) break;
				if (vnoise(d * 0.6 + sin(ph) * 3 + idx, idx * 7.3 + cos(ph) * 3) > 0.55)
					under.plot(L.s[0], y, mul(L.c, (1 - d / len) * 0.5 * L.k));
			}
		});
		under.commit();

		far.reset();
		for (const L of farProj)
			if (L.s) {
				far.plot(L.s[0], L.s[1], mul(L.c, L.k));
				if (L.k > 0.9) far.sprite(L.s[0], L.s[1], 2.5, mul(L.c, 0.35));
			}
		far.commit();

		// dock lighting
		const fb = cpt(SW / 2, 0, 0);
		const cols = US.map((uu) =>
			VS.map((vv) => {
				const p = dockP(uu, vv);
				const vd = nrm(sub(p, CP)),
					s = Math.max(0, dot([vd[0], -vd[1], vd[2]], SUN_VIS));
				let c = add([0.06, 0.07, 0.1], mul(SUNC, Math.pow(s, 40) * 0.9 + Math.pow(s, 6) * 0.1));
				const dx = p[0] - fb[0],
					dz = p[2] - fb[2];
				c = add(c, mul(BLUE, (0.9 * blueK) / (1 + (dx * dx + dz * dz) * 0.05)));
				const ex = p[0] - P[0],
					ez = p[2] - P[2];
				return add(c, mul(ORANGE, 0.22 / (1 + (ex * ex + ez * ez) * 0.15)));
			})
		);
		let qi = 0;
		for (let i = 0; i + 1 < US.length; i++)
			for (let j = 0; j + 1 < VS.length; j++)
				dock.color(qi++, [cols[i][j], cols[i + 1][j], cols[i + 1][j + 1], cols[i][j + 1]]);
		for (let i = 0; i + 1 < US.length; i++) {
			const k: V3 = [0.55, 0.5, 0.45],
				k2: V3 = [0.4, 0.37, 0.33];
			const a = add(k, cols[i][0]),
				b = add(k, cols[i + 1][0]);
			decals.color(i * 2, [a, b, b, a]);
			const c = add(k2, cols[i][3]),
				d = add(k2, cols[i + 1][3]);
			decals.color(i * 2 + 1, [c, d, d, c]);
		}
		const wb = mul(BLUE, 0.35 * blueK);
		wet.color(0, [wb, wb, [0, 0, 0], [0, 0, 0]]);

		// container faces brighten with the scan lock
		const kk = 0.85 + (lock * 0.6 + 0.2) * 0.35;
		const ec: V3 = [0.2 * kk, 0.33 * kk, 0.55 * kk],
			ectop: V3 = [0.3 * kk, 0.45 * kk, 0.7 * kk];
		const sc: V3 = [0.42, 0.26, 0.2],
			sd: V3 = [0.16, 0.1, 0.1];
		contFront.color(0, [ec, mul(ec, 0.9), mul(ectop, 0.9), ectop]);
		contRight.color(0, [mix3(sc, ec, 0.3), sd, mul(sd, 1.2), mix3(sc, ectop, 0.3)]);

		// scan beam + plane + grid
		const lens = add(P, mv(m, [0.95, -0.12, 0]));
		const bk = 0.8 + lock * 0.35;
		const cL: V3 = [0.16 * bk, 0.42 * bk, 0.85 * bk],
			cF: V3 = [0.02 * bk, 0.07 * bk, 0.16 * bk];
		const tri = (ps: V3[], cs: V3[]) =>
			ps.forEach((p, i) => beam.push({ position: p, color: cs[i] }));
		beam.reset();
		for (let i = 0; i < 4; i++) tri([lens, Fc[i], Fc[(i + 1) % 4]], [cL, cF, cF]);
		const sl = cpt(-e, SH * scanY, -0.05),
			sr = cpt(SW + e, SH * scanY, -0.05);
		tri(
			[lens, sl, sr],
			[
				[0.15, 0.35, 0.6],
				[0.06, 0.2, 0.4],
				[0.06, 0.2, 0.4]
			]
		);
		beam.commit();
		gridMat.color.setRGB(...mul([0.03, 0.09, 0.18], 0.4 + lock * 0.6));

		// glowing lines: scan line, container outlines
		lines.reset();
		line(sl, sr, [0.5, 0.95, 1.3], 0.3);
		const EC: V3 = [0.22, 0.6, 1.1];
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 2; j++) {
				const a0 = j * (CW + CGAP),
					a1 = a0 + CW,
					u0 = i * (CHH + 0.05),
					u1 = u0 + CHH,
					z = -0.03;
				line(cpt(a0, u0, z), cpt(a1, u0, z), EC, 0.22);
				line(cpt(a1, u0, z), cpt(a1, u1, z), EC, 0.22);
				line(cpt(a1, u1, z), cpt(a0, u1, z), EC, 0.22);
				line(cpt(a0, u1, z), cpt(a0, u0, z), EC, 0.22);
			}
		const vis = (n: V3, p: V3) => dot(n, sub(CP, p)) > 0;
		const rV = vis(CA, cpt(SW, 0, 0)),
			lV = vis(mul(CA, -1), cpt(0, 0, 0)),
			tV = vis(UP, cpt(0, SH, 0));
		if (rV || tV) line(cpt(SW, SH, 0), cpt(SW, SH, CL), mul(EC, 0.45), 0.15);
		if (lV || tV) line(cpt(0, SH, 0), cpt(0, SH, CL), mul(EC, 0.35), 0.1);
		if (rV) line(cpt(SW, 0, 0), cpt(SW, 0, CL), mul(EC, 0.45), 0.15);
		line(cpt(0, 0, 0), cpt(SW, 0, 0), [0.3, 0.75, 1.3], 0.35);

		// HUD: tower lights, face corners, reticles + byte readouts, drone glows
		hud.reset();
		for (const y of [14, 28, 42, 48]) {
			const s = proj(add(TOWER, [0, y, 0]));
			if (s) {
				hud.plot(s[0], s[1], [1.3, 0.7, 0.3]);
				hud.sprite(s[0], s[1], 3, [0.4, 0.2, 0.05]);
			}
		}
		for (const a of [0, SW / 2, SW])
			for (const uu of [0, SH / 2, SH]) {
				const s = proj(cpt(a, uu, -0.05));
				if (s) hud.sprite(s[0], s[1], 3, [0.25, 0.6, 1.0]);
			}
		const want = bytes[0] === 0x3a ? 0x3a : 0x5d;
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 2; j++) {
				const lane = (1 - i) * 2 + j;
				const Cc = cpt(j * (CW + CGAP) + CW / 2, i * (CHH + 0.05) + CHH / 2, -0.06);
				const sz = lerp(0.95, 0.55, lock) + 0.03 * sin(ph * 8 + lane);
				const match = resolved && lock > 0.5 && bytes[lane] === want;
				const col = match
					? mix3([1.2, 0.55, 0.12], [1.6, 1.0, 0.4], flash)
					: ([0.55, 0.95, 1.3] as V3);
				for (const sa of [-1, 1])
					for (const su of [-1, 1]) {
						const k = add(Cc, add(mul(CA, sa * sz), mul(UP, su * sz)));
						line(k, add(k, mul(CA, -sa * 0.28)), col, 0.25);
						line(k, add(k, mul(UP, -su * 0.28)), col, 0.25);
					}
				line(add(Cc, mul(CA, -0.13)), add(Cc, mul(CA, 0.13)), col, 0.2);
				line(add(Cc, mul(UP, -0.13)), add(Cc, mul(UP, 0.13)), col, 0.2);
				const lp = proj(add(Cc, add(mul(UP, -sz - 0.12), mul(CA, -0.25))));
				if (lp) {
					const v = resolved ? bytes[lane] : Math.floor(hash2(lane, Math.floor(t * 14)) * 256);
					text(
						lp[0] - 3,
						lp[1],
						v.toString(16).toUpperCase().padStart(2, '0'),
						match ? [1.5, 0.75, 0.2] : [0.6, 1.0, 1.4]
					);
				}
				if (match) {
					const s = proj(Cc);
					if (s) hud.sprite(s[0], s[1], 14, mul([0.5, 0.22, 0.04], 0.4 + flash * 0.6));
				}
			}
		lines.commit();
		const ls = proj(lens);
		if (ls) {
			hud.sprite(ls[0], ls[1], 9, [0.3, 0.65, 1.1]);
			hud.sprite(ls[0], ls[1], 3, [0.8, 1.0, 1.2]);
		}
		for (const rx of [1, -1])
			for (const rz of [1, -1]) {
				const s = proj(add(P, mv(m, [rx * 1.2, 0.0, rz * 1.2])));
				if (s) hud.sprite(s[0], s[1] + 1, 5, [0.55, 0.25, 0.05], 0.7);
			}
		const bs = proj(add(P, mv(m, [0.05, -0.5, 0])));
		if (bs) hud.sprite(bs[0], bs[1], 8, [0.35, 0.15, 0.02], 0.5);
		hud.commit();

		// caption: a static, dimmed prompt while idle; on hover, the lookup the drone performs
		caption.reset();
		const hex = want.toString(16).toUpperCase().padStart(2, '0');
		const slots = [0, 1, 2, 3].filter((l) => bytes[l] === want);
		const [msg, msgC]: [string, V3] = !hovering
			? ['HOVER TO CHECK ALL 4 SLOTS AT ONCE', [0.6, 0.63, 0.7]]
			: !resolved
				? [`FINGERPRINT ${hex}: COMPARING...`, [0.6, 1.0, 1.4]]
				: [
						`FINGERPRINT ${hex}: FOUND IN SLOT${slots.length > 1 ? 'S' : ''} ${slots.join(' ')}`,
						[1.5, 0.8, 0.25]
					];
		const x = Math.round((W - (msg.length * 4 - 1) * 2) / 2),
			y = H - 18;
		text(x + 1, y + 1, msg, [0.01, 0.01, 0.03], 2, caption);
		text(x, y, msg, msgC, 2, caption);
		caption.commit();

		renderer.setRenderTarget(target);
		renderer.clear();
		renderer.render(sky.scene, cam2d);
		renderer.render(under.scene, cam2d);
		renderer.render(bgScene, camera);
		renderer.render(far.scene, cam2d);
		renderer.clearDepth(); // the harbor always draws over the far silhouettes
		renderer.render(scene, camera);
		renderer.render(hud.scene, cam2d);
		renderer.render(caption.scene, cam2d);
		renderer.setRenderTarget(null);
		renderer.render(post.scene, cam2d);
	}

	return {
		render,
		dispose() {
			for (const x of trash) x.dispose();
			renderer.dispose();
		}
	};
}
