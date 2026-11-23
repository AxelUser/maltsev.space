<!--
	@component
	A callout box in a post, written as `:::info` or `:::warning[Custom title]`. The kinds are
	listed in `src/lib/plugins/callouts.js`.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cva } from 'class-variance-authority';

	type Kind = 'note' | 'info' | 'tip' | 'warning' | 'question' | 'quote';

	interface Props {
		kind?: Kind;
		/** The default title of the kind, used when the callout has no `[label]`. */
		title?: string;
		label?: Snippet;
		children?: Snippet;
	}

	const { kind = 'note', title = 'Note', label, children }: Props = $props();

	const callout = cva(
		'my-6 border border-l-[3px] border-line border-l-(--callout-c) bg-[color-mix(in_srgb,var(--callout-c)_5%,var(--color-surface))]',
		{
			variants: {
				kind: {
					note: '[--callout-c:var(--color-link)]',
					info: '[--callout-c:var(--color-livery-4)]',
					tip: '[--callout-c:var(--color-livery-4)]',
					warning: '[--callout-c:var(--color-livery-2)]',
					question: '[--callout-c:var(--color-ink-3)]',
					quote: 'italic [--callout-c:var(--color-ink-3)]'
				}
			}
		}
	);
</script>

<div class={callout({ kind })} data-kind={kind} role="note">
	<div
		class="flex items-center gap-2 px-4 py-2 font-display text-[16px] font-semibold text-ink md:px-5"
	>
		<svg
			class="size-4 shrink-0 text-(--callout-c)"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			{#if kind === 'info'}
				<circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
			{:else if kind === 'tip'}
				<path
					d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
				/>
			{:else if kind === 'warning'}
				<path
					d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01"
				/>
			{:else if kind === 'question'}
				<circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
			{:else if kind === 'quote'}
				<path
					d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
				/>
			{:else}
				<path d="M18 2l4 4M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z" />
			{/if}
		</svg>
		<span class="flex-1">
			{#if label}{@render label()}{:else}{title}{/if}
		</span>
	</div>
	<div class="px-4 pb-3 text-ink-2 *:first:mt-0 *:last:mb-0 md:px-5 md:pb-4 [&_p]:mb-2">
		{@render children?.()}
	</div>
</div>
