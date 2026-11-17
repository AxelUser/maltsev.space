<!--
	@component
	Scales up while the enclosing `HoverZoom.Area` is hovered or keyboard-focused. Clip it with an
	`overflow-hidden` parent (e.g. `Frame`). Use `child` to put the classes straight on your element
	instead of adding a wrapper:

	<HoverZoom.Target>
		{#snippet child({ props })}<Picture {...props} src={hero} />{/snippet}
	</HoverZoom.Target>
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';

	interface Props {
		class?: ClassValue;
		children?: Snippet;
		child?: Snippet<[{ props: { class: string } }]>;
	}

	const { class: className, children, child }: Props = $props();

	const attrs = $derived({
		class: cn(
			'transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover/zoom:scale-[1.02] group-focus-visible/zoom:scale-[1.02] motion-reduce:transition-none',
			className
		)
	});
</script>

{#if child}
	{@render child({ props: attrs })}
{:else}
	<div {...attrs}>{@render children?.()}</div>
{/if}
