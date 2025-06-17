<script lang="ts">
	interface Props {
		label: string;
		value: string | number | null;
		unit?: string;
		description?: string;
		variant?: 'default' | 'compact' | 'elevated' | 'centered';
		showEmpty?: boolean;
	}

	const {
		label,
		value,
		unit,
		description,
		variant = 'default',
		showEmpty = true
	}: Props = $props();

	const isEmpty = $derived(value === null || value === undefined || value === '');
	const displayValue = $derived(isEmpty && !showEmpty ? '—' : value);
</script>

<div
	class="display-card"
	class:compact={variant === 'compact'}
	class:elevated={variant === 'elevated'}
	class:centered={variant === 'centered'}
	class:empty={isEmpty && !showEmpty}
>
	<div class="label">{label}</div>
	<div class="value" class:fade={isEmpty && !showEmpty}>{displayValue}</div>
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
		background: var(--surface-1);
		border-radius: var(--radius-2);
		padding: var(--gap);
		border: 1px solid var(--surface-3);
		transition: all 0.2s ease;
	}

	.display-card.compact {
		padding: var(--gap-small);
		gap: var(--gap-small);
		margin-bottom: var(--gap-small);
	}

	.display-card.compact:last-child {
		margin-bottom: 0;
	}

	.display-card.elevated {
		background: var(--surface-2);
		box-shadow: var(--shadow-2);
		border: 1px solid var(--surface-3);
	}

	.display-card.centered {
		align-items: center;
		text-align: center;
	}

	.label {
		font-size: var(--font-size-1);
		color: var(--text-2);
		font-weight: var(--font-weight-6);
		margin: 0;
	}

	.value {
		font-size: var(--font-size-2);
		font-family: var(--font-monospace-code);
		color: var(--text-1);
		font-weight: var(--font-weight-7);
		background: var(--surface-2);
		padding: var(--gap-small);
		border-radius: var(--radius-1);
		text-align: center;
		min-height: 1.5em;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.3s ease;
	}

	.display-card.elevated .value {
		background: var(--surface-1);
	}

	.value.fade {
		opacity: 0.4;
	}

	.unit,
	.description {
		font-size: var(--font-size-0);
		color: var(--text-2);
		opacity: 0.7;
		text-align: center;
	}

	.display-card.compact .unit,
	.display-card.compact .description {
		font-size: var(--font-size-00);
	}
</style>
