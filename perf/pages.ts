/** Page kinds measured by the perf suite. One test per entry, on every device project. */
export interface PageKind {
	/** Stable key; renaming it breaks the trend in the history. */
	id: string;
	name: string;
	path: string;
	/** Expected HTTP status of the document. */
	status?: number;
	/** Waits for `selector` on the listed devices and records when it appeared. */
	ready?: { selector: string; devices: string[] };
}

export const PAGES: PageKind[] = [
	{ id: 'home', name: 'Home', path: '/' },
	{ id: 'blog', name: 'Blog index', path: '/blog' },
	{ id: 'about', name: 'About', path: '/about' },
	{ id: 'misc', name: 'Misc', path: '/misc' },
	{ id: 'misc-collection', name: 'Misc collection', path: '/misc/music' },
	{ id: 'post', name: 'Post', path: '/blog/001-binary-shifts-for-flags' },
	{
		id: 'post-live-cover',
		name: 'Post with live cover',
		path: '/blog/012-simd-within-a-register-how-i-doubled-hash-table-lookup-performance',
		// Only desktop with a fine pointer loads the scene; mobile keeps the still image.
		ready: { selector: '[data-live-cover="playing"]', devices: ['desktop'] }
	},
	{ id: 'post-diagrams', name: 'Post with diagrams', path: '/blog/009-counting-bloom-filters' },
	{ id: 'not-found', name: '404', path: '/blog/does-not-exist', status: 404 }
];
