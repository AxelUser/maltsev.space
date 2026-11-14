<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface OwnProps {
		label?: string;
	}

	type Props = OwnProps & SvelteHTMLElements['input'];

	let {
		label,
		value = $bindable(),
		type = 'text',
		placeholder,
		disabled = false,
		min,
		max,
		step,
		id,
		required = false
	}: Props = $props();

	const inputId = $derived(id || `input-${Math.random().toString(36).substr(2, 9)}`);
</script>

<div
	class="mb-5 flex flex-col gap-2 rounded-md border border-surface-3 bg-surface-1 p-5 transition-all duration-200 ease-[ease]"
>
	{#if label}
		<label for={inputId} class="m-0 text-base font-semibold text-fg-2"
			>{label}{required ? '*' : ''}</label
		>
	{/if}
	<input
		id={inputId}
		{type}
		bind:value
		{placeholder}
		{disabled}
		{min}
		{max}
		{step}
		{required}
		class="min-h-[1.5em] rounded-xs border border-surface-3 bg-surface-2 p-2 text-center font-mono text-lg/normal font-bold text-fg-1 transition-all duration-200 ease-[ease] placeholder:text-center placeholder:text-fg-2 placeholder:opacity-60 focus:border-brand focus:bg-surface-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-3 disabled:opacity-60"
	/>
</div>
