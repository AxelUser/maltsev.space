<!--
	@component
	The region whose hover (or keyboard focus) zooms every `HoverZoom.Target` inside it.
	CSS-only: it marks the element as the `zoom` Tailwind group, so no state or JS runs.
	Renders a `div`, or hand it your own element through `child` (merge `props.class` in):

	<HoverZoom.Area>
		{#snippet child({ props })}<a {href} class={cn(props.class, 'block')}>…</a>{/snippet}
	</HoverZoom.Area>
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

	const attrs = $derived({ class: cn('group/zoom', className) });
</script>

{#if child}
	{@render child({ props: attrs })}
{:else}
	<div {...attrs}>{@render children?.()}</div>
{/if}
