<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface OwnProps {
		class?: string;
	}

	const badge = cva('badge', {
		variants: {
			variant: {
				default: 'default',
				active: 'active',
				subtle: 'subtle'
			},
			size: {
				small: 'small',
				medium: 'medium',
				large: 'large'
			},
			interactive: {
				true: 'interactive',
				false: ''
			}
		}
	});

	type Props = OwnProps & SvelteHTMLElements['span'] & VariantProps<typeof badge>;

	const {
		variant = 'default',
		size = 'medium',
		interactive = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const badgeClasses = $derived(badge({ variant, size, interactive, class: className }));
</script>

<span class={badgeClasses} {...rest}>
	{@render children?.()}
</span>

<style>
	.badge {
		display: inline-block;
		border-radius: var(--radius-1);
		transition: all var(--animation-fade);
	}

	.default {
		background-color: color-mix(in srgb, var(--brand) 15%, transparent);
		color: var(--text-2);
		border: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
	}

	.default:hover {
		background-color: color-mix(in srgb, var(--brand) 20%, transparent);
		color: var(--text-1);
	}

	.active {
		background-color: var(--brand);
		color: var(--text-1);
		border: 1px solid var(--brand);
	}

	.subtle {
		background-color: var(--surface-2);
		color: var(--text-2);
	}

	.subtle:hover {
		background-color: var(--surface-3);
	}

	.small {
		font-size: var(--font-size-0);
		padding: calc(var(--size-1) * 0.5) var(--size-1);
	}

	.medium {
		font-size: var(--font-size-1);
		padding: var(--size-1) var(--size-2);
	}

	.large {
		font-size: var(--font-size-2);
		padding: var(--size-1) var(--size-3);
	}

	.interactive {
		cursor: pointer;
	}
</style>
