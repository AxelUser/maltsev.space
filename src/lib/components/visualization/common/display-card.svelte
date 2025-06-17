<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		unit?: string;
		description?: string;
		variant?: 'default' | 'hash' | 'parameter' | 'result';
	}

	const { label, value, unit, description, variant = 'default' }: Props = $props();
</script>

<div
	class="display-card"
	class:hash={variant === 'hash'}
	class:parameter={variant === 'parameter'}
	class:result={variant === 'result'}
>
	<div class="label">{label}</div>
	<div class="value">{value}</div>
	{#if unit}
		<div class="unit">{unit}</div>
	{/if}
	{#if description}
		<div class="description">{description}</div>
	{/if}
</div>

<style>
	.display-card {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
	}

	.display-card.hash {
		align-items: center;
		text-align: center;
	}

	.display-card.parameter {
		margin-bottom: var(--gap);
	}

	.display-card.parameter:last-child {
		margin-bottom: 0;
	}

	.display-card.result {
		background: var(--surface-2);
		border-radius: var(--radius-2);
		padding: var(--gap);
		text-align: center;
		border: 1px solid var(--surface-3);
	}

	.label {
		font-size: var(--font-size-1);
		color: var(--text-2);
		font-weight: var(--font-weight-6);
	}

	.value {
		font-size: var(--font-size-3);
		font-family: var(--font-monospace-code);
		color: var(--text-1);
		font-weight: var(--font-weight-7);
	}

	.display-card.parameter .value {
		font-size: var(--font-size-2);
		padding: var(--gap-small);
		background: var(--surface-2);
		border-radius: var(--radius-1);
		text-align: center;
	}

	.display-card.result .value {
		margin-bottom: var(--gap-small);
	}

	.display-card.hash .value {
		opacity: 0;
		transition: opacity 0.3s ease;
		min-width: 3ch;
	}

	.display-card.hash .value:not(:empty) {
		opacity: 1;
	}

	.unit {
		font-size: var(--font-size-0);
		color: var(--text-2);
		opacity: 0.8;
	}

	.description {
		font-size: var(--font-size-0);
		color: var(--text-2);
		opacity: 0.8;
	}
</style>
