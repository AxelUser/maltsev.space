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
	class="mb-5 flex flex-col gap-2 border border-line bg-canvas p-5 transition-all duration-200 ease-[ease]"
>
	{#if label}
		<label for={inputId} class="m-0 text-base font-semibold text-ink-2">
			{label}{required ? '*' : ''}
		</label>
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
		class="min-h-[1.5em] border border-line bg-surface p-2 text-center font-mono text-lg/normal font-bold text-ink transition-all duration-200 ease-[ease] placeholder:text-center placeholder:text-ink-3 placeholder:opacity-60 focus:border-livery-2 focus:bg-canvas focus:outline-none disabled:cursor-not-allowed disabled:bg-line disabled:opacity-60"
	/>
</div>
