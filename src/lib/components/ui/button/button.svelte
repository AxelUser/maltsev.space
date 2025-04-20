<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	interface OwnProps {
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	const button = cva('button', {
		variants: {
			intent: {
				primary: 'primary',
				secondary: 'secondary'
			},
			size: {
				small: 'small',
				medium: 'medium',
				large: 'large'
			},
			elevated: {
				true: 'elevated',
				false: ''
			},
			fullWidth: {
				true: 'full-width',
				false: ''
			}
		}
	});

	type Props = OwnProps & VariantProps<typeof button>;

	const {
		intent = 'primary',
		size = 'medium',
		elevated = false,
		fullWidth = false,
		href,
		type = 'button',
		class: className = '',
		children,
		onclick
	}: Props = $props();

	const buttonClasses = $derived(button({ intent, size, elevated, fullWidth, class: className }));
</script>

{#if href}
	<a {href} class={buttonClasses} {onclick}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={buttonClasses} {onclick}>
		{@render children?.()}
	</button>
{/if}

<style>
	.button {
		font-weight: var(--font-weight-6);
		display: inline-block;
		transition: all var(--transition-fast);
		cursor: pointer;
		border: none;
		font-family: var(--font-system-ui);
	}

	.primary {
		background-color: var(--brand);
		color: var(--text-1);
	}

	.primary:hover {
		background-color: var(--link);
	}

	.secondary {
		background-color: transparent;
		color: var(--text-2);
		border: 1px solid var(--brand);
	}

	.secondary:hover {
		background-color: color-mix(in srgb, var(--brand) 10%, transparent);
		color: var(--text-1);
	}

	.elevated:hover {
		box-shadow: var(--shadow-3);
		transform: translateY(calc(var(--size-1) * -0.5));
		transition: all var(--transition-slow);
	}

	.small {
		font-size: var(--font-size-1);
		padding: var(--size-1) var(--size-2);
		border-radius: var(--radius-1);
	}

	.medium {
		padding: var(--size-2) var(--size-4);
		border-radius: var(--radius-2);
	}

	.large {
		font-size: var(--font-size-3);
		padding: var(--size-3) var(--size-6);
		border-radius: var(--radius-3);
	}

	.full-width {
		width: 100%;
		text-align: center;
	}
</style>
