<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		pressed: boolean;
		color?: string;
		onclick: () => void;
		children: Snippet;
	}

	const { pressed, color, onclick, children }: Props = $props();
</script>

<button
	type="button"
	aria-pressed={pressed}
	{onclick}
	class={[
		'inline-flex items-center gap-2 border px-3 py-[5px] font-mono text-[12.5px] font-medium transition-colors',
		pressed
			? 'border-ink bg-ink text-canvas'
			: 'border-line bg-transparent text-ink-2 hover:border-line-2 hover:text-ink'
	]}
>
	{#if color}
		<span class="chevron size-2 [--cut:35%]" style:background={color} aria-hidden="true"></span>
	{/if}
	{@render children()}
</button>
