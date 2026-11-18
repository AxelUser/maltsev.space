/** Byte accounting for a static build: file sizes, the HTML's static import graph, chunk categories. */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

export interface Size {
	raw: number;
	gz: number;
	br: number;
}

export type Category = 'framework' | 'layout' | 'page' | 'posts' | 'three';

export interface JsBytes extends Size {
	files: number;
	byCategory: Partial<Record<Category, number>>;
}

const sizes = new Map<string, Size>();

/** Sizes as served: raw, gzip -9 and brotli. Cached per file. */
export function sizeOf(file: string): Size {
	let s = sizes.get(file);
	if (!s) {
		const b = fs.readFileSync(file);
		s = {
			raw: b.length,
			gz: zlib.gzipSync(b, { level: 9 }).length,
			br: zlib.brotliCompressSync(b).length
		};
		sizes.set(file, s);
	}
	return s;
}

/** Resolves a URL path the way adapter-static output is served; `null` means the 404 page. */
export function fileForPath(root: string, urlPath: string): string | null {
	const p = decodeURIComponent(urlPath);
	for (const c of [p, `${p}.html`, path.join(p, 'index.html')]) {
		const f = path.join(root, c);
		if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
	}
	return null;
}

const STATIC_IMPORT = /(?:import|from)\s*["']([^"']+\.js)["']/g;

/** JS the HTML references (module preloads, entry imports) plus everything they import statically. */
export function upfrontJs(root: string, htmlFile: string): Set<string> {
	const html = fs.readFileSync(htmlFile, 'utf8');
	const seen = new Set<string>();
	const walk = (file: string) => {
		const f = path.resolve(file);
		if (seen.has(f) || !fs.existsSync(f)) return;
		seen.add(f);
		for (const m of fs.readFileSync(f, 'utf8').matchAll(STATIC_IMPORT))
			walk(path.resolve(path.dirname(f), m[1]));
	};
	for (const m of html.matchAll(/(?:href|src)="([^"]+\.js)"|import\("([^"]+\.js)"\)/g)) {
		const ref = m[1] ?? m[2];
		walk(ref.startsWith('/') ? path.join(root, ref) : path.resolve(path.dirname(htmlFile), ref));
	}
	return seen;
}

/** Best-effort category from the chunk's path and content; hashed names carry no meaning. */
export function categorize(root: string, file: string): Category {
	const rel = path.relative(root, file).split(path.sep).join('/');
	const src = fs.readFileSync(file, 'utf8');
	if (src.includes('WebGLRenderer')) return 'three';
	if ((src.match(/<h2 id="/g) ?? []).length > 20) return 'posts';
	if (/nodes\/0\./.test(rel)) return 'layout';
	if (/nodes\/\d+\./.test(rel) || /<h2 id="|class="shiki/.test(src)) return 'page';
	return 'framework';
}

export function sumJs(root: string, files: Iterable<string>): JsBytes {
	const out: JsBytes = { raw: 0, gz: 0, br: 0, files: 0, byCategory: {} };
	for (const f of files) {
		const s = sizeOf(f);
		const c = categorize(root, f);
		out.raw += s.raw;
		out.gz += s.gz;
		out.br += s.br;
		out.files++;
		out.byCategory[c] = (out.byCategory[c] ?? 0) + s.gz;
	}
	return out;
}

export type ResourceKind = 'js' | 'css' | 'html' | 'data' | 'font' | 'image' | 'other';

export function resourceKind(file: string): ResourceKind {
	const ext = path.extname(file).toLowerCase();
	if (ext === '.js') return 'js';
	if (ext === '.css') return 'css';
	if (ext === '.html') return 'html';
	if (ext === '.json') return 'data';
	if (/^\.woff2?$/.test(ext)) return 'font';
	if (/^\.(png|jpe?g|webp|avif|svg|gif|ico)$/.test(ext)) return 'image';
	return 'other';
}
