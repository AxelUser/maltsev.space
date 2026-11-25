<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils/index.ts';

	const button = cva(
		'inline-flex items-center gap-2.5 border-0 py-3 font-display text-[15px] font-semibold font-stretch-[110%] no-underline transition-transform hover:translate-x-[3px] disabled:pointer-events-none disabled:opacity-50',
		{
			variants: {
				variant: {
					primary: 'chevron bg-livery-1 pr-[22px] pl-7 text-on-livery [--cut:12px]',
					ghost: 'bg-surface px-[22px] text-ink shadow-[inset_0_0_0_1px_var(--color-line-2)]'
				}
			}
		}
	);

	type Props = VariantProps<typeof button> & {
		href?: string;
		external?: boolean;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	};

	const {
		variant = 'primary',
		href,
		external = false,
		type = 'button',
		disabled,
		class: className,
		onclick,
		children
	}: Props = $props();

	const classes = $derived(cn(button({ variant }), className));
</script>

{#if href}
	<a
		{href}
		class={classes}
		{onclick}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} {onclick} {disabled}>
		{@render children()}
	</button>
{/if}
