/**
 * PS1-style orbital station, rendered with three.js. A long cylindrical hull carries a hangar
 * module, a strut-braced landing deck cantilevered off it, and a solar truss at the far end. The
 * deck has 4 hangar bays (B1–B4) of 4 landing pads each: a cuckoo
 * filter with 4 buckets × 4 slots. Every ship is known only by its hull code (the fingerprint)
 * and is cleared for exactly two bays.
 *
 * Ships arrive from the lower-right corner and hold there. Hovering shows the codes and the next
 * ship's two bays; each click sends it in. If both bays are full, it lands on an occupied pad,
 * the resident gets bumped off and flies to its other bay, possibly bumping the next one. Clicks
 * queue up and play in order. Ships fly VTOL-style: vertical lift-off and touchdown, and in
 * between they face where they go, pitch with climbs and bank into turns.
 *
 * Rendering goes through the shared PS1 kit (low-res float target, dither, vertex snapping,
 * affine UVs). The static station is batched into one mesh per material and ships come from a
 * fixed mesh pool, so a frame is a few dozen draw calls instead of a few hundred.
 *
 * Pass order (each later pass draws over the earlier ones):
 * space + planet → stars → station and ships → HUD (lights, thrusters, labels) → caption → dither.
 */
import * as THREE from 'three';
import {
	add,
	angDiff,
	angLerp,
	clamp,
	createPs1Kit,
	cross,
	fbm,
	GLYPH,
	hash2,
	hex,
	I3,
	lerp3,
	mmul,
	mul,
	mv,
	NOISE_GLSL,
	nrm,
	PI,
	Rx,
	Ry,
	Rz,
	smooth,
	sub,
	TAU,
	vnoise,
	yawTo,
	type M3,
	type Part,
	type V3
} from '#lib/components/visualization/ps1/index.ts';

/** Render resolution (PS1-ish 3:2). */
export const W = 384;
export const H = 256;
export const LOOP = 20;

export interface StationScene {
	render(t: number): void;
	dispose(): void;
}

const { sin, cos } = Math;
/** Ship attitude: yaw about y, then pitch (nose up), then roll about the nose. */
const attitude = (yaw: number, pitch = 0, roll = 0) => mmul(mmul(Ry(yaw), Rz(pitch)), Rx(roll));

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

/* ---------- lighting & camera ---------- */
const SUN = nrm([-0.35, 0.55, -0.75]); // behind the station: rims and back-lighting
const SUNC: V3 = [0.75, 0.82, 1.0];
const AMB: V3 = [0.035, 0.038, 0.055];
const ORANGE: V3 = [1.0, 0.48, 0.12];
const FOG: V3 = [0.015, 0.02, 0.04];
const FOG0 = 70;
const FOG1 = 320;
const FOV = 0.9;
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
const DL = DECK_X1 - DECK_X0;
const DC = (DECK_X0 + DECK_X1) / 2;
// pressurised hull: a cylinder along x behind the hangar module
const HULL_Y = 6;
const HULL_Z = -46;
const HULL_R = 24;
const HULL_X0 = DECK_X0 - 18;
const HULL_X1 = DECK_X1 + 14;
const HULL_L = HULL_X1 - HULL_X0;
const HULL_C = (HULL_X0 + HULL_X1) / 2;
// hangar module: a block from the wall face back into the hull
const BLOCK_Y0 = -5;
const BLOCK_Y1 = 19.5;
const BLOCK_Z0 = -30;
const ALONG_X = Rz(-PI / 2); // turns a cylinder's axis from y to x
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
const MAX_SHIPS = BUCKETS * SLOTS + 8;

const STARS: V3[] = [];
for (let i = 0; i < 140; i++) STARS.push([hash2(i, 11), hash2(i, 12), hash2(i, 13)]);
const LAMPS: V3[] = [];
for (let x = DECK_X0 + 8; x < DECK_X1; x += 30) LAMPS.push([x, 6.5, EDGE_Z - 1]);

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
/** Deep space with faint nebula, and a planet: oceans, clouds, a lit rim and city lights at night. */
const SPACE_FS = /* glsl */ `
uniform vec2 pc;   // planet centre, pixels (y down)
uniform float pr;  // planet radius, pixels
uniform vec3 ld;   // sun direction in camera space
uniform float ph;
${NOISE_GLSL}

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

/* ---------- ship geometry: lofted cross sections and extruded outlines ---------- */
type Sec = [x: number, w: number, yb: number, yt: number];
/** Triangle soup from a list of polygons (fan-triangulated). */
function polys(list: { p: V3[]; uv: number[][] }[]) {
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
}
/** Chamfered-box cross section [x, half-width, bottom, top], counter-clockwise seen from +x. */
function ring([x, w, yb, yt]: Sec): V3[] {
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
}
/** Loft through sections running from +x (nose) to −x (tail), capped at both ends. */
function loft(secs: Sec[]) {
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
}
/** Flat 2D outline (in the xz plane) extruded `t` thick around y = 0. */
function slab(outline: [number, number][], t: number) {
	const top = outline.map(([x, z]): V3 => [x, t / 2, z]),
		bot = outline.map(([x, z]): V3 => [x, -t / 2, z]);
	const faces: V3[][] = [top.slice().reverse(), bot];
	for (let i = 0; i < outline.length; i++) {
		const j = (i + 1) % outline.length;
		faces.push([top[i], top[j], bot[j], bot[i]]);
	}
	return polys(faces.map((p) => ({ p, uv: p.map((q) => [q[0] * 0.4, q[2] * 0.4]) })));
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
	const kit = createPs1Kit(canvas, {
		width: W,
		height: H,
		fov: FOV,
		far: 3000,
		fogCap: 0.75,
		vignette: 0.3
	});
	const { camera, cam2d, F, color: C, lam, basic, BOX, PLANE, boxUV, proj } = kit;
	const CYL = kit.cylGeo(8),
		DISC = kit.cylGeo(18);

	/* textures (top-down, transparent where `fn` returns null) */
	// cut-out decals (glyphs, the fleet mark) opt out of mipmaps: averaged alpha eats their edges
	const tex = (w: number, h: number, fn: (x: number, y: number) => V3 | null, mipmaps = true) =>
		kit.makeTex(w, h, fn, { topDown: true, mipmaps });
	const gr = (v: number): V3 => [v, v, v];
	const glyphTex = (s: string, c: V3) =>
		tex(s.length * 4 + 1, 7, (x, y) => {
			const k = Math.floor((x - 1) / 4),
				gx = (x - 1) % 4,
				gy = y - 1;
			const g = GLYPH[s[k]];
			return g && gx < 3 && gy >= 0 && gy < 5 && g[gy * 3 + gx] === '1' ? c : null;
		}, false);
	const TEX = {
		hull: tex(32, 32, (x, y) => {
			let v = 0.85 + 0.2 * fbm(x * 0.25, y * 0.25);
			if (x === 0 || y === 0 || (y === 16 && x > 8)) v *= 0.6; // panel seams
			if (vnoise(x * 0.4, y * 0.4 + 9) > 0.72) v *= 0.8; // scorch marks
			return gr(v);
		}),
		plating: tex(32, 32, (x, y) => {
			let v = 0.9 + 0.14 * fbm(x * 0.2, y * 0.2);
			if (x % 16 === 0 || y % 16 === 0) v *= 0.6;
			if (x % 16 === 8 && y % 16 === 8) v *= 1.3; // vents
			if (hash2(x >> 4, y >> 4) > 0.6) v *= 0.88; // patched panels
			return gr(v);
		}),
		deck: tex(32, 32, (x, y) => {
			let v = 0.85 + 0.2 * fbm(x * 0.15, y * 0.15);
			if (x % 16 === 0 || y % 16 === 0) v *= 0.55;
			if (hash2(x >> 4, (y >> 4) + 7) > 0.7) v *= 0.85;
			if (vnoise(x * 0.3 + 5, y * 0.3) > 0.75) v *= 0.85; // skid marks
			return gr(v);
		}),
		pad: tex(16, 16, (x, y) => {
			const e = Math.min(x, y, 15 - x, 15 - y);
			const corner = (x < 4 || x > 11) && (y < 4 || y > 11);
			if (e === 0 && corner) return [1.8, 0.8, 0.2]; // corner brackets
			if (e === 0) return (x + y) % 4 < 2 ? [1.1, 0.5, 0.12] : gr(0.12); // dashed edge
			if (Math.abs(Math.hypot(x - 7.5, y - 7.5) - 4.5) < 0.6) return [0.6, 0.55, 0.45];
			return gr(0.13 + 0.03 * hash2(x, y));
		}),
		door: tex(16, 16, (x, y) => {
			if (y === 1) return [2.0, 1.0, 0.3]; // light strip under the lintel
			let v = 0.14 + 0.08 * (y / 16);
			if (x % 4 === 0) v *= 0.6; // interior frames
			if (y > 11 && hash2(x >> 1, 3) > 0.6) v *= 1.8; // equipment
			return [v, v * 0.5, v * 0.18];
		}),
		windows: tex(16, 8, (x, y) =>
			y === 3 && x % 8 > 4
				? [0.9, 0.4, 0.1]
				: y === 5 && x % 8 === 2
					? [0.3, 1.0, 1.4]
					: gr(0.18)
		),
		solar: tex(16, 16, (x, y) => {
			if (x % 8 === 0 || y % 4 === 0) return gr(0.55); // cell frames
			return [0.08, 0.12 + 0.04 * hash2(x >> 3, y >> 2), 0.35];
		}),
		radiator: tex(16, 16, (x, y) => gr(y % 4 === 0 ? 0.6 : 0.95 - 0.08 * hash2(x >> 2, y >> 2))),
		mark: tex(24, 16, cuckooMark, false),
		bays: Array.from({ length: BUCKETS }, (_, b) => glyphTex(bayName(b), [1.6, 1.45, 1.2]))
	};
	for (const t of [TEX.mark, ...TEX.bays]) t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;

	/* 2D layers and the space backdrop */
	const under = kit.layer(256); // stars
	const hud = kit.layer(8192); // lights, thrusters, labels
	const caption = kit.layer(4096); // 2× text prompt at the bottom
	const text = (x: number, y: number, s: string, c: V3, scale = 1, into = hud) =>
		kit.text(into, x, y, s, c, scale);
	const space = kit.fullscreen(SPACE_FS, {
		pc: { value: new THREE.Vector2() },
		pr: { value: 1 },
		ld: { value: new THREE.Vector3() },
		ph: { value: 0 }
	});

	/* --- station: everything static goes through one batch, one mesh per material --- */
	const scene = new THREE.Scene();
	scene.fog = new THREE.Fog(C(FOG), FOG0, FOG1);
	{
		const sun = new THREE.DirectionalLight(C(SUNC), 0.8 * PI);
		sun.position.set(...SUN);
		scene.add(sun, new THREE.AmbientLight(C(AMB), PI));
		// cool bounce from the planet, soft fill from the camera side so parked ships don't turn
		// into silhouettes, and warm spill from each hangar
		const planet = new THREE.DirectionalLight(C([0.15, 0.28, 0.5]), 0.6 * PI);
		planet.position.set(0.8, 0.3, 0.5);
		const fill = new THREE.DirectionalLight(C([0.5, 0.52, 0.6]), 0.45 * PI);
		fill.position.set(...mul(CF, -1));
		scene.add(planet, fill);
		for (let b = 0; b < BUCKETS; b++) {
			const l = new THREE.PointLight(C(ORANGE), 90 * PI, 0, 2);
			l.position.set(bayX(b), 6, WALL_Z + 4);
			scene.add(l);
		}
	}
	const statics = kit.batch();
	const box = (c: V3, s: V3, mat: THREE.Material, m: M3 = I3, geo: THREE.BufferGeometry = BOX) =>
		statics.add(mat, geo, c, m, s);
	const cyl = (
		c: V3,
		r: number,
		h: number,
		mat: THREE.Material,
		m: M3 = I3,
		geo: THREE.BufferGeometry = CYL
	) =>
		statics.add(mat, geo, c, m, [r, h, r]);
	const plating = lam([0.24, 0.24, 0.26], { map: TEX.plating });
	const steel = lam([0.16, 0.16, 0.18]);
	const dark = lam([0.06, 0.06, 0.07]);
	// decals and strips sit a hair off other surfaces; a depth offset keeps them from z-fighting
	// once vertex snapping jiggles the two surfaces independently
	const DECAL = { polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 };
	const orangeM = basic([1.6, 0.7, 0.18], DECAL);
	const cyanM = basic([0.3, 1.1, 1.5], DECAL);
	const winM = lam([1, 1, 1], {
		map: TEX.windows,
		emissive: C([0.18, 0.1, 0.04]),
		emissiveMap: TEX.windows
	});
	const DW = EDGE_Z - WALL_Z;
	/** A beam of thickness `r` from `a` to `b`. */
	const strut = (a: V3, b: V3, r: number, mat: THREE.Material) => {
		const d = sub(b, a),
			len = Math.hypot(...d),
			y = mul(d, 1 / len);
		const x = nrm(cross(y, Math.abs(y[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])),
			z = cross(x, y);
		box(mul(add(a, b), 0.5), [r, len, r], mat, [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]]);
	};
	/** Unit cylinder whose UVs repeat `us` times around and along it. */
	const cylUV = (segs: number, us: [number, number]) => {
		const g = kit.keep(kit.cylGeo(segs).clone()),
			a = g.getAttribute('uv');
		for (let i = 0; i < a.count; i++) a.setXY(i, a.getX(i) * us[0], a.getY(i) * us[1]);
		return g;
	};

	// the deck: a long slab with an edge rail, light strips and a truss underneath
	const deckM = lam([0.3, 0.3, 0.32], { map: TEX.deck });
	box([DC, -1.5, (WALL_Z + EDGE_Z) / 2], [DL, 3, DW], deckM, I3, boxUV([DL / 8, DW / 8]));
	box([DC, -4.5, -6], [DL, 3, 24], plating, I3, boxUV([DL / 8, 1]));
	for (let i = 0, x = DECK_X0 + 4; x < DECK_X1; x += 3.2, i++) {
		box([x, -1.2, EDGE_Z + 0.02], [1.6, 0.2, 0.05], i % 7 === 3 ? cyanM : orangeM);
		box([x, 1.0, EDGE_Z - 0.3], [0.12, 2, 0.12], steel);
	}
	box([DC, 2.0, EDGE_Z - 0.3], [DL, 0.15, 0.15], steel);
	box([DC, 1.0, EDGE_Z - 0.3], [DL, 0.1, 0.1], steel);
	// the deck hangs off the hangar module; diagonal struts brace its front edge against the hull
	const strutXs: number[] = [];
	for (let x = DECK_X0 + 10; x < DECK_X1; x += 24) strutXs.push(x);
	const strutTop = (x: number): V3 => [x, -5.5, 5],
		strutFoot = (x: number): V3 => [x, -14, -34]; // just inside the hull skin
	for (const [i, x] of strutXs.entries()) {
		strut(strutTop(x), strutFoot(x), 0.9, steel);
		box([x, -6.3, -6], [0.8, 0.6, 24], steel); // cross beam under the deck
		box([x + 1.5, -6.2, 6.05], [2, 0.3, 0.2], orangeM);
		const nx = strutXs[i + 1];
		if (nx !== undefined) strut(strutTop(x), lerp3(strutTop(nx), strutFoot(nx), 0.5), 0.5, steel);
	}
	{
		// lower chord through the strut midpoints
		const x0 = strutXs[0],
			x1 = strutXs[strutXs.length - 1];
		const m = lerp3(strutTop(0), strutFoot(0), 0.5);
		box([(x0 + x1) / 2, m[1], m[2]], [x1 - x0, 0.7, 0.7], steel);
	}

	// the pressurised hull: one long cylinder with ring frames and stepped end caps
	const HULL_CYL = kit.cylGeo(24);
	const hullGeo = cylUV(24, [18, HULL_L / 8]);
	cyl([HULL_C, HULL_Y, HULL_Z], HULL_R, HULL_L, plating, ALONG_X, hullGeo);
	const frames = [HULL_X0 + 2, HULL_X1 - 2];
	for (let b = 0; b <= BUCKETS; b++) frames.push(bayX(b) - BAY_DX / 2); // in line with the pillars
	for (const x of frames) cyl([x, HULL_Y, HULL_Z], HULL_R + 0.7, 1.6, steel, ALONG_X, HULL_CYL);
	for (const [x, dir] of [
		[HULL_X0, -1],
		[HULL_X1, 1]
	]) {
		cyl([x + dir * 1.5, HULL_Y, HULL_Z], HULL_R - 4, 3, plating, ALONG_X, HULL_CYL);
		cyl([x + dir * 4.5, HULL_Y, HULL_Z], HULL_R - 11, 3, plating, ALONG_X, HULL_CYL);
		cyl([x + dir * 6.3, HULL_Y, HULL_Z], 5, 0.6, orangeM, ALONG_X); // docking collar
	}
	// window bands along the upper hull, above the hangar module
	for (const th of [0.73, 1.0]) {
		const r = HULL_R + 0.1;
		box(
			[DC, HULL_Y + r * sin(th), HULL_Z + r * cos(th)],
			[DL, 0.2, 1.4],
			winM,
			Rx(PI / 2 - th),
			boxUV([DL / 16, 1])
		);
	}
	// topside: a dish, a radiator stack and a smaller service module riding on the hull
	const top = HULL_Y + HULL_R;
	cyl([40, top + 1, HULL_Z + 2], 1.5, 3, steel);
	cyl([40, top + 3, HULL_Z + 2], 4, 0.5, lam([0.5, 0.5, 0.52]), Rx(-0.8), DISC);
	const radM = lam([0.5, 0.52, 0.56], { map: TEX.radiator });
	for (const [i, th] of [1.75, 1.95, 2.15].entries()) {
		const c = HULL_R + 5;
		box(
			[-2 + i * 2, HULL_Y + c * sin(th), HULL_Z + c * cos(th)],
			[14, 10, 0.25],
			radM,
			Rx(PI / 2 - th),
			boxUV([2, 1])
		);
	}
	cyl([100, top + 3, HULL_Z - 6], 5, 40, plating, ALONG_X, cylUV(24, [4, 5]));
	for (const x of [80, 120]) cyl([x, top + 3, HULL_Z - 6], 3.5, 2, steel, ALONG_X, HULL_CYL);
	for (const x of [90, 110]) box([x, top + 0.5, HULL_Z - 6], [2, 3, 2], steel);

	// power: a spine runs out of the far end cap to a truss carrying four pairs of solar wings
	const SOLAR_X = 172;
	{
		const x0 = HULL_X1 + 6;
		cyl([(x0 + SOLAR_X) / 2, HULL_Y, HULL_Z], 2.5, SOLAR_X - x0, steel, ALONG_X);
		box([SOLAR_X, HULL_Y, -52], [1.6, 1.6, 96], steel);
		for (let z = -98; z <= -6; z += 12) box([SOLAR_X, HULL_Y, z], [2.4, 2.4, 0.8], dark);
		const solarM = lam([0.4, 0.45, 0.7], { map: TEX.solar });
		for (const z of [-88, -66, -36, -14]) {
			box([SOLAR_X, HULL_Y, z], [0.3, 58, 0.3], steel);
			for (const dy of [-1, 1])
				box([SOLAR_X, HULL_Y + dy * 16, z], [0.15, 26, 10], solarM, Ry(0.4), boxUV([2, 5]));
		}
	}

	// the hangar module: a flat-faced block set into the hull, doors between angular pillars
	box(
		[DC, (BLOCK_Y0 + BLOCK_Y1) / 2, (WALL_Z + BLOCK_Z0) / 2],
		[DL, BLOCK_Y1 - BLOCK_Y0, WALL_Z - BLOCK_Z0],
		plating,
		I3,
		boxUV([DL / 8, (BLOCK_Y1 - BLOCK_Y0) / 8])
	);
	box([DC, BLOCK_Y1 - 0.3, WALL_Z - 0.6], [DL + 0.4, 1.6, 2.4], steel, Rx(0.5)); // top lip
	for (const x of [DECK_X0, DECK_X1]) box([x, 7, -24], [1.2, 25, 13], steel); // end plates
	const doorM = basic([1, 1, 1], { map: TEX.door, ...DECAL });
	// each bay's status strip has its own material, recoloured every frame
	const bayMats = Array.from({ length: BUCKETS }, () => basic([0.3, 1.1, 1.5], DECAL));
	for (let b = 0; b < BUCKETS; b++) {
		const x = bayX(b);
		box([x, DOOR_H / 2, WALL_Z + 0.02], [DOOR_W, DOOR_H, 1], doorM, I3, PLANE);
		box([x, DOOR_H + 0.4, WALL_Z + 0.6], [DOOR_W + 1, 0.8, 1.2], steel); // lintel
		box([x, DOOR_H + 0.95, WALL_Z + 1.25], [DOOR_W - 1, 0.15, 0.1], orangeM);
		const plate = basic([1, 1, 1], { map: TEX.bays[b], alphaTest: 0.5, ...DECAL });
		box([x - 3.5, 13.6, WALL_Z + 0.05], [8.4, 6.5, 1], plate, I3, PLANE);
		box([x + 4.5, 12.4, WALL_Z + 0.1], [4.5, 0.4, 0.1], bayMats[b]); // bay status strip
		box([x + 4.5, 13.8, WALL_Z + 0.1], [2.5, 0.2, 0.1], orangeM);
	}
	for (let b = 0; b <= BUCKETS; b++) {
		const x = bayX(b) - BAY_DX / 2;
		box([x, 8, WALL_Z + 1.2], [PILLAR_W, 16, 2.4], plating);
		box([x, 17, WALL_Z + 0.6], [PILLAR_W + 1.5, 3, 3.6], plating, Rx(-0.3));
		box([x, 3.5, WALL_Z + 2.45], [0.25, 3, 0.1], orangeM);
		box([x, 15.2, WALL_Z + 2.2], [1.6, 0.3, 0.1], cyanM);
	}
	// cargo on the deck
	const crate = lam([0.45, 0.43, 0.4], { map: TEX.hull });
	for (let b = 0; b <= BUCKETS; b++) {
		const x = bayX(b) - BAY_DX / 2;
		if (b % 3 === 1) continue;
		box([x, 0.8, -14], [2.6, 1.6, 2.2], crate, Ry(0.1 * b));
		box([x + 0.3, 2.2, -14.2], [2, 1.2, 1.8], crate);
	}
	box([DECK_X1 - 10, 1.4, -6], [8, 2.8, 4], crate);
	box([DECK_X1 - 10, 3.6, -6], [6, 1.6, 3.6], crate);
	for (const p of LAMPS) {
		box([p[0], p[1] / 2, p[2]], [0.25, p[1], 0.25], steel);
		box(p, [0.9, 0.3, 0.5], dark);
	}
	// landing pads
	const padM = basic([1, 1, 1], { map: TEX.pad, ...DECAL });
	for (let b = 0; b < BUCKETS; b++)
		for (let s = 0; s < SLOTS; s++)
			box(add(pad(b, s), [0, 0.03, 0]), [PAD, PAD, 1], padM, Rx(-PI / 2), PLANE);
	statics.build(scene);

	/*
	 * --- moving things: a pool of meshes per geometry, transforms rewritten every frame ---
	 * Not InstancedMesh: measured on ANGLE/D3D11, instancing ~20 ships cost ~0.45 ms more GPU time
	 * per frame than plain meshes, while saving only ~0.08 ms of CPU.
	 */
	const pooled = (geo: THREE.BufferGeometry, mat: THREE.Material, max: number) => {
		const meshes = Array.from({ length: max }, () => {
			const o = new THREE.Mesh(geo, mat);
			o.matrixAutoUpdate = false;
			o.visible = false;
			scene.add(o);
			return o;
		});
		let n = 0;
		return {
			/** Show the next mesh at translate(p) · rotate(r) · scale(s). */
			push(p: V3, r: M3, s: V3) {
				if (n < max) kit.place(meshes[n++], p, r, s);
			},
			reset: () => (n = 0),
			/** Hide the meshes not used this frame. */
			commit: () => meshes.forEach((o, i) => (o.visible = i < n))
		};
	};
	// cargo carts running along the deck
	const carts = pooled(
		kit.mergeGeometry(
			[
				{ geo: BOX, p: [0, 0.6, 0], s: [2.4, 1, 1.4], c: [0.5, 0.42, 0.2] },
				{ geo: BOX, p: [-0.5, 1.3, 0], s: [0.9, 0.5, 1.2], c: [0.06, 0.06, 0.07] }
			],
			{ colors: true }
		),
		lam([1, 1, 1], { vertexColors: true }),
		3
	);

	// ships: four hull tones, plus unlit accent lights and the fleet mark shared by all
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
	const engine: Part = { geo: CYL, c: [0.12, 0.12, 0.13], m: along, s: [0.38, 1.5, 0.38] };
	const hulls = HULLS.map((hullC) => {
		const fuse = loft(FUSE),
			canopy = loft(CANOPY),
			wing = slab(WING, 0.1),
			fin = slab(FIN, 0.08);
		const geo = kit.mergeGeometry(
			[
				{ geo: fuse, c: hullC },
				{ geo: canopy, c: [0.05, 0.08, 0.1] },
				{ geo: wing, c: mul(hullC, 0.7), p: [0, -0.08, 0] },
				{ geo: wing, c: mul(hullC, 0.7), p: [0, -0.08, 0], s: [1, 1, -1] },
				{ geo: fin, c: hullC, p: [0, 0.4, 0.8], m: Rx(-PI / 2 + 0.3) },
				{ geo: fin, c: hullC, p: [0, 0.4, -0.8], m: Rx(-PI / 2 - 0.3) },
				{ ...engine, p: [-2.1, 0, 0.55] },
				{ ...engine, p: [-2.1, 0, -0.55] }
			],
			{ colors: true }
		);
		for (const g of [fuse, canopy, wing, fin]) g.dispose();
		return geo;
	});
	const shipMat = lam([1, 1, 1], { map: TEX.hull, vertexColors: true });
	const hullPool = hulls.map((g) => pooled(g, shipMat, MAX_SHIPS));
	const AMBER: V3 = [1.6, 0.7, 0.15],
		ICE: V3 = [0.4, 1.3, 1.8];
	const nozzle: Part = { geo: CYL, c: ICE, m: along, s: [0.3, 0.04, 0.3] };
	const glowPool = pooled(
		kit.mergeGeometry(
			[
				{ geo: BOX, c: AMBER, p: [-0.4, -0.02, 1.45], m: Ry(sweep), s: [3.1, 0.06, 0.1] },
				{ geo: BOX, c: AMBER, p: [-0.4, -0.02, -1.45], m: Ry(-sweep), s: [3.1, 0.06, 0.1] },
				{ geo: BOX, c: AMBER, p: [0.6, 0.12, 0.6], s: [1.4, 0.06, 0.04] },
				{ geo: BOX, c: AMBER, p: [0.6, 0.12, -0.6], s: [1.4, 0.06, 0.04] },
				{ ...nozzle, p: [-2.86, 0, 0.55] },
				{ ...nozzle, p: [-2.86, 0, -0.55] }
			],
			{ colors: true }
		),
		basic([1, 1, 1], { vertexColors: true }),
		MAX_SHIPS
	);
	const markPool = pooled(
		kit.mergeGeometry([
			{ geo: PLANE, p: [-1.0, 0.0, 1.25], m: Rx(-PI / 2), s: [1.3, 0.85, 1] },
			{ geo: PLANE, p: [-1.0, 0.0, -1.25], m: Rx(-PI / 2), s: [1.3, 0.85, 1] }
		]),
		lam([1, 1, 1], { map: TEX.mark, alphaTest: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }),
		MAX_SHIPS
	);
	const ships = [...hullPool, glowPool, markPool];
	const SHIP_SCALE: V3 = [SHIP_S, SHIP_S, SHIP_S];

	/* ---------- per-frame ---------- */
	const setCamera = (pos: V3, look: V3) => {
		camera.position.set(...pos);
		camera.lookAt(...look);
		camera.updateMatrixWorld();
	};
	const planetSun = new THREE.Vector3();

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
	let t0 = 0;
	const bob = (p: V3, i = 0) => add(p, [0, 0.3 * sin(t0 * 1.7 + i), 0]);
	const hoverAtt = (yaw: number, i = 0) =>
		attitude(yaw, 0.04 * sin(t0 * 1.3 + i), 0.05 * sin(t0 * 0.9 + i));
	const PARKED = Ry(PAD_YAW);

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

	const NEW: V3 = [1.3, 1.25, 0.7],
		HOT: V3 = [1.6, 0.3, 0.15],
		TXT: V3 = [0.5, 1.05, 1.3];

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
				draws.push({ f: v, p: pad(b, s), m: PARKED, thrust: 0, b });
			}
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
					if (kv <= 0) draws.push({ f: step.victim, p: target, m: PARKED, thrust: 0, c: HOT });
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

		for (const s of ships) s.reset();
		for (const d of draws.slice(0, MAX_SHIPS)) {
			hullPool[d.f % hullPool.length].push(d.p, d.m, SHIP_SCALE);
			glowPool.push(d.p, d.m, SHIP_SCALE);
			markPool.push(d.p, d.m, SHIP_SCALE);
		}
		for (const s of ships) s.commit();
		carts.reset();
		for (let i = 0; i < 3; i++) {
			const x = DECK_X0 + 6 + ((t * (3 + i) + i * 61) % (DL - 12));
			carts.push([x, 0, i === 1 ? -15.5 : 4], I3, [1, 1, 1]);
		}
		carts.commit();

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
				planetSun.set(...PLANET_SUN).transformDirection(camera.matrixWorldInverse)
			);
			space.uniforms.ph.value = ph;
		}
		under.reset();
		for (const s of STARS) {
			const dir = add(CF, add(mul(CR, (s[0] - 0.5) * 2), mul(CU, (s[1] - 0.5) * 1.4)));
			const [x, y] = kit.screenDir(nrm(dir));
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

		kit.frame(() => {
			const r = kit.renderer;
			r.render(space.scene, cam2d);
			r.render(under.scene, cam2d);
			r.render(scene, camera);
			r.render(hud.scene, cam2d);
			r.render(caption.scene, cam2d);
		});
	}

	// Compile shaders without blocking; otherwise the first render() waits for every program to link.
	try {
		await kit.compile([
			[space.scene, cam2d],
			[under.scene, cam2d],
			[scene, camera],
			[hud.scene, cam2d],
			[caption.scene, cam2d]
		]);
	} catch (err) {
		kit.dispose();
		throw err;
	}

	return { render, dispose: kit.dispose };
}
