<script lang="ts">
	import { cn } from '$lib/utils';

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
	const footnoteClass = $derived(
		cn('text-center text-xs text-fg-2 opacity-70', variant === 'compact' && 'text-[0.5rem]')
	);
</script>

<div
	class={cn(
		'flex flex-col gap-2 rounded-md border border-surface-3 bg-surface-1 p-5 transition-all duration-200 ease-[ease]',
		variant === 'compact' && 'mb-2 p-2 last:mb-0',
		variant === 'elevated' && 'bg-surface-2 shadow-md',
		variant === 'centered' && 'items-center text-center'
	)}
>
	<div class="m-0 text-base font-semibold text-fg-2">{label}</div>
	<div
		class={cn(
			'flex min-h-[1.5em] items-center justify-center rounded-xs bg-surface-2 p-2 text-center font-mono text-lg/normal font-bold text-fg-1 transition-opacity duration-300 ease-[ease]',
			variant === 'elevated' && 'bg-surface-1',
			isEmpty && !showEmpty && 'opacity-40'
		)}
	>
		{displayValue}
	</div>
	{#if unit}
		<div class={footnoteClass}>{unit}</div>
	{/if}
	{#if description}
		<div class={footnoteClass}>{description}</div>
	{/if}
</div>
