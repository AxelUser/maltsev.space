<script lang="ts">
	import { onMount } from 'svelte';
	import { SimpleBloomFilter } from './simple-bloom-filter';
	import BitSegment from './bit-segment.svelte';
	import {
		type BloomFilterOperation,
		type AnimationStep,
		DEFAULT_SIZE,
		DEFAULT_NUM_HASH_FUNCTIONS
	} from './types';

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
	let currentStep = $state<number>(-1);
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
			currentStep = i;
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
		currentStep = -1;
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
				<div class="hash-item">
					<label>Hash 1:</label>
					<span class="hash-value" class:visible={hash1Value !== null}>
						{hash1Value ?? '—'}
					</span>
				</div>
				<div class="hash-item">
					<label>Hash 2:</label>
					<span class="hash-value" class:visible={hash2Value !== null}>
						{hash2Value ?? '—'}
					</span>
				</div>
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
						<button
							type="button"
							onclick={handleInsert}
							disabled={isAnimating || !inputValue.trim()}
							class="insert-btn"
						>
							Insert
						</button>
						<button
							type="button"
							onclick={handleCheck}
							disabled={isAnimating || !inputValue.trim()}
							class="check-btn"
						>
							Check
						</button>
						<button type="button" onclick={handleReset} disabled={isAnimating} class="reset-btn">
							Reset
						</button>
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
			<div class="parameters-section">
				<h3>Parameters</h3>
				<div class="parameter-item">
					<label>k (Hash Functions):</label>
					<span class="parameter-value">{k}</span>
				</div>
				<div class="parameter-item">
					<label>m (Bit Array Size):</label>
					<span class="parameter-value">{m}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
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

	.parameters-section {
		background: var(--surface-1);
		border-radius: var(--radius-2);
		padding: var(--gap);
	}

	.parameters-section h3 {
		margin: 0 0 var(--gap) 0;
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-6);
	}

	.parameter-item {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
		margin-bottom: var(--gap);
	}

	.parameter-item:last-child {
		margin-bottom: 0;
	}

	.parameter-item label {
		font-size: var(--font-size-1);
		color: var(--text-2);
		font-weight: var(--font-weight-6);
	}

	.parameter-value {
		font-size: var(--font-size-3);
		font-family: var(--font-monospace-code);
		color: var(--text-1);
		font-weight: var(--font-weight-7);
		padding: var(--gap-small);
		background: var(--surface-2);
		border-radius: var(--radius-1);
		text-align: center;
	}

	.main-content {
		min-width: 0;
	}

	.hash-display {
		display: flex;
		gap: var(--gap-large);
		justify-content: center;
		margin-bottom: var(--gap);
		padding: var(--gap);
		background: var(--surface-1);
		border-radius: var(--radius-2);
	}

	.hash-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-small);
	}

	.hash-item label {
		font-size: var(--font-size-1);
		color: var(--text-2);
		font-weight: var(--font-weight-6);
	}

	.hash-value {
		font-size: var(--font-size-3);
		font-family: var(--font-monospace-code);
		color: var(--text-1);
		opacity: 0;
		transition: opacity 0.3s ease;
		min-width: 3ch;
		text-align: center;
	}

	.hash-value.visible {
		opacity: 1;
	}

	.binary-display {
		text-align: center;
		margin-bottom: var(--gap);
		padding: var(--gap);
		background: var(--surface-1);
		border-radius: var(--radius-2);
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

	button {
		padding: var(--gap-small) var(--gap);
		border: none;
		border-radius: var(--radius-2);
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-6);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.insert-btn {
		background: var(--brand);
		color: var(--brand-foreground);
	}

	.insert-btn:hover:not(:disabled) {
		background: var(--accent);
	}

	.check-btn {
		background: var(--surface-3);
		color: var(--text-1);
	}

	.check-btn:hover:not(:disabled) {
		background: var(--surface-4);
	}

	.reset-btn {
		background: var(--surface-3);
		color: var(--text-2);
	}

	.reset-btn:hover:not(:disabled) {
		background: var(--surface-4);
	}

	.result-display {
		text-align: center;
		margin-bottom: var(--gap);
		padding: var(--gap-small);
		border-radius: var(--radius-2);
		background: var(--surface-1);
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

	@media (max-width: 768px) {
		.layout {
			grid-template-columns: 1fr;
			gap: var(--gap);
		}

		.parameters-column {
			position: static;
			order: -1;
		}

		.parameters-section {
			padding: var(--gap-small);
		}

		.parameter-item {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.parameter-value {
			padding: var(--gap-small);
			min-width: 60px;
		}
	}

	@media (max-width: 600px) {
		.binary-grid {
			grid-template-columns: 1fr;
			max-width: 200px;
		}

		.parameter-item {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
