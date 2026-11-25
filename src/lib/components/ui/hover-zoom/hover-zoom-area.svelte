<!--
	@component
	Hovering or focusing this element zooms the `HoverZoom.Target`s inside it (CSS-only, via the
	Tailwind group `zoom`). Renders a `div`; use `child` to render your own element instead:

	<HoverZoom.Area>
		{#snippet child({ props })}<a {href} class={cn(props.class, 'block')}>…</a>{/snippet}
	</HoverZoom.Area>
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '#lib/utils/index.ts';

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
