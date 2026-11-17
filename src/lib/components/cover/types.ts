import type { Component } from 'svelte';

/**
 * Contract for a post's live cover: `src/posts/<slug>/live-cover.svelte`, enabled with
 * `liveCover: true` in the post's front matter.
 */
export interface LiveCoverProps {
	/** True while the cover is on screen; stop animating when false. */
	isRunning: boolean;
	/** Call once the first frame is visible so the shell can fade out the still image. */
	onready?: () => void;
}

export type LiveCoverComponent = Component<LiveCoverProps>;

/** Lazy import of a live cover, so its code (e.g. three.js) loads only when it will play. */
export type LiveCoverLoader = () => Promise<{ default: LiveCoverComponent }>;

/** An imperative, time-driven scene drawn into a canvas (see `SceneCanvas`). */
export interface CanvasScene {
	/** Draw the frame at `t` seconds of scene time. */
	render(t: number): void;
	dispose(): void;
}

/** Cover variants that can be flagged as AI-generated (front matter `aiCover: [Image, Live]`). */
export const AI_COVER_KINDS = ['Image', 'Live'] as const;
export type AiCoverKind = (typeof AI_COVER_KINDS)[number];
