<!--
	@component
	Scales up while its `HoverZoom.Area` is hovered or focused; clip it with an `overflow-hidden`
	parent such as `Frame`. Renders a `div`; use `child` to apply the classes to your own element:

	<HoverZoom.Target>
		{#snippet child({ props })}<Picture {...props} src={hero} />{/snippet}
	</HoverZoom.Target>
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
