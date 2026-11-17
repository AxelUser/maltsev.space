import type { Component } from 'svelte';

/** Props of `src/posts/<slug>/live-cover.svelte`, used when front matter sets `liveCover: true`. */
export interface LiveCoverProps {
	/** Animate only while true. */
	isRunning: boolean;
	/** Call after the first frame is drawn. */
	onready?: () => void;
}

export type LiveCoverComponent = Component<LiveCoverProps>;

export type LiveCoverLoader = () => Promise<{ default: LiveCoverComponent }>;

/** Imperative scene driven by `SceneCanvas`. */
export interface CanvasScene {
	/** Draw the frame at `t` seconds. */
	render(t: number): void;
	dispose(): void;
}

/** Allowed values of front matter `aiCover`. */
export const AI_COVER_KINDS = ['Image', 'Live'] as const;
export type AiCoverKind = (typeof AI_COVER_KINDS)[number];
