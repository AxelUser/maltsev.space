<!--
@component
A story told over several array states (insert → delete → query) in one widget.

Without JS every step renders stacked, so the figure reads like a static diagram.
With JS one step shows at a time with Prev / Next buttons, step dots and ←/→ keys.
-->
<script lang="ts" generics="S = ArrayState">
	import { onMount, type Snippet } from 'svelte';
	import { cn } from '#lib/utils/index.ts';
	import { trackOnce, trackVizShown } from '#lib/analytics/index.ts';
	import ArrayView from './array-view.svelte';
	import type { ArrayState, Step } from './types';

	interface Props {
		steps: Step<S>[];
		/** Accessible name of the widget. */
		title: string;
		/**
		 * Draws one step's state. Without it the state is drawn as an `ArrayView`,
		 * so `S` must then be `ArrayState`.
		 */
		view?: Snippet<[state: S, prev: S | undefined, animate: boolean]>;
		class?: string;
	}

	const { steps, title, view, class: className }: Props = $props();

	let active = $state(0);
	let showAll = $state(false);
	let interacted = $state(false);
	/** False during SSR / without JS, so stacked steps stay visible to screen readers too. */
	let hydrated = $state(false);
	onMount(() => (hydrated = true));

	const last = $derived(steps.length - 1);

	function go(to: number) {
		active = Math.max(0, Math.min(last, to));
		interacted = true;
		trackOnce(`stepper:${title}`, 'viz_interacted', { viz: 'stepper', title, action: 'step' });
	}

	function onkeydown(event: KeyboardEvent) {
		if (showAll) return;
		if (event.key === 'ArrowRight') go(active + 1);
		else if (event.key === 'ArrowLeft') go(active - 1);
		else return;
		event.preventDefault();
	}

	const controlClass =
		'inline-flex h-8 items-center border border-line-2 bg-surface px-3 font-mono text-xs text-ink transition-colors hover:border-ink-2 disabled:pointer-events-none disabled:opacity-40';
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	role="group"
	class={cn('stepper my-8 border border-line bg-surface p-3 sm:p-4', className)}
	class:show-all={showAll}
	aria-label={title}
	{onkeydown}
	use:trackVizShown={{ viz: 'stepper', title }}
>
	<div class="steps">
		{#each steps as step, i (i)}
			{@const prev = i > 0 ? steps[i - 1].state : undefined}
			{@const animate = interacted && !showAll && i === active}
			<div
				class="step"
				class:active={i === active}
				aria-hidden={hydrated && !showAll && i !== active ? 'true' : undefined}
			>
				<p
					class="mb-2 text-[15px] leading-snug text-ink"
					aria-live={i === active ? 'polite' : undefined}
				>
					<span class="mr-1.5 font-mono text-xs text-ink-3">{i + 1}/{steps.length}</span>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- captions are trusted author content from the post -->
					{@html step.caption}
				</p>
				{#if view}
					{@render view(step.state, prev, animate)}
				{:else}
					<ArrayView
						state={step.state as ArrayState}
						prev={prev as ArrayState | undefined}
						{animate}
					/>
				{/if}
			</div>
		{/each}
	</div>

	<!-- select-none: quick repeated clicks on Prev / Next shouldn't select the button labels -->
	<div class="controls mt-3 flex-wrap items-center gap-2 border-t border-line pt-3 select-none">
		{#if !showAll}
			<button
				type="button"
				class={controlClass}
				onclick={() => go(active - 1)}
				disabled={active === 0}
				aria-label="Previous step"
			>
				← Prev
			</button>
			<div class="flex items-center gap-1.5 px-1">
				{#each steps.keys() as i (i)}
					<button
						type="button"
						class={cn(
							'size-2.5 rounded-full border border-ink-3 transition-colors',
							i === active ? 'border-livery-4 bg-livery-4' : 'bg-transparent hover:bg-line-2'
						)}
						onclick={() => go(i)}
						aria-label="Step {i + 1}"
						aria-current={i === active ? 'step' : undefined}
					></button>
				{/each}
			</div>
			<button
				type="button"
				class={controlClass}
				onclick={() => go(active + 1)}
				disabled={active === last}
				aria-label="Next step"
			>
				Next →
			</button>
		{/if}
		<button
			type="button"
			class={cn(controlClass, 'ml-auto border-transparent bg-transparent text-ink-2')}
			onclick={() => {
				showAll = !showAll;
				trackOnce(`stepper:${title}`, 'viz_interacted', {
					viz: 'stepper',
					title,
					action: 'show_all'
				});
			}}
			aria-pressed={showAll}
		>
			{showAll ? 'Step through' : 'Show all steps'}
		</button>
	</div>
</div>

<style>
	/* No JS: every step stacked, no controls. */
	.steps {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.step {
		min-width: 0;
	}
	.controls {
		display: none;
	}

	/* JS: one step at a time, all steps in one grid cell so the height stays put. */
	:global(html.js) .stepper .controls {
		display: flex;
	}
	:global(html.js) .stepper:not(.show-all) .steps {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}
	:global(html.js) .stepper:not(.show-all) .step {
		grid-area: 1 / 1;
	}
	:global(html.js) .stepper:not(.show-all) .step:not(.active) {
		visibility: hidden;
	}
</style>
