<script lang="ts">
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

				<div class="input-group">
					<label for="expected-elements">Expected Elements (n):</label>
					<input
						id="expected-elements"
						type="number"
						bind:value={expectedElements}
						min="1"
						step="1"
						placeholder="100000"
					/>
				</div>

				<div class="input-group">
					<label for="false-positive-rate">Target False Positive Rate (p):</label>
					<input
						id="false-positive-rate"
						type="number"
						bind:value={falsePositiveRate}
						min="0.000001"
						max="0.999999"
						step="0.001"
						placeholder="0.01"
					/>
				</div>

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
						<div class="input-group">
							<label for="custom-m">Bit Array Size (m):</label>
							<input
								id="custom-m"
								type="number"
								bind:value={customM}
								min="1"
								step="1"
								placeholder={optimalM.toString()}
							/>
						</div>

						<div class="input-group">
							<label for="custom-k">Hash Functions (k):</label>
							<input
								id="custom-k"
								type="number"
								bind:value={customK}
								min="1"
								step="1"
								placeholder={optimalK.toString()}
							/>
						</div>
					</div>
				{/if}
			</div>

			<!-- Results Section -->
			<div class="results-section">
				<h3>Calculated Results</h3>

				<div class="results-grid">
					<div class="result-card">
						<div class="result-label">Bit Array Size (m)</div>
						<div class="result-value">
							{formatNumber(calculationMode === 'optimal' ? optimalM : customM || optimalM, 0)}
						</div>
						<div class="result-unit">bits</div>
					</div>

					<div class="result-card">
						<div class="result-label">Hash Functions (k)</div>
						<div class="result-value">
							{calculationMode === 'optimal' ? optimalK : customK || optimalK}
						</div>
						<div class="result-unit">functions</div>
					</div>

					<div class="result-card">
						<div class="result-label">Actual False Positive Rate</div>
						<div class="result-value">
							{formatPercentage(actualFPR)}
						</div>
						<div class="result-unit">probability</div>
					</div>

					<div class="result-card">
						<div class="result-label">Memory Usage</div>
						<div class="result-value">
							{formatMemory(memoryUsageBytes)}
						</div>
						<div class="result-unit">total</div>
					</div>

					<div class="result-card">
						<div class="result-label">Bits per Element</div>
						<div class="result-value">
							{formatNumber(bitsPerElement)}
						</div>
						<div class="result-unit">bits/element</div>
					</div>

					<div class="result-card">
						<div class="result-label">Space Efficiency</div>
						<div class="result-value">
							{formatNumber(100 * (1 - memoryUsageBytes / (expectedElements * ELEMENT_BITS)))}%
						</div>
						<div class="result-unit">vs naive storage ({ELEMENT_BITS} bits/element)</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Parameters Display -->
		<div class="parameters-column">
			<div class="parameters-section">
				<h3>Current Parameters</h3>
				<div class="parameter-item">
					<label>Expected Elements (n):</label>
					<span class="parameter-value">{formatNumber(expectedElements, 0)}</span>
				</div>
				<div class="parameter-item">
					<label>Target FPR (p):</label>
					<span class="parameter-value">{formatPercentage(falsePositiveRate)}</span>
				</div>
				<div class="parameter-item">
					<label>Bit Array Size (m):</label>
					<span class="parameter-value">
						{formatNumber(calculationMode === 'optimal' ? optimalM : customM || optimalM, 0)}
					</span>
				</div>
				<div class="parameter-item">
					<label>Hash Functions (k):</label>
					<span class="parameter-value">
						{calculationMode === 'optimal' ? optimalK : customK || optimalK}
					</span>
				</div>
			</div>

			<div class="parameters-section">
				<h3>Quick Presets</h3>
				<div class="preset-buttons">
					<button
						class="preset-btn"
						onclick={() => {
							expectedElements = 1000;
							falsePositiveRate = 0.01;
							calculationMode = 'optimal';
						}}
					>
						Small (1K, 1%)
					</button>
					<button
						class="preset-btn"
						onclick={() => {
							expectedElements = 100000;
							falsePositiveRate = 0.01;
							calculationMode = 'optimal';
						}}
					>
						Medium (100K, 1%)
					</button>
					<button
						class="preset-btn"
						onclick={() => {
							expectedElements = 1000000;
							falsePositiveRate = 0.001;
							calculationMode = 'optimal';
						}}
					>
						Large (1M, 0.1%)
					</button>
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

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
		margin-bottom: var(--gap);
	}

	.input-group label {
		font-size: var(--font-size-1);
		color: var(--text-2);
		font-weight: var(--font-weight-6);
	}

	.input-group input {
		padding: var(--gap-small);
		border: 1px solid var(--surface-3);
		border-radius: var(--radius-2);
		background: var(--surface-2);
		color: var(--text-1);
		font-size: var(--font-size-2);
		font-family: var(--font-monospace-code);
	}

	.input-group input::placeholder {
		color: var(--text-2);
		opacity: 0.8;
	}

	.input-group input:focus {
		outline: none;
		border-color: var(--brand);
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

	.result-card {
		background: var(--surface-2);
		border-radius: var(--radius-2);
		padding: var(--gap);
		text-align: center;
		border: 1px solid var(--surface-3);
	}

	.result-label {
		font-size: var(--font-size-0);
		color: var(--text-2);
		font-weight: var(--font-weight-6);
		margin-bottom: var(--gap-small);
	}

	.result-value {
		font-size: var(--font-size-3);
		font-family: var(--font-monospace-code);
		color: var(--text-1);
		font-weight: var(--font-weight-7);
		margin-bottom: var(--gap-small);
	}

	.result-unit {
		font-size: var(--font-size-0);
		color: var(--text-2);
		opacity: 0.8;
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
		font-size: var(--font-size-2);
		font-family: var(--font-monospace-code);
		color: var(--text-1);
		font-weight: var(--font-weight-7);
		padding: var(--gap-small);
		background: var(--surface-2);
		border-radius: var(--radius-1);
		text-align: center;
	}

	.preset-buttons {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
	}

	.preset-btn {
		padding: var(--gap-small);
		border: none;
		border-radius: var(--radius-2);
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-6);
		cursor: pointer;
		transition: all 0.2s ease;
		background: var(--surface-3);
		color: var(--text-1);
	}

	.preset-btn:hover {
		background: var(--brand);
		color: var(--brand-foreground);
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
			min-width: 80px;
		}

		.results-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.parameter-item {
			flex-direction: column;
			align-items: stretch;
		}

		.preset-buttons {
			flex-direction: column;
		}
	}
</style>
