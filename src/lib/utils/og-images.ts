export function getOGImagePath(slug: string): string {
	return `/images/og/${slug}.png`;
}

export function getOGImageUrl(slug: string, baseUrl: string): string {
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');
	return `${cleanBaseUrl}${getOGImagePath(slug)}`;
}
