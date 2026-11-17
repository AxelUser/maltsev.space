// Serves a static build like the production host does for adapter-static output:
// `/x` → `x.html` or `x/index.html`, anything else → `404.html` with status 404.
// Usage: node perf/serve.mjs <buildDir> <port>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [root = 'build', port = '4321'] = process.argv.slice(2);

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.gif': 'image/gif',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.xml': 'application/xml',
	'.txt': 'text/plain',
	'.webmanifest': 'application/manifest+json'
};

const resolve = (urlPath) => {
	const p = decodeURIComponent(urlPath);
	for (const c of [p, `${p}.html`, path.join(p, 'index.html')]) {
		const f = path.join(root, c);
		if (!path.resolve(f).startsWith(path.resolve(root))) return null;
		if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
	}
	return null;
};

http
	.createServer((req, res) => {
		const file = resolve(new URL(req.url, 'http://localhost').pathname);
		const served = file ?? path.join(root, '404.html');
		res.writeHead(file ? 200 : 404, {
			'content-type': TYPES[path.extname(served)] ?? 'application/octet-stream',
			'cache-control': 'no-store'
		});
		fs.createReadStream(served).pipe(res);
	})
	.listen(Number(port), () => console.log(`perf: serving ${root} on http://localhost:${port}`));
