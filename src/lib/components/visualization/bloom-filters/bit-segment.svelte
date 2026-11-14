<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		bits: (boolean | string)[];
		startIndex: number;
		type: 'binary' | 'bitarray';
		highlightedBits?: Set<number>;
		bitColors?: Map<number, 'blue' | 'red'>;
	}

	const {
		bits,
		startIndex,
		type = 'bitarray',
		highlightedBits = new Set(),
		bitColors = new Map()
	}: Props = $props();
</script>

<div class="flex flex-col items-center gap-2 rounded-xs border border-surface-3 bg-surface-2 p-2">
	<div class="flex gap-1">
		{#each bits as bit, bitIndex}
			{@const absoluteIndex = startIndex + bitIndex}
			<div
				class={cn(
					'flex size-5 items-center justify-center rounded-xs border border-surface-3 bg-surface-1 font-mono text-xs font-bold text-fg-2 transition-all duration-300 ease-[ease] min-[601px]:size-6 min-[601px]:text-lg',
					type === 'binary' && bit === '1' && 'border-accent bg-accent text-surface-1',
					type === 'bitarray' && bit === true && 'bg-surface-3 text-fg-1',
					highlightedBits.has(absoluteIndex) && 'z-1 scale-110 border-2',
					bitColors.get(absoluteIndex) === 'blue' && 'border-accent bg-accent text-surface-1',
					bitColors.get(absoluteIndex) === 'red' && 'border-fg-2 bg-surface-4 text-fg-1'
				)}
			>
				{type === 'binary' ? bit : bit ? '1' : '0'}
			</div>
		{/each}
	</div>
	<div class="flex justify-center gap-1">
		{#each bits as _, bitIndex}
			{@const absoluteIndex = startIndex + bitIndex}
			<span class="w-5 text-center font-mono text-xs text-fg-2 min-[601px]:w-6"
				>{absoluteIndex}</span
			>
		{/each}
	</div>
</div>
