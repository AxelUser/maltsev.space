import type { Action } from 'svelte/action';
import { analyticsEnabled, track, type CustomEvents } from './core';

const READ_MIN_SECONDS = 10;
const MILESTONES: CustomEvents['post_read']['milestone'][] = [25, 50, 75, 100];

export const trackReading: Action<HTMLElement, string> = (node) => {
	if (!analyticsEnabled) return;

	let start = 0;
	let pending: CustomEvents['post_read']['milestone'][] = [];
	let frame = 0;
	let minReadCheck: ReturnType<typeof setTimeout> | undefined;

	const check = () => {
		frame = 0;
		if (pending.length === 0) return;
		const seconds = Math.round((performance.now() - start) / 1000);
		if (seconds < READ_MIN_SECONDS) return;

		const { top, height } = node.getBoundingClientRect();
		const progress = height > 0 ? ((innerHeight - top) / height) * 100 : 0;
		while (pending.length > 0 && progress >= pending[0]) {
			track('post_read', { milestone: pending.shift()!, seconds });
		}
	};

	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(check);
	};

	const reset = () => {
		start = performance.now();
		pending = [...MILESTONES];
		clearTimeout(minReadCheck);
		minReadCheck = setTimeout(schedule, READ_MIN_SECONDS * 1000);
	};

	reset();
	addEventListener('scroll', schedule, { passive: true });

	return {
		update: reset,
		destroy() {
			clearTimeout(minReadCheck);
			cancelAnimationFrame(frame);
			removeEventListener('scroll', schedule);
		}
	};
};
