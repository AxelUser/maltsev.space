<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { DisplayCard, LabeledInput, ParameterGroup } from '../common';
	import { trackOnce, trackVizShown } from '$lib/analytics';

	const ELEMENT_BITS = 32;

	let expectedElements = $state<number>(100000);
	let falsePositiveRate = $state<number>(0.01);
	let customM = $state<number | null>(null);
	let customK = $state<number | null>(null);

	let calculationMode = $state<'optimal' | 'custom'>('optimal');

	const optimalM = $derived.by(() => {
		if (expectedElements <= 0 || falsePositiveRate <= 0 || falsePositiveRate >= 1) return 0;
		return Math.ceil(-(expectedElements * Math.log(falsePositiveRate)) / Math.pow(Math.log(2), 2));
	});

	const optimalK = $derived.by(() => {
		if (expectedElements <= 0 || optimalM <= 0) return 0;
		return Math.max(1, Math.round((optimalM / expectedElements) * Math.log(2)));
	});

	const actualFPR = $derived.by(() => {
		const m = calculationMode === 'optimal' ? optimalM : customM || optimalM;
		const k = calculationMode === 'optimal' ? optimalK : customK || optimalK;
		const n = expectedElements;

		if (n <= 0 || m <= 0 || k <= 0) return 0;

		return Math.pow(1 - Math.exp((-k * n) / m), k);
	});

	const memoryUsageBytes = $derived.by(() => {
		const m = calculationMode === 'optimal' ? optimalM : customM || optimalM;
		return Math.ceil(m / 8);
	});

	const bitsPerElement = $derived.by(() => {
		const m = calculationMode === 'optimal' ? optimalM : customM || optimalM;
		if (expectedElements <= 0) return 0;
		return m / expectedElements;
	});

	function trackUse(action: 'input' | 'preset') {
		trackOnce('bloom-calculator', 'viz_interacted', { viz: 'bloom-calculator', action });
	}

	function formatNumber(num: number, decimals = 2): string {
		if (num === 0) return '0';
		if (num < 0.01 && num > 0) return num.toExponential(2);
		return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
	}

	function formatPercentage(num: number): string {
		return (num * 100).toFixed(4) + '%';
	}

	function formatMemory(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KiB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
	}
</script>

<div
	class="mx-auto border border-line bg-surface p-5 font-sans"
	oninput={() => trackUse('input')}
	use:trackVizShown={{ viz: 'bloom-calculator' }}
>
	<h2 class="m-0 mb-12 text-center text-2xl leading-tight font-bold text-ink">
		Bloom Filter Parameter Calculator
	</h2>

	<div class="grid grid-cols-1 items-start gap-5 md:grid-cols-[1fr_300px] md:gap-12">
		<div class="min-w-0">
			<div class="mb-5 border border-line bg-canvas p-5">
				<h3 class="m-0 mb-5 text-lg leading-tight font-semibold text-ink">Input Parameters</h3>

				<LabeledInput
					label="Expected Elements (n):"
					bind:value={expectedElements}
					type="number"
					min={1}
					step="1"
					placeholder="100000"
					id="expected-elements"
				/>

				<LabeledInput
					label="Target False Positive Rate (p):"
					bind:value={falsePositiveRate}
					type="number"
					min={0.000001}
					max={0.999999}
					step="0.001"
					placeholder="0.01"
					id="false-positive-rate"
				/>

				<div class="my-5 bg-surface p-2">
					<h4 class="mt-5 mb-2 text-base leading-tight font-semibold text-ink-2">
						Calculation Mode
					</h4>
					<div class="flex flex-col gap-2">
						<label class="flex cursor-pointer items-center gap-2 text-base text-ink">
							<input type="radio" bind:group={calculationMode} value="optimal" />
							Calculate optimal parameters
						</label>
						<label class="flex cursor-pointer items-center gap-2 text-base text-ink">
							<input type="radio" bind:group={calculationMode} value="custom" />
							Use custom parameters
						</label>
					</div>
				</div>

				{#if calculationMode === 'custom'}
					<div class="border border-dashed border-line bg-surface p-5">
						<LabeledInput
							label="Bit Array Size (m):"
							bind:value={customM}
							type="number"
							min={1}
							step="1"
							placeholder={optimalM.toString()}
							id="custom-m"
						/>

						<LabeledInput
							label="Hash Functions (k):"
							bind:value={customK}
							type="number"
							min={1}
							step="1"
							placeholder={optimalK.toString()}
							id="custom-k"
						/>
					</div>
				{/if}
			</div>

			<div class="mb-5 border border-line bg-canvas p-5">
				<h3 class="m-0 mb-5 text-lg leading-tight font-semibold text-ink">Calculated Results</h3>

				<div class="grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
					<DisplayCard
						label="Bit Array Size (m)"
						value={formatNumber(calculationMode === 'optimal' ? optimalM : customM || optimalM, 0)}
						unit="bits"
						variant="elevated"
					/>

					<DisplayCard
						label="Hash Functions (k)"
						value={calculationMode === 'optimal' ? optimalK : customK || optimalK}
						unit="functions"
						variant="elevated"
					/>

					<DisplayCard
						label="Actual False Positive Rate"
						value={formatPercentage(actualFPR)}
						unit="probability"
						variant="elevated"
					/>

					<DisplayCard
						label="Memory Usage"
						value={formatMemory(memoryUsageBytes)}
						unit="total"
						variant="elevated"
					/>

					<DisplayCard
						label="Bits per Element"
						value={formatNumber(bitsPerElement)}
						unit="bits/element"
						variant="elevated"
					/>

					<DisplayCard
						label="Space Efficiency"
						value={`${formatNumber(100 * (1 - memoryUsageBytes / (expectedElements * ELEMENT_BITS)))}%`}
						description={`vs naive storage (${ELEMENT_BITS} bits/element)`}
						variant="elevated"
					/>
				</div>
			</div>
		</div>

		<div class="max-md:-order-1 md:sticky md:top-5">
			<ParameterGroup
				title="Current Parameters"
				parameters={[
					{ label: 'Expected Elements (n):', value: formatNumber(expectedElements, 0) },
					{ label: 'Target FPR (p):', value: formatPercentage(falsePositiveRate) },
					{
						label: 'Bit Array Size (m):',
						value: formatNumber(calculationMode === 'optimal' ? optimalM : customM || optimalM, 0)
					},
					{
						label: 'Hash Functions (k):',
						value: calculationMode === 'optimal' ? optimalK : customK || optimalK
					}
				]}
				variant="sticky"
				cardVariant="compact"
			/>

			<div class="mb-5 bg-canvas p-2 md:p-5">
				<h3 class="m-0 mb-5 text-lg leading-tight font-semibold">Quick Presets</h3>
				<div class="flex flex-col gap-2">
					<Button
						variant="ghost"
						class="justify-center"
						onclick={() => {
							expectedElements = 1000;
							falsePositiveRate = 0.01;
							trackUse('preset');
							calculationMode = 'optimal';
						}}
					>
						Small (1K, 1%)
					</Button>
					<Button
						variant="ghost"
						class="justify-center"
						onclick={() => {
							expectedElements = 100000;
							falsePositiveRate = 0.01;
							trackUse('preset');
							calculationMode = 'optimal';
						}}
					>
						Medium (100K, 1%)
					</Button>
					<Button
						variant="ghost"
						class="justify-center"
						onclick={() => {
							expectedElements = 1000000;
							falsePositiveRate = 0.001;
							trackUse('preset');
							calculationMode = 'optimal';
						}}
					>
						Large (1M, 0.1%)
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
