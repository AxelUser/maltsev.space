<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	interface OwnProps {
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	const button = cva(
		'inline-block cursor-pointer font-sans font-semibold no-underline transition-all disabled:cursor-not-allowed disabled:opacity-50',
		{
			variants: {
				intent: {
					primary: 'bg-brand text-brand-fg hover:not-disabled:bg-link',
					secondary:
						'border border-brand bg-transparent text-fg-2 hover:not-disabled:bg-brand/10 hover:not-disabled:text-fg-1'
				},
				size: {
					small: 'rounded-xs px-2 py-1 text-base',
					medium: 'rounded-md px-5 py-2',
					large: 'rounded-2xl px-7 py-4 text-xl'
				},
				fullWidth: {
					true: 'w-full text-center',
					false: ''
				}
			}
		}
	);

	type Props = OwnProps & VariantProps<typeof button>;

	const {
		intent = 'primary',
		size = 'medium',
		fullWidth = false,
		href,
		type = 'button',
		class: className = '',
		children,
		onclick,
		disabled
	}: Props = $props();

	const buttonClasses = $derived(cn(button({ intent, size, fullWidth }), className));
</script>

{#if href}
	<a {href} class={buttonClasses} {onclick}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={buttonClasses} {onclick} {disabled}>
		{@render children?.()}
	</button>
{/if}
