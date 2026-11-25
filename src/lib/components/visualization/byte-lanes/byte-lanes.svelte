<!--
@component
A 32-bit value, or a column calculation (`a − b`, `¬a`, `a & b`, `a ⊕ b`), split into four 8-bit lanes.
Each lane shows its 8 bits with the byte's hex below; lanes are headed by bit range, MSB first.
Static and SSR-safe; every row shares one column template, so lanes always line up.
-->
<script lang="ts">
	import { cn } from '#lib/utils/index.ts';
	import { hex32 } from './helpers';
	import type { ByteLanesState, ByteOp, Lane, LaneTone } from './types';

	interface Props {
		state: ByteLanesState;
		class?: string;
	}

	const { state, class: className }: Props = $props();

	const LANES: Lane[] = [3, 2, 1, 0];
	const RANGE: Record<Lane, string> = { 3: '31..24', 2: '23..16', 1: '15..8', 0: '7..0' };
	const OP_WORD: Record<ByteOp, string> = { '−': 'minus', '¬': 'NOT', '&': 'AND', '⊕': 'XOR' };

	const byteOf = (value: number, lane: Lane) => (value >>> (lane * 8)) & 0xff;
	const bitsOf = (byte: number) => byte.toString(2).padStart(8, '0').split('');
	const hex8 = (byte: number) => byte.toString(16).toUpperCase().padStart(2, '0');

	const last = $derived(state.rows.length - 1);
	const notes = $derived(state.notes ?? {});
	const hasNotes = $derived(Object.keys(notes).length > 0);

	const toneClass: Record<LaneTone, string> = {
		changed: 'border-livery-4 bg-livery-4 text-on-livery',
		ok: 'border-livery-4 text-ink shadow-[inset_0_0_0_1px_var(--color-livery-4)]',
		bad: 'border-livery-1 text-livery-1 shadow-[inset_0_0_0_1px_var(--color-livery-1)]',
		muted: 'text-ink-3'
	};

	const ariaLabel = $derived.by(() => {
		const parts = state.rows.map((row) => {
			const value = hex32(row.value);
			if (row.result) return `equals ${value}`;
			return row.op ? `${OP_WORD[row.op]} ${value}` : value;
		});
		const noteList = LANES.flatMap((lane) =>
			notes[lane] ? [`bits ${RANGE[lane]}: ${notes[lane]}`] : []
		);
		return [parts.join(' '), ...noteList].join('; ');
	});
</script>

<div class={cn('my-6 min-w-0', className)} role="img" aria-label={ariaLabel}>
	<div class="overflow-x-auto pb-1" aria-hidden="true">
		<div
			class="grid w-max grid-cols-[1rem_repeat(4,max-content)] gap-x-1.5 font-mono sm:grid-cols-[1.5rem_repeat(4,max-content)_max-content] sm:gap-x-3 md:gap-x-4"
		>
			<div></div>
			{#each LANES as lane (lane)}
				<div class="pb-0.5 text-center text-[11px] text-ink-3 sm:text-xs md:text-sm">
					{RANGE[lane]}
				</div>
			{/each}
			<div class="hidden sm:block"></div>

			{#each state.rows as row, r (r)}
				{#if row.result}
					<div class="col-span-full my-1 border-t border-ink-2"></div>
				{/if}
				<div
					class="flex items-start justify-center pt-0.5 text-sm text-ink-2 sm:text-base md:pt-1 md:text-lg"
				>
					{row.op ?? ''}
				</div>
				{#each LANES as lane (lane)}
					{@const byte = byteOf(row.value, lane)}
					{@const tone = r === last ? state.tone?.[lane] : undefined}
					<div
						class={cn(
							'flex flex-col items-center border border-transparent px-1 py-0.5 text-ink sm:px-1.5 md:px-2 md:py-1',
							tone && toneClass[tone]
						)}
					>
						<span class="text-xs sm:text-base md:text-lg">
							{#each bitsOf(byte) as bit, b (b)}<span
									class={cn(state.msb && r === last && b > 0 && 'opacity-35')}
								>
									{bit}
								</span>{/each}
						</span>
						<span class="text-[11px] leading-tight opacity-70 sm:text-xs md:text-sm">
							{hex8(byte)}
						</span>
					</div>
				{/each}
				<div class="hidden pt-0.5 pl-1 text-xs text-ink-2 sm:block sm:text-sm md:pt-1 md:text-base">
					{hex32(row.value)}
				</div>
			{/each}

			{#if hasNotes}
				<div></div>
				{#each LANES as lane (lane)}
					<!-- w-0 + min-w-full: the note wraps inside its lane instead of widening the column -->
					<div
						class="mt-0.5 flex w-0 min-w-full flex-col items-center text-center text-[11px] leading-tight text-ink-2 sm:text-xs md:text-sm"
					>
						{#if notes[lane]}
							<span class="text-ink-3">↑</span>
							<span>{notes[lane]}</span>
						{/if}
					</div>
				{/each}
				<div class="hidden sm:block"></div>
			{/if}
		</div>
	</div>
</div>
