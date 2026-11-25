<!--
	@component
	A note's title inside `NoteLink`; turns link-coloured on hover.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cva, type VariantProps } from 'class-variance-authority';
	import { cn } from '#lib/utils/index.ts';

	const title = cva(
		'm-0 block font-display font-medium font-stretch-[104%] transition-colors group-hover:text-link',
		{
			variants: {
				size: {
					/** Featured note. */
					lg: 'text-[clamp(26px,3vw,36px)]/[1.12] font-semibold tracking-[-0.01em] font-stretch-[106%]',
					/** Grid cards, rows, inline cards. */
					md: 'text-[16.5px]/[1.3] sm:text-[19px]',
					/** Pager, series parts. */
					sm: 'text-[15.5px]/[1.35]'
				}
			}
		}
	);

	type Props = VariantProps<typeof title> & {
		as?: 'span' | 'h3';
		class?: ClassValue;
		children: Snippet;
	};

	const { size = 'md', as = 'span', class: className, children }: Props = $props();
</script>

<svelte:element this={as} class={cn(title({ size }), className)}>
	{@render children()}
</svelte:element>
