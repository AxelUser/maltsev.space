<!--
@component
One state of a bit / counter array: marks above, cells, index row, owners and notes below.
Static and SSR-safe; every row shares one column template, so marks always line up with cells.
-->
<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ArrayState, Tone } from './types';

	interface Props {
		state: ArrayState;
		/** Previous step; cells whose value differs get the `changed` tone. */
		prev?: ArrayState;
		/** Play the "just changed" flash on changed cells (set by the Stepper on the active step). */
		animate?: boolean;
		/** Show the index row under the cells. */
		showIndex?: boolean;
		class?: string;
	}

	const { state, prev, animate = false, showIndex = true, class: className }: Props = $props();

	const n = $derived(state.cells.length);
	const indices = $derived(state.cells.map((_, i) => i));
	const marks = $derived(state.marks ?? {});
	const owners = $derived(state.owners ?? {});
	const notes = $derived(state.notes ?? {});
	const arcs = $derived(state.arcs ?? []);
	const hasMarks = $derived(Object.keys(marks).length > 0);
	const hasOwners = $derived(Object.keys(owners).length > 0);
	const noteEntries = $derived(
		Object.entries(notes).map(([i, text]) => [Number(i), text] as const)
	);

	const isFilled = (v: number | string) => v !== '' && v !== 0 && v !== '0';

	/** Cells holding words get wider columns and a fixed small font. */
	const longest = $derived(Math.max(...state.cells.map((c) => String(c).length)));
	const wordy = $derived(longest > 2);
	const cellRem = $derived(wordy ? Math.max(2.75, longest * 0.7 + 1.2) : 2.75);

	function toneOf(i: number): Tone | undefined {
		const explicit = state.tone?.[i];
		if (explicit) return explicit;
		if (marks[i] === '✗') return 'bad';
		if (marks[i] === '✓') return 'ok';
		if (prev && prev.cells[i] !== state.cells[i]) return 'changed';
		if (isFilled(state.cells[i])) return 'set';
		return undefined;
	}

	const tones = $derived(state.cells.map((_, i) => toneOf(i)));

	const toneClass: Record<Tone, string> = {
		set: 'border-line-2 bg-line text-ink',
		changed: 'border-livery-4 bg-livery-4 text-on-livery',
		ok: 'border-livery-4 bg-line text-ink shadow-[inset_0_0_0_1px_var(--color-livery-4)]',
		bad: 'border-livery-1 bg-canvas text-livery-1 shadow-[inset_0_0_0_1px_var(--color-livery-1)]',
		muted: 'border-line bg-canvas text-ink-3'
	};

	const markClass = (mark: string) =>
		mark === '✓' ? 'text-livery-4' : mark === '✗' ? 'text-livery-1' : 'text-ink-2';

	/** A note is centred on its cell over a symmetric span, so long text can overflow both sides. */
	function noteColumn(i: number) {
		const span = Math.min(i, n - 1 - i, 4);
		return `${i + 1 - span} / ${i + 2 + span}`;
	}

	const ariaLabel = $derived.by(() => {
		const parts: string[] = [];
		const filled = state.cells.flatMap((v, i) => (isFilled(v) ? [`${i}: ${v}`] : []));
		parts.push(filled.length ? `non-zero cells ${filled.join(', ')}` : 'all cells empty');
		const markList = Object.entries(marks).map(([i, m]) => `${m} at ${i}`);
		if (markList.length) parts.push(`marks ${markList.join(', ')}`);
		const ownerList = Object.entries(owners).map(([i, o]) => `${i} by ${o}`);
		if (ownerList.length) parts.push(`set ${ownerList.join(', ')}`);
		for (const [i, text] of noteEntries) parts.push(`note at ${i}: ${text}`);
		for (const { from, to } of arcs) parts.push(`moved from ${from} to ${to}`);
		return `${state.label}, ${n} cells; ${parts.join('; ')}`;
	});
</script>

<div class={cn('min-w-0', className)} role="img" aria-label={ariaLabel}>
	<div class="mb-1 font-mono text-xs text-ink-2 md:text-sm" aria-hidden="true">{state.label}</div>
	<div class="overflow-x-auto pb-1" aria-hidden="true">
		<div
			class="cells grid font-mono"
			style:grid-template-columns="repeat({n}, minmax(1.25rem, 1fr))"
			style:--cells-max="{n * cellRem}rem"
		>
			{#if state.arcs}
				<!-- `arcs: []` still reserves the row, so the array doesn't jump between steps.
				     100 user units per cell; non-scaling stroke keeps the line even when the row stretches. -->
				<div class="relative col-span-full h-7 text-livery-2 md:h-[2.125rem]">
					<svg
						class="block size-full overflow-visible"
						viewBox="0 0 {n * 100} 40"
						preserveAspectRatio="none"
					>
						{#each arcs as { from, to }, k (k)}
							{@const x1 = (from + 0.5) * 100}
							{@const x2 = (to + 0.5) * 100}
							<!-- Starts at the source cell (through its empty mark slot) and ends at the row's bottom.
							     Control points sit straight above both ends, so the ends stay vertical however
							     the row stretches, and the arrowhead below can always point straight down. -->
							<path
								d="M {x1} 88 C {x1} -10 {x2} -10 {x2} 40"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-dasharray="5 3"
								vector-effect="non-scaling-stroke"
							/>
						{/each}
					</svg>
					<!-- Arrowheads live outside the stretched SVG so they keep their shape. -->
					{#each arcs as { to }, k (k)}
						<svg
							class="absolute top-full size-2.5 -translate-x-1/2 -translate-y-px"
							style:left="{((to + 0.5) / n) * 100}%"
							viewBox="0 0 10 10"
						>
							<path d="M0 0 L10 0 L5 9 Z" fill="currentColor" />
						</svg>
					{/each}
				</div>
			{/if}

			{#if hasMarks}
				{#each indices as i (i)}
					<div
						class="flex h-9 flex-col items-center justify-end text-xs leading-tight md:h-11 md:text-sm"
					>
						{#if marks[i]}
							<span class={cn('whitespace-nowrap', markClass(marks[i]))}>{marks[i]}</span>
							<span class="text-ink-3">↓</span>
						{/if}
					</div>
				{/each}
			{/if}

			{#each state.cells as cell, i (i)}
				{@const tone = tones[i]}
				<div
					class={cn(
						'flex h-8 items-center justify-center border border-line-2 bg-canvas text-sm font-medium text-ink-2 sm:h-9 md:h-11',
						wordy ? 'md:text-base' : 'sm:text-base md:text-lg',
						i > 0 && '-ml-px',
						tone && ['relative z-1', toneClass[tone]],
						animate && tone === 'changed' && 'cell-flash'
					)}
				>
					{cell}
				</div>
			{/each}

			{#if showIndex}
				{#each indices as i (i)}
					<div class="pt-0.5 text-center text-[11px] text-ink-3 sm:text-xs md:text-sm">{i}</div>
				{/each}
			{/if}

			{#if hasOwners}
				{#each indices as i (i)}
					<div
						class="text-center text-[11px] whitespace-nowrap text-ink-2 italic sm:text-xs md:text-sm"
					>
						{owners[i] ?? ''}
					</div>
				{/each}
			{/if}

			{#each noteEntries as [i, text] (i)}
				<div
					class="row-span-1 mt-0.5 flex flex-col items-center text-xs leading-tight text-ink-2 md:text-sm"
					style:grid-column={noteColumn(i)}
				>
					<span class="text-ink-3">↑</span>
					<span class="whitespace-nowrap">{text}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Cells grow with the font on wider screens; the container still caps the width. */
	.cells {
		max-width: var(--cells-max);
	}
	@media (min-width: 48rem) {
		.cells {
			max-width: calc(var(--cells-max) * 1.25);
		}
	}

	.cell-flash {
		animation: cell-flash 900ms ease-out;
	}

	@keyframes cell-flash {
		0% {
			transform: scale(1.18);
			box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-livery-4) 45%, transparent);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 0 0 0 transparent;
		}
	}
</style>
