<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		href?: string;
		external?: boolean;
		/** Bracket colour on hover, e.g. `var(--color-livery-2)`. */
		accent?: string;
		class?: string;
		children: Snippet;
	}

	const {
		href,
		external = false,
		accent = 'var(--color-livery-2)',
		class: className,
		children
	}: Props = $props();
</script>

{#if href}
	<a
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		class={cn(
			'group hud no-underline transition-colors hover:bg-surface hover:[--hud-c:var(--accent)] focus-visible:[--hud-c:var(--accent)]',
			className
		)}
		style:--accent={accent}
	>
		{@render children()}
	</a>
{:else}
	<div class={cn('hud', className)}>
		{@render children()}
	</div>
{/if}
