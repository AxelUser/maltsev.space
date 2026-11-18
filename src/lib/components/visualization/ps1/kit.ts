/**
 * Shared plumbing for the PS1-style canvas scenes: a renderer that draws into a low-resolution
 * float target and dithers it to the screen, PS1-patched materials, float data textures, static
 * batching, per-frame vertex buffers that upload only what they draw, 2D pixel layers (pixels,
 * text, glow sprites) and camera projection helpers.
 *
 * Everything created through the kit is disposed by `dispose()`.
 */
import * as THREE from 'three';
import { GLYPH } from './font';
import { add, det3, I3, mv, type M3, type V3 } from './math';
import { FULLSCREEN_VS, GLOW_FS, GLOW_VS, postShader, ps1Patch } from './shaders';

export interface Ps1KitOptions {
	/** Render resolution. */
	width: number;
	height: number;
	/** Vertical field of view, radians. */
	fov: number;
	near?: number;
	far?: number;
	/** How far fog may pull a colour toward the fog colour (0..1). */
	fogCap?: number;
	/** Vignette strength in the post pass. */
	vignette?: number;
}

type Disposable = { dispose(): void };
type Mat = THREE.Material | THREE.Material[];

/** A transformed piece of geometry, baked by `mergeGeometry`. */
export interface Part {
	geo: THREE.BufferGeometry;
	p?: V3;
	m?: M3;
	s?: V3;
	/** Vertex colour; only written when merging with colours. */
	c?: V3;
}

export function createPs1Kit(canvas: HTMLCanvasElement, opts: Ps1KitOptions) {
	const {
		width: W,
		height: H,
		fov,
		near = 0.15,
		far = 2000,
		fogCap = 0.62,
		vignette = 0.28
	} = opts;
	const trash: Disposable[] = [];
	const keep = <T extends Disposable>(x: T): T => (trash.push(x), x);

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
	const camera = new THREE.PerspectiveCamera((fov * 180) / Math.PI, W / H, near, far);
	const cam2d = new THREE.OrthographicCamera(0, W, 0, H, -1, 1); // pixel space, y down
	/** Focal length in pixels. */
	const F = H / 2 / Math.tan(fov / 2);

	const color = (c: V3) => new THREE.Color(c[0], c[1], c[2]);

	/* ---------- textures ---------- */
	/**
	 * Float RGBA texture (texel values may exceed 1) with nearest filtering and repeat wrapping.
	 * `fn` returns null for transparent texels. Rows go bottom-up unless `topDown` is set.
	 */
	const makeTex = (
		w: number,
		h: number,
		fn: (x: number, y: number) => V3 | null,
		{ topDown = false, mipmaps = false } = {}
	) => {
		const d = new Float32Array(w * h * 4);
		for (let y = 0; y < h; y++)
			for (let x = 0; x < w; x++) {
				const c = fn(x, y);
				const row = topDown ? h - 1 - y : y;
				d.set(c ? [c[0], c[1], c[2], 1] : [0, 0, 0, 0], (row * w + x) * 4);
			}
		const t = keep(new THREE.DataTexture(d, w, h, THREE.RGBAFormat, THREE.FloatType));
		t.magFilter = THREE.NearestFilter;
		t.minFilter = THREE.NearestFilter;
		t.wrapS = t.wrapT = THREE.RepeatWrapping;
		t.generateMipmaps = false;
		if (mipmaps) {
			// Box-filtered chain built on the CPU (float textures can't generate mipmaps on the GPU).
			// Nearest-mipmap-nearest keeps hard texels up close and stops distant surfaces shimmering.
			const levels = [{ data: d, width: w, height: h }];
			for (let l = levels[0]; l.width > 1 || l.height > 1; ) {
				const nw = Math.max(1, l.width >> 1),
					nh = Math.max(1, l.height >> 1),
					nd = new Float32Array(nw * nh * 4);
				for (let y = 0; y < nh; y++)
					for (let x = 0; x < nw; x++)
						for (let c = 0; c < 4; c++) {
							let s = 0;
							for (const [dx, dy] of [
								[0, 0],
								[1, 0],
								[0, 1],
								[1, 1]
							]) {
								const sx = Math.min(l.width - 1, x * 2 + dx),
									sy = Math.min(l.height - 1, y * 2 + dy);
								s += l.data[(sy * l.width + sx) * 4 + c];
							}
							nd[(y * nw + x) * 4 + c] = s / 4;
						}
				levels.push((l = { data: nd, width: nw, height: nh }));
			}
			t.mipmaps = levels as unknown as THREE.DataTexture['mipmaps'];
			t.minFilter = THREE.NearestMipmapNearestFilter;
		}
		t.needsUpdate = true;
		return t;
	};

	/* ---------- materials ---------- */
	const patch = ps1Patch(W, H, fogCap);
	/** Patch a built-in material for the PS1 look and register it for disposal. */
	const ps1 = <T extends THREE.Material>(m: T): T => {
		m.onBeforeCompile = patch;
		return keep(m);
	};
	const lam = (c: V3, o: THREE.MeshLambertMaterialParameters = {}) =>
		ps1(new THREE.MeshLambertMaterial({ color: color(c), flatShading: true, ...o }));
	const basic = (c: V3, o: THREE.MeshBasicMaterialParameters = {}) =>
		ps1(new THREE.MeshBasicMaterial({ color: color(c), ...o }));

	/* ---------- geometry ---------- */
	const BOX = keep(new THREE.BoxGeometry(1, 1, 1)); // face groups +x −x +y −y +z −z
	const PLANE = keep(new THREE.PlaneGeometry(1, 1));
	/** Unit box whose UVs repeat `us` times across each face. */
	const boxUV = (us: [number, number]) => {
		const g = keep(BOX.clone()),
			a = g.getAttribute('uv');
		for (let i = 0; i < a.count; i++) a.setXY(i, a.getX(i) * us[0], a.getY(i) * us[1]);
		return g;
	};
	const cylCache = new Map<string, THREE.CylinderGeometry>();
	/** Unit cylinder (radius 1, height 1), shared per segment count. */
	const cylGeo = (segs: number, open = false) => {
		const key = `${segs}:${open}`;
		if (!cylCache.has(key))
			cylCache.set(key, keep(new THREE.CylinderGeometry(1, 1, 1, segs, 1, open)));
		return cylCache.get(key)!;
	};

	/** Set an object's local transform to translate(p) · rotate(m) · scale(s). */
	const place = <T extends THREE.Object3D>(o: T, p: V3, m: M3 = I3, s: V3 = [1, 1, 1]): T => {
		o.matrixAutoUpdate = false;
		setMatrix(o.matrix, p, m, s);
		o.matrixWorldNeedsUpdate = true;
		return o;
	};
	const setMatrix = (out: THREE.Matrix4, p: V3, m: M3, s: V3) =>
		// prettier-ignore
		out.set(
			m[0] * s[0], m[1] * s[1], m[2] * s[2], p[0],
			m[3] * s[0], m[4] * s[1], m[5] * s[2], p[1],
			m[6] * s[0], m[7] * s[1], m[8] * s[2], p[2],
			0, 0, 0, 1
		);
	const mesh = (
		parent: THREE.Object3D,
		geo: THREE.BufferGeometry,
		mat: Mat,
		p: V3,
		m: M3 = I3,
		s: V3 = [1, 1, 1],
		ro = 3
	) => {
		const o = place(new THREE.Mesh(geo, mat), p, m, s);
		o.renderOrder = ro;
		parent.add(o);
		return o;
	};

	/**
	 * Bake transformed parts into one non-indexed geometry (position, uv, normals and optionally
	 * per-part vertex colours). Mirrored parts keep their faces pointing outward.
	 */
	const mergeGeometry = (parts: Part[], { colors = false } = {}) => {
		let count = 0;
		const flat = parts.map((part) => {
			const g = part.geo.index ? part.geo.toNonIndexed() : part.geo;
			count += g.getAttribute('position').count;
			return { ...part, g };
		});
		const pos = new Float32Array(count * 3),
			uv = new Float32Array(count * 2),
			col = colors ? new Float32Array(count * 3) : null;
		let n = 0;
		for (const {
			g,
			geo,
			p = [0, 0, 0] as V3,
			m = I3,
			s = [1, 1, 1] as V3,
			c = [1, 1, 1]
		} of flat) {
			const P = g.getAttribute('position'),
				U = g.getAttribute('uv');
			const flip = det3(m) * s[0] * s[1] * s[2] < 0;
			for (let i = 0; i < P.count; i += 3)
				for (const k of flip ? [0, 2, 1] : [0, 1, 2]) {
					const v = i + k;
					pos.set(add(p, mv(m, [P.getX(v) * s[0], P.getY(v) * s[1], P.getZ(v) * s[2]])), n * 3);
					if (U) uv.set([U.getX(v), U.getY(v)], n * 2);
					col?.set(c, n * 3);
					n++;
				}
			if (g !== geo) g.dispose();
		}
		const out = keep(new THREE.BufferGeometry());
		out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
		if (col) out.setAttribute('color', new THREE.BufferAttribute(col, 3));
		out.computeVertexNormals();
		return out;
	};

	/**
	 * Collects static parts by material, then builds one mesh per material: a scene of a few
	 * hundred boxes becomes a handful of draw calls.
	 */
	const batch = () => {
		const groups = new Map<THREE.Material, Part[]>();
		return {
			add(mat: THREE.Material, geo: THREE.BufferGeometry, p: V3, m: M3 = I3, s: V3 = [1, 1, 1]) {
				if (!groups.has(mat)) groups.set(mat, []);
				groups.get(mat)!.push({ geo, p, m, s });
			},
			build(parent: THREE.Object3D, ro = 3) {
				for (const [mat, parts] of groups) {
					const o = new THREE.Mesh(mergeGeometry(parts), mat);
					o.renderOrder = ro;
					o.matrixAutoUpdate = false;
					parent.add(o);
				}
				groups.clear();
			}
		};
	};

	/* ---------- per-frame buffers and 2D layers ---------- */
	/**
	 * Vertex buffer rebuilt every frame. `commit` uploads only the vertices written this frame,
	 * not the whole preallocated array.
	 */
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
			push(v: Record<string, ArrayLike<number>>) {
				if (n >= max) return;
				for (const name in v) arrays[name].set(v[name], n * attrs[name]);
				n++;
			},
			commit() {
				geo.setDrawRange(0, n);
				if (!n) return;
				for (const name in attrs) {
					const a = geo.getAttribute(name) as THREE.BufferAttribute;
					a.clearUpdateRanges();
					a.addUpdateRange(0, n * attrs[name]);
					a.needsUpdate = true;
				}
			}
		};
	};
	const noCull = <T extends THREE.Object3D>(o: T, ro: number) => {
		o.frustumCulled = false;
		o.renderOrder = ro;
		return o;
	};
	const glowMat = keep(
		new THREE.ShaderMaterial({
			vertexShader: GLOW_VS,
			fragmentShader: GLOW_FS,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false
		})
	);
	/**
	 * A 2D pixel layer in screen space: additive pixels, opaque pixels (text) and soft glow
	 * sprites. Glow sprites draw first unless `glowsOnTop` is set.
	 */
	const layer = (max: number, { glowsOnTop = false } = {}) => {
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
		const addPx = pixels(THREE.AdditiveBlending, 1),
			setPx = pixels(THREE.NormalBlending, 2);
		const glows = dynBuffer(max, { position: 3, gcol: 3, rad: 1, squash: 1 });
		scene.add(noCull(new THREE.Points(glows.geo, glowMat), glowsOnTop ? 3 : 0));
		const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H;
		// scratch arrays: `push` copies them, so one set serves every call
		const pos = [0, 0, 0],
			rad = [0],
			sq = [0];
		const at = (x: number, y: number) => ((pos[0] = x + 0.5), (pos[1] = y + 0.5), pos);
		return {
			scene,
			plot: (x: number, y: number, c: V3) =>
				inside(x, y) && addPx.push({ position: at(x, y), color: c }),
			set: (x: number, y: number, c: V3) =>
				inside(x, y) && setPx.push({ position: at(x, y), color: c }),
			sprite: (x: number, y: number, r: number, c: V3, squash = 1) => {
				rad[0] = r;
				sq[0] = squash;
				glows.push({ position: at(x, y), gcol: c, rad, squash: sq });
			},
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
	type Layer = ReturnType<typeof layer>;

	/** Pixel-font text; a fractional `scale` is nearest-neighbour, so cells are 2 or 3 px etc. */
	const text = (into: Layer, x: number, y: number, s: string, c: V3, scale = 1) => {
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

	/** A full-screen shader pass. */
	const fullscreen = (fragmentShader: string, uniforms: Record<string, THREE.IUniform> = {}) => {
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
	const post = fullscreen(postShader(W, H, vignette), { tDiffuse: { value: target.texture } });

	/* ---------- camera helpers ---------- */
	const tmp = new THREE.Vector3();
	/** World point → [pixel x, pixel y, depth], or null behind the near plane. */
	const proj = (p: V3): V3 | null => {
		const q = tmp.set(p[0], p[1], p[2]).applyMatrix4(camera.matrixWorldInverse),
			z = -q.z;
		if (z < near) return null;
		return [Math.round(W / 2 + (q.x * F) / z), Math.round(H / 2 - (q.y * F) / z), z];
	};
	/** Direction → pixel position where it meets the sky (unrounded). */
	const screenDir = (d: V3) => {
		const q = tmp.set(d[0], d[1], d[2]).transformDirection(camera.matrixWorldInverse);
		return [W / 2 + (q.x * F) / -q.z, H / 2 - (q.y * F) / -q.z];
	};

	/* ---------- frame ---------- */
	/** Run `draw` against the low-resolution target, then dither it to the canvas. */
	const frame = (draw: () => void) => {
		renderer.setRenderTarget(target);
		renderer.clear();
		draw();
		renderer.setRenderTarget(null);
		renderer.render(post.scene, cam2d);
	};
	/**
	 * Compile every pass's shaders without blocking the main thread. `passes` are the scenes
	 * `draw` renders into the target; programs depend on the active target, so they compile there.
	 */
	const compile = async (passes: [THREE.Scene, THREE.Camera][]) => {
		renderer.setRenderTarget(target);
		const offscreen = passes.map(([s, c]) => renderer.compileAsync(s, c));
		renderer.setRenderTarget(null);
		await Promise.all([...offscreen, renderer.compileAsync(post.scene, cam2d)]);
	};
	const dispose = () => {
		for (const x of trash) x.dispose();
		renderer.dispose();
	};

	return {
		renderer,
		camera,
		cam2d,
		F,
		keep,
		color,
		makeTex,
		ps1,
		lam,
		basic,
		BOX,
		PLANE,
		boxUV,
		cylGeo,
		place,
		setMatrix,
		mesh,
		mergeGeometry,
		batch,
		dynBuffer,
		noCull,
		layer,
		text,
		fullscreen,
		proj,
		screenDir,
		frame,
		compile,
		dispose
	};
}

export type Ps1Kit = ReturnType<typeof createPs1Kit>;
export type Ps1Layer = ReturnType<Ps1Kit['layer']>;
