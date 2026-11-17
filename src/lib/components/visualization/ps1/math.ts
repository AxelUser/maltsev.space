/** Small allocation-light vector math, rotations and value noise for the PS1 scenes. */

export type V3 = [number, number, number];
/** Row-major 3×3 matrix. */
export type M3 = number[];

const { sin, cos } = Math;
export const PI = Math.PI;
export const TAU = PI * 2;

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];
export const nrm = (a: V3): V3 => {
	const l = Math.hypot(a[0], a[1], a[2]) || 1;
	return [a[0] / l, a[1] / l, a[2] / l];
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: V3, b: V3, t: number): V3 => [
	lerp(a[0], b[0], t),
	lerp(a[1], b[1], t),
	lerp(a[2], b[2], t)
];
export const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
/** Smoothstep. */
export const smooth = (e0: number, e1: number, x: number) => {
	const t = clamp((x - e0) / (e1 - e0), 0, 1);
	return t * t * (3 - 2 * t);
};
/** Shortest signed angle from a to b. */
export const angDiff = (a: number, b: number) => ((((b - a + PI) % TAU) + TAU) % TAU) - PI;
export const angLerp = (a: number, b: number, t: number) => a + angDiff(a, b) * t;

export const mmul = (a: M3, b: M3): M3 => {
	const r = new Array<number>(9);
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++)
			r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
	return r;
};
export const Rx = (a: number): M3 => [1, 0, 0, 0, cos(a), -sin(a), 0, sin(a), cos(a)];
export const Ry = (a: number): M3 => [cos(a), 0, sin(a), 0, 1, 0, -sin(a), 0, cos(a)];
export const Rz = (a: number): M3 => [cos(a), -sin(a), 0, sin(a), cos(a), 0, 0, 0, 1];
export const I3: M3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export const det3 = (m: M3) =>
	m[0] * (m[4] * m[8] - m[5] * m[7]) -
	m[1] * (m[3] * m[8] - m[5] * m[6]) +
	m[2] * (m[3] * m[7] - m[4] * m[6]);
export const mv = (m: M3, v: V3): V3 => [
	m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
	m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
	m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
];
/** Yaw (about +y) that turns local +x toward `d` in the ground plane. */
export const yawTo = (d: V3) => Math.atan2(-d[2], d[0]);

/* ---------- noise (mirrored by the GLSL in the scenes' sky shaders) ---------- */
export function hash2(x: number, y: number) {
	let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	h ^= h >>> 16;
	return (h >>> 0) / 4294967296;
}
export function vnoise(x: number, y: number) {
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
export const fbm = (x: number, y: number) =>
	vnoise(x, y) * 0.55 + vnoise(x * 2.1 + 7, y * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3 + 3) * 0.15;

/** GLSL versions of `hash2`, `vnoise` and `fbm`, for fragment shaders. */
export const NOISE_GLSL = /* glsl */ `
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
}`;
