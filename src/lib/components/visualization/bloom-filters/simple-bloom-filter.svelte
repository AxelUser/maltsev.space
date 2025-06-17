<script lang="ts">
	import { SimpleBloomFilter } from './simple-bloom-filter';
	import BitSegment from './bit-segment.svelte';
	import {
		type BloomFilterOperation,
		type AnimationStep,
		DEFAULT_SIZE,
		DEFAULT_NUM_HASH_FUNCTIONS
	} from './types';
	import { Button } from '$lib/components/ui';
	import { DisplayCard, ParameterGroup } from '../common';

	interface Props {
		size?: number;
		numHashFunctions?: number;
		stepDuration?: number;
		userInputEnabled?: boolean;
		autoAnimate?: boolean;
	}

	const {
		size = DEFAULT_SIZE,
		numHashFunctions = DEFAULT_NUM_HASH_FUNCTIONS,
		stepDuration = 1500,
		userInputEnabled = true,
		autoAnimate = true
	}: Props = $props();

	let inputValue = $state<string>('');
	let isAnimating = $state<boolean>(false);
	let animationSteps = $state<AnimationStep[]>([]);
	let lastOperation = $state<BloomFilterOperation | null>(null);
	let result = $state<boolean | null>(null);

	let hash1Value = $state<number | null>(null);
	let hash2Value = $state<number | null>(null);
	let binaryValue = $state<string>('');
	let highlightedBits = $state<Set<number>>(new Set());
	let bitColors = $state<Map<number, 'blue' | 'red'>>(new Map());

	let bloomFilter = $derived(new SimpleBloomFilter(size, numHashFunctions));
	let bitArray = $state<boolean[]>([]);

	$effect(() => {
		bitArray = bloomFilter.getBitArray();
	});

	const k = $derived(numHashFunctions);
	const m = $derived(size);

	function resetDisplay() {
		hash1Value = null;
		hash2Value = null;
		binaryValue = '';
		highlightedBits.clear();
		bitColors.clear();
		result = null;
	}

	async function executeOperation(operation: BloomFilterOperation, value: string) {
		if (isAnimating || !value.trim()) return;

		isAnimating = true;
		lastOperation = operation;
		resetDisplay();

		if (operation === 'insert') {
			animationSteps = bloomFilter.generateInsertSteps(value);
		} else {
			animationSteps = bloomFilter.generateCheckSteps(value);
		}

		for (let i = 0; i < animationSteps.length; i++) {
			const step = animationSteps[i];

			switch (step.type) {
				case 'hash1':
					hash1Value = step.value;
					break;
				case 'hash2':
					hash2Value = step.value;
					break;
				case 'binary':
					binaryValue = step.value;
					break;
				case 'setBit':
					highlightedBits.add(step.index);
					if (operation === 'insert') {
						bitColors.set(step.index, step.wasSet ? 'red' : 'blue');
						if (!step.wasSet) {
							bitArray[step.index] = true;
						}
					} else {
						bitColors.set(step.index, step.wasSet ? 'blue' : 'red');
					}
					highlightedBits = new Set(highlightedBits);
					bitColors = new Map(bitColors);
					bitArray = [...bitArray];
					break;
			}

			if (autoAnimate && i < animationSteps.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, stepDuration));
			}
		}

		if (operation === 'insert') {
			bloomFilter.insert(value);
			result = true;
		} else {
			result = bloomFilter.check(value);
		}

		bitArray = bloomFilter.getBitArray();

		if (autoAnimate) {
			setTimeout(() => {
				highlightedBits.clear();
				bitColors.clear();
				highlightedBits = new Set();
				bitColors = new Map();
			}, stepDuration);
		}

		isAnimating = false;
	}

	async function handleInsert() {
		if (!userInputEnabled) return;
		await executeOperation('insert', inputValue);
		inputValue = '';
	}

	async function handleCheck() {
		if (!userInputEnabled) return;
		await executeOperation('check', inputValue);
		inputValue = '';
	}

	function handleReset() {
		if (isAnimating) return;
		bloomFilter.reset();
		bitArray = bloomFilter.getBitArray();
		resetDisplay();
	}

	const bitGroups = $derived(
		bitArray.reduce((groups: boolean[][], bit, index) => {
			const groupIndex = Math.floor(index / 4);
			if (!groups[groupIndex]) {
				groups[groupIndex] = [];
			}
			groups[groupIndex].push(bit);
			return groups;
		}, [])
	);

	const binaryGroups = $derived(
		binaryValue.split('').reduce((groups: string[][], bit, index) => {
			const groupIndex = Math.floor(index / 4);
			if (!groups[groupIndex]) {
				groups[groupIndex] = [];
			}
			groups[groupIndex].push(bit);
			return groups;
		}, [])
	);
</script>

<div class="bloom-filter-container">
	<div class="layout">
		<!-- Bloom Filter -->
		<div class="main-content">
			<!-- Hash Values Display -->
			<div class="hash-display">
				<DisplayCard label="Hash 1:" value={hash1Value} variant="centered" showEmpty={false} />
				<DisplayCard label="Hash 2:" value={hash2Value} variant="centered" showEmpty={false} />
			</div>

			<!-- Binary Representation -->
			<div class="binary-display">
				<label>Mapped Bits:</label>
				{#if binaryValue !== ''}
					<div class="binary-grid">
						{#each binaryGroups as group, groupIndex}
							<BitSegment bits={group} startIndex={groupIndex * 4} type="binary" />
						{/each}
					</div>
				{:else}
					<div class="binary-placeholder">
						<span class="placeholder">— Nothing yet —</span>
					</div>
				{/if}
			</div>

			<!-- User Input Section -->
			{#if userInputEnabled}
				<div class="input-section">
					<input
						type="text"
						bind:value={inputValue}
						placeholder="Enter a string..."
						disabled={isAnimating}
						onkeydown={(e) => e.key === 'Enter' && handleInsert()}
					/>
					<div class="button-group">
						<Button
							intent="primary"
							onclick={handleInsert}
							disabled={isAnimating || !inputValue.trim()}
						>
							Insert
						</Button>
						<Button
							intent="primary"
							onclick={handleCheck}
							disabled={isAnimating || !inputValue.trim()}
						>
							Check
						</Button>
						<Button intent="secondary" onclick={handleReset} disabled={isAnimating}>Reset</Button>
					</div>
				</div>
			{/if}

			<!-- Result Display -->
			{#if result !== null && lastOperation}
				<div class="result-display">
					<span class="operation">{lastOperation === 'insert' ? 'Inserted' : 'Check'}:</span>
					<span class="result" class:positive={result} class:negative={!result}>
						{lastOperation === 'insert'
							? 'Element added'
							: result
								? 'Possibly present'
								: 'Definitely not present'}
					</span>
				</div>
			{/if}

			<!-- Bit Array Visualization -->
			<div class="binary-display">
				<label>Bit Array:</label>
				<div class="binary-grid">
					{#each bitGroups as group, groupIndex}
						<BitSegment
							bits={group}
							startIndex={groupIndex * 4}
							type="bitarray"
							{highlightedBits}
							{bitColors}
						/>
					{/each}
				</div>
			</div>
		</div>
		<!-- Parameters -->
		<div class="parameters-column">
			<ParameterGroup
				title="Parameters"
				parameters={[
					{ label: 'k (Hash Functions):', value: k },
					{ label: 'm (Bit Array Size):', value: m }
				]}
				variant="sticky"
			/>
		</div>
	</div>
</div>

<style>
	@import 'open-props/media';

	.bloom-filter-container {
		margin: 0 auto;
		padding: var(--gap);
		font-family: var(--font-system-ui);
		background: var(--surface-2);
		border-radius: var(--radius-2);
		border: 1px solid var(--surface-3);
	}

	.layout {
		display: grid;
		grid-template-columns: 1fr 250px;
		gap: var(--gap-large);
		align-items: start;
	}

	.parameters-column {
		position: sticky;
		top: var(--gap);
	}

	.main-content {
		min-width: 0;
	}

	.hash-display {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--gap);
		margin-bottom: var(--gap);
	}

	.binary-display {
		text-align: center;
		margin-bottom: var(--gap);
		padding: var(--gap);
		background: var(--surface-1);
		border-radius: var(--radius-2);
		border: 1px solid var(--surface-3);
	}

	.binary-display label {
		display: block;
		font-size: var(--font-size-1);
		color: var(--text-2);
		font-weight: var(--font-weight-6);
		margin-bottom: var(--gap);
	}

	.binary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: var(--gap);
		justify-content: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.binary-placeholder {
		padding: var(--gap);
	}

	.placeholder {
		font-family: var(--font-monospace-code);
		color: var(--text-2);
		opacity: 0.5;
	}

	.input-section {
		text-align: center;
		margin-bottom: var(--gap);
		padding: var(--gap);
		background: var(--surface-1);
		border-radius: var(--radius-2);
		border: 1px solid var(--surface-3);
	}

	.input-section input {
		width: 100%;
		max-width: 300px;
		padding: var(--gap-small);
		margin-bottom: var(--gap);
		border: 1px solid var(--surface-3);
		border-radius: var(--radius-2);
		background: var(--surface-1);
		color: var(--text-1);
		font-size: var(--font-size-2);
		text-align: center;
	}

	.input-section input::placeholder {
		color: var(--text-2);
		opacity: 0.8;
	}

	.input-section input:focus {
		outline: none;
		border-color: var(--brand);
	}

	.button-group {
		display: flex;
		gap: var(--gap-small);
		justify-content: center;
		flex-wrap: wrap;
	}

	.result-display {
		text-align: center;
		margin-bottom: var(--gap);
		padding: var(--gap);
		border-radius: var(--radius-2);
		background: var(--surface-1);
		border: 1px solid var(--surface-3);
	}

	.operation {
		font-weight: var(--font-weight-6);
		color: var(--text-2);
		margin-right: var(--gap-small);
	}

	.result.positive {
		color: var(--accent);
	}

	.result.negative {
		color: var(--text-2);
	}

	@media (--md-n-below) {
		.layout {
			grid-template-columns: 1fr;
			gap: var(--gap);
		}

		.parameters-column {
			position: static;
			order: -1;
		}

		.binary-grid {
			grid-template-columns: 1fr;
			max-width: 200px;
		}
	}
</style>
