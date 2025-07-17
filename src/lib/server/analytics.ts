import { POSTHOG_ANALYTICS_PROJECT_ID, POSTHOG_ANALYTICS_API_KEY } from '$env/static/private';
import type { ArticleAnalytics } from '$lib/types';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
interface CacheEntry {
	data: ArticleAnalytics[];
	timestamp: number;
}

let analyticsCache: CacheEntry | null = null;

function extractSlugFromUrl(url: string): string | null {
	const blogMatch = url.match(/\/blog\/([^/]+)/);
	return blogMatch ? blogMatch[1] : null;
}

function transformAnalyticsData(rawResults: Array<[string, number]>): ArticleAnalytics[] {
	return rawResults
		.map(([url, views]) => {
			const slug = extractSlugFromUrl(url);
			if (!slug) return null;

			return {
				slug,
				views
			};
		})
		.filter((item): item is ArticleAnalytics => item !== null)
		.sort((a, b) => b.views - a.views);
}

async function fetchRawAnalyticsData(): Promise<Array<[string, number]>> {
	if (!POSTHOG_ANALYTICS_PROJECT_ID || !POSTHOG_ANALYTICS_API_KEY) {
		throw new Error('PostHog analytics configuration missing');
	}

	const url = `https://us.posthog.com/api/projects/${POSTHOG_ANALYTICS_PROJECT_ID}/query/`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${POSTHOG_ANALYTICS_API_KEY}`
		},
		body: JSON.stringify({
			query: {
				kind: 'HogQLQuery',
				query: 'SELECT * FROM articles_views_total'
			}
		})
	});

	if (!response.ok) {
		throw new Error(`PostHog API error: ${response.statusText}`);
	}

	const data = await response.json();
	return data.results;
}

export async function getAllArticlesAnalytics(): Promise<ArticleAnalytics[]> {
	if (analyticsCache && Date.now() - analyticsCache.timestamp < CACHE_TTL_MS) {
		console.log('[Analytics] Using cached PostHog data');
		return analyticsCache.data;
	}

	console.log('[Analytics] Fetching fresh data from PostHog');

	const rawResults = await fetchRawAnalyticsData();
	const transformedData = transformAnalyticsData(rawResults);

	analyticsCache = {
		data: transformedData,
		timestamp: Date.now()
	};

	return transformedData;
}

export async function getArticleViews(slug: string): Promise<number> {
	try {
		const allAnalytics = await getAllArticlesAnalytics();
		const article = allAnalytics.find((a) => a.slug === slug);
		return article?.views || 0;
	} catch (error) {
		console.error(`Failed to fetch views for article ${slug}:`, error);
		return 0;
	}
}
