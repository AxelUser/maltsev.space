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
	import { DisplayCard, LabeledInput, ParameterGroup } from '../common';

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

<div class="mx-auto rounded-md border border-surface-3 bg-surface-2 p-5 font-sans">
	<div class="grid grid-cols-1 items-start gap-5 md:grid-cols-[1fr_250px] md:gap-12">
		<!-- Bloom Filter -->
		<div class="min-w-0">
			<!-- Hash Values Display -->
			<div class="mb-5 grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))] gap-5">
				<DisplayCard label="Hash 1:" value={hash1Value} variant="centered" showEmpty={false} />
				<DisplayCard label="Hash 2:" value={hash2Value} variant="centered" showEmpty={false} />
			</div>

			<!-- Binary Representation -->
			<div class="mb-5 rounded-md border border-surface-3 bg-surface-1 p-5 text-center">
				<label class="mb-5 block text-base font-semibold text-fg-2">Mapped Bits:</label>
				{#if binaryValue !== ''}
					<div
						class="mx-auto grid max-w-[200px] grid-cols-1 justify-center gap-5 md:max-w-[600px] md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]"
					>
						{#each binaryGroups as group, groupIndex}
							<BitSegment bits={group} startIndex={groupIndex * 4} type="binary" />
						{/each}
					</div>
				{:else}
					<div class="p-5">
						<span class="font-mono text-fg-2 opacity-50">— Nothing yet —</span>
					</div>
				{/if}
			</div>

			<!-- User Input Section -->
			{#if userInputEnabled}
				<div class="mb-5 flex flex-col gap-2">
					<LabeledInput
						bind:value={inputValue}
						disabled={isAnimating}
						placeholder="Enter any text..."
						onkeydown={(e) => e.key === 'Enter' && handleInsert()}
					/>

					<div class="flex flex-wrap justify-center gap-2">
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
				<div class="mb-5 rounded-md border border-surface-3 bg-surface-1 p-5 text-center">
					<span class="mr-2 font-semibold text-fg-2"
						>{lastOperation === 'insert' ? 'Inserted' : 'Check'}:</span
					>
					<span class={result ? 'text-accent' : 'text-fg-2'}>
						{lastOperation === 'insert'
							? 'Element added'
							: result
								? 'Possibly present'
								: 'Definitely not present'}
					</span>
				</div>
			{/if}

			<!-- Bit Array Visualization -->
			<div class="mb-5 rounded-md border border-surface-3 bg-surface-1 p-5 text-center">
				<label class="mb-5 block text-base font-semibold text-fg-2">Bit Array:</label>
				<div
					class="mx-auto grid max-w-[200px] grid-cols-1 justify-center gap-5 md:max-w-[600px] md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]"
				>
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
		<div class="max-md:-order-1 md:sticky md:top-5">
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
