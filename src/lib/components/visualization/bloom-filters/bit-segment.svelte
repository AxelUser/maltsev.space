<script lang="ts">
	import { cn } from '#lib/utils/index.ts';

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

<div class="flex flex-col items-center gap-2 border border-line bg-surface p-2">
	<div class="flex gap-1">
		{#each bits as bit, bitIndex (bitIndex)}
			{@const absoluteIndex = startIndex + bitIndex}
			<div
				class={cn(
					'flex size-5 items-center justify-center border border-line bg-canvas font-mono text-xs font-bold text-ink-2 transition-all duration-300 ease-[ease] min-[601px]:size-6 min-[601px]:text-lg',
					type === 'binary' && bit === '1' && 'border-livery-4 bg-livery-4 text-on-livery',
					type === 'bitarray' && bit === true && 'bg-line text-ink',
					highlightedBits.has(absoluteIndex) && 'z-1 scale-110 border-2',
					bitColors.get(absoluteIndex) === 'blue' && 'border-livery-4 bg-livery-4 text-on-livery',
					bitColors.get(absoluteIndex) === 'red' && 'border-ink-2 bg-line-2 text-ink'
				)}
			>
				{type === 'binary' ? bit : bit ? '1' : '0'}
			</div>
		{/each}
	</div>
	<div class="flex justify-center gap-1">
		{#each bits.keys() as bitIndex (bitIndex)}
			{@const absoluteIndex = startIndex + bitIndex}
			<span class="w-5 text-center font-mono text-xs text-ink-2 min-[601px]:w-6">
				{absoluteIndex}
			</span>
		{/each}
	</div>
</div>
