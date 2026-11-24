import type { Action } from 'svelte/action';
import { analyticsEnabled, trackOnce, type CustomEvents } from './core';

const VISIBLE = 0.5;

type Viz = CustomEvents['viz_shown'];

export const trackVizShown: Action<HTMLElement, Viz> = (node, viz) => {
	if (!analyticsEnabled) return;
	const observer = new IntersectionObserver(
		(entries) => {
			if (!entries.some((entry) => entry.intersectionRatio >= VISIBLE)) return;
			trackOnce(`viz-shown:${viz.viz}:${viz.title ?? ''}`, 'viz_shown', viz);
			observer.disconnect();
		},
		{ threshold: VISIBLE }
	);
	observer.observe(node);
	return { destroy: () => observer.disconnect() };
};
