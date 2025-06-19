<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { DisplayCard, LabeledInput, ParameterGroup } from '../common';

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

<div class="calculator-container">
	<h2>Bloom Filter Parameter Calculator</h2>

	<div class="layout">
		<!-- Calculator -->
		<div class="main-content">
			<!-- Input Section -->
			<div class="input-section">
				<h3>Input Parameters</h3>

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

				<!-- Calculation Mode -->
				<div class="mode-section">
					<h4>Calculation Mode</h4>
					<div class="radio-group">
						<label class="radio-label">
							<input type="radio" bind:group={calculationMode} value="optimal" />
							Calculate optimal parameters
						</label>
						<label class="radio-label">
							<input type="radio" bind:group={calculationMode} value="custom" />
							Use custom parameters
						</label>
					</div>
				</div>

				{#if calculationMode === 'custom'}
					<div class="custom-params">
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

			<!-- Results Section -->
			<div class="results-section">
				<h3>Calculated Results</h3>

				<div class="results-grid">
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

		<!-- Parameters Display -->
		<div class="parameters-column">
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

			<div class="parameters-section">
				<h3>Quick Presets</h3>
				<div class="preset-buttons">
					<Button
						onclick={() => {
							expectedElements = 1000;
							falsePositiveRate = 0.01;
							calculationMode = 'optimal';
						}}
					>
						Small (1K, 1%)
					</Button>
					<Button
						onclick={() => {
							expectedElements = 100000;
							falsePositiveRate = 0.01;
							calculationMode = 'optimal';
						}}
					>
						Medium (100K, 1%)
					</Button>
					<Button
						onclick={() => {
							expectedElements = 1000000;
							falsePositiveRate = 0.001;
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

<style>
	.calculator-container {
		margin: 0 auto;
		padding: var(--gap);
		font-family: var(--font-system-ui);
		background: var(--surface-2);
		border-radius: var(--radius-2);
		border: 1px solid var(--surface-3);
	}

	.calculator-container h2 {
		margin: 0 0 var(--gap-large) 0;
		font-size: var(--font-size-4);
		font-weight: var(--font-weight-7);
		color: var(--text-1);
		text-align: center;
	}

	.layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: var(--gap-large);
		align-items: start;
	}

	.main-content {
		min-width: 0;
	}

	.input-section,
	.results-section {
		background: var(--surface-1);
		border-radius: var(--radius-2);
		padding: var(--gap);
		margin-bottom: var(--gap);
		border: 1px solid var(--surface-3);
	}

	.input-section h3,
	.results-section h3 {
		margin: 0 0 var(--gap) 0;
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-6);
		color: var(--text-1);
	}

	.input-section h4 {
		margin: var(--gap) 0 var(--gap-small) 0;
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-6);
		color: var(--text-2);
	}

	.mode-section {
		margin: var(--gap) 0;
		padding: var(--gap-small);
		background: var(--surface-2);
		border-radius: var(--radius-1);
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: var(--gap-small);
		font-size: var(--font-size-1);
		color: var(--text-1);
		cursor: pointer;
	}

	.custom-params {
		background: var(--surface-2);
		padding: var(--gap);
		border-radius: var(--radius-1);
		border: 1px dashed var(--surface-3);
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--gap);
	}

	.parameters-column {
		position: sticky;
		top: var(--gap);
	}

	.parameters-section {
		background: var(--surface-1);
		border-radius: var(--radius-2);
		padding: var(--gap);
		margin-bottom: var(--gap);
	}

	.parameters-section h3 {
		margin: 0 0 var(--gap) 0;
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-6);
	}

	.preset-buttons {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
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

		.results-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.preset-buttons {
			flex-direction: column;
		}
	}
</style>
