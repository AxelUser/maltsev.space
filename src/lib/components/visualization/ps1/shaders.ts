/** GLSL shared by the PS1 scenes. Resolution-dependent pieces are functions of the render size. */

/** Snap a clip-space position `v` to the w×h pixel grid (PS1 integer vertices). */
export const snapClip = (v: string, w: number, h: number) =>
	`if (${v}.w > 0.0) ${v}.xy = floor(${v}.xy / ${v}.w * vec2(${w / 2}.0, ${h / 2}.0) + 0.5) / vec2(${w / 2}.0, ${h / 2}.0) * ${v}.w;`;

/**
 * `onBeforeCompile` for built-in materials: vertex snapping, affine (non-perspective) UVs, and
 * linear fog capped at `fogCap`, so distant shapes keep some contrast.
 */
export const ps1Patch =
	(w: number, h: number, fogCap: number) =>
	(sh: { vertexShader: string; fragmentShader: string }) => {
		const decl = '#include <common>\n#ifdef USE_MAP\nvarying vec3 vAffine;\n#endif';
		sh.vertexShader = sh.vertexShader.replace('#include <common>', decl).replace(
			'#include <project_vertex>',
			`#include <project_vertex>
			${snapClip('gl_Position', w, h)}
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
			gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, clamp((vFogDepth - fogNear) / (fogFar - fogNear), 0.0, 1.0) * ${fogCap.toFixed(3)});
			#endif`
			);
	};

export const FULLSCREEN_VS = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

/** Vignette, then quantise to 15-bit colour with a 4×4 ordered dither. */
export const postShader = (w: number, h: number, vignette: number) => /* glsl */ `
uniform sampler2D tDiffuse;
const int BAYER[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
void main() {
	ivec2 ip = ivec2(gl_FragCoord.xy);
	int iy = ${h - 1} - ip.y;
	vec3 c = texelFetch(tDiffuse, ip, 0).rgb;
	float dx = (float(ip.x) - ${w / 2}.0) / ${w / 2}.0, dy = (float(iy) - ${h / 2}.0) / ${h / 2}.0;
	float v = 1.0 - ${vignette.toFixed(3)} * (dx * dx * 0.6 + dy * dy);
	float d = (float(BAYER[(iy & 3) * 4 + (ip.x & 3)]) + 0.5) / 16.0;
	gl_FragColor = vec4(min(vec3(31.0), floor(clamp(c * v, 0.0, 1.0) * 31.0 + d)) / 31.0, 1.0);
}`;

/** Soft round sprite in screen pixels: (1 - d)² falloff, optional vertical squash. */
export const GLOW_VS = /* glsl */ `
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
export const GLOW_FS = /* glsl */ `
varying vec3 vC;
varying float vR, vS, vSize;
void main() {
	vec2 p = (gl_PointCoord - 0.5) * vSize;
	float d = length(vec2(p.x, p.y / vS)) / vR;
	if (d >= 1.0) discard;
	gl_FragColor = vec4(vC * (1.0 - d) * (1.0 - d), 1.0);
}`;
