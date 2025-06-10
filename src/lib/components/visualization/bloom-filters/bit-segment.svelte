<script lang="ts">
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

<div class="bit-segment">
	<div class="segment-bits">
		{#each bits as bit, bitIndex}
			{@const absoluteIndex = startIndex + bitIndex}
			<div
				class="bit"
				class:active={type === 'binary' && bit === '1'}
				class:set={type === 'bitarray' && bit === true}
				class:highlighted={highlightedBits.has(absoluteIndex)}
				class:blue={bitColors.get(absoluteIndex) === 'blue'}
				class:red={bitColors.get(absoluteIndex) === 'red'}
			>
				{type === 'binary' ? bit : bit ? '1' : '0'}
			</div>
		{/each}
	</div>
	<div class="segment-indices">
		{#each bits as _, bitIndex}
			{@const absoluteIndex = startIndex + bitIndex}
			<span class="index">{absoluteIndex}</span>
		{/each}
	</div>
</div>

<style>
	.bit-segment {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-small);
		padding: var(--gap-small);
		border: 1px solid var(--surface-3);
		border-radius: var(--radius-1);
		background: var(--surface-2);
	}

	.segment-bits {
		display: flex;
		gap: 4px;
	}

	.bit {
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--surface-3);
		border-radius: var(--radius-1);
		font-family: var(--font-monospace-code);
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-7);
		background: var(--surface-1);
		color: var(--text-2);
		transition: all 0.3s ease;
	}

	.bit.active {
		background: var(--accent);
		color: var(--surface-1);
		border-color: var(--accent);
		font-weight: var(--font-weight-7);
	}

	.bit.set {
		background: var(--surface-3);
		color: var(--text-1);
	}

	.bit.highlighted {
		transform: scale(1.1);
		border-width: 2px;
		z-index: 1;
	}

	.bit.blue {
		background: var(--accent);
		color: var(--surface-1);
		border-color: var(--accent);
	}

	.bit.red {
		background: var(--surface-4);
		color: var(--text-1);
		border-color: var(--text-2);
	}

	.segment-indices {
		display: flex;
		gap: 4px;
		justify-content: center;
	}

	.index {
		width: 1.5rem;
		font-size: var(--font-size-0);
		color: var(--text-2);
		font-family: var(--font-monospace-code);
		text-align: center;
	}

	@media (max-width: 600px) {
		.bit {
			width: 1.25rem;
			height: 1.25rem;
			font-size: var(--font-size-0);
		}

		.index {
			width: 1.25rem;
		}
	}
</style>
