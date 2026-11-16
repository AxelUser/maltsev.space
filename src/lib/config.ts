const config = {
	websiteUrl: 'https://maltsev.space/',
	websiteTitle: 'MALTSEV.SPACE'
};

/** Main sections. Each owns a livery colour, used for its active nav flag. */
const sections = [
	{ href: '/blog', label: 'Blog', color: 'var(--color-livery-1)' },
	{ href: '/about', label: 'About', color: 'var(--color-livery-2)' },
	{ href: '/art', label: 'Art', color: 'var(--color-livery-4)' }
];

export { config, sections };
