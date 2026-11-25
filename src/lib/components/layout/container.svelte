<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		as?: 'div' | 'section' | 'article' | 'header' | 'footer';
		class?: string;
		children: Snippet;
	}

	const { as = 'div', class: className, children }: Props = $props();
</script>

<svelte:element this={as} class={cn('mx-auto w-full max-w-page px-4 sm:px-8', className)}>
	{@render children()}
</svelte:element>
