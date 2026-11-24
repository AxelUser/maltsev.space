import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';
import { PUBLIC_POSTHOG_API_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';

export const analyticsEnabled =
	browser && !dev && !!PUBLIC_POSTHOG_API_KEY && window.location.hostname !== 'localhost';

export interface CustomEvents {
	post_read: { milestone: 25 | 50 | 75 | 100; seconds: number };
	viz_shown: { viz: string; title?: string };
	viz_interacted: { viz: string; title?: string; action: string };
	live_cover_shown: Record<string, never>;
	live_cover_interacted: { action: string };
	page_error: { status: number; path: string; referrer: string };
}

export interface PostContext {
	post_slug: string;
	post_tags: string[];
	post_series?: string;
	reading_time_minutes?: number;
}

const POST_KEYS: (keyof PostContext)[] = [
	'post_slug',
	'post_tags',
	'post_series',
	'reading_time_minutes'
];

const sentThisPageview = new Set<string>();

export function initAnalytics() {
	if (!analyticsEnabled) return;
	posthog.init(PUBLIC_POSTHOG_API_KEY, {
		api_host: PUBLIC_POSTHOG_HOST,
		// The blog never identifies visitors. Anonymous events cost less and still count unique visitors.
		person_profiles: 'identified_only',
		capture_pageview: false,
		capture_pageleave: true,
		autocapture: { capture_copied_text: true }
	});
}

export function trackPageview(post: PostContext | undefined) {
	if (!analyticsEnabled) return;
	sentThisPageview.clear();
	if (post) posthog.register(post);
	else for (const key of POST_KEYS) posthog.unregister(key);
	posthog.capture('$pageview');
}

export function trackPageleave() {
	if (analyticsEnabled) posthog.capture('$pageleave');
}

export function track<E extends keyof CustomEvents>(event: E, props: CustomEvents[E]) {
	if (analyticsEnabled) whenIdle(() => posthog.capture(event, props));
}

export function trackOnce<E extends keyof CustomEvents>(
	key: string,
	event: E,
	props: CustomEvents[E]
) {
	if (!analyticsEnabled || sentThisPageview.has(key)) return;
	sentThisPageview.add(key);
	track(event, props);
}

function whenIdle(task: () => void) {
	if ('requestIdleCallback' in window) requestIdleCallback(task, { timeout: 2000 });
	else setTimeout(task, 0);
}
