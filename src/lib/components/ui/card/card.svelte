<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const card = cva('card', {
		variants: {
			variant: {
				default: 'default',
				elevated: 'elevated'
			},
			clickable: {
				true: 'clickable',
				false: ''
			}
		}
	});

	type Props = SvelteHTMLElements['div'] & VariantProps<typeof card>;

	const {
		variant = 'default',
		clickable = true,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const cardClasses = $derived(card({ variant, clickable, class: className }));
</script>

<div class={cardClasses} {...rest}>
	{@render children?.()}
</div>

<style>
	.card {
		display: block;
		color: var(--text-1);
		text-decoration: none;
		background-color: var(--surface-1);
		border: 1px solid var(--surface-2);
		padding: var(--gap);
		border-radius: var(--radius-3);
		transition: all var(--animation-fade);
	}

	.default {
		box-shadow: var(--shadow-3);
	}

	.default:hover {
		background-color: var(--surface-2);
		box-shadow: var(--shadow-4);
	}

	.elevated {
		box-shadow: var(--shadow-4);
	}

	.elevated:hover {
		background-color: var(--surface-2);
		box-shadow: var(--shadow-5);
		transform: translateY(-0.125rem);
	}

	.clickable {
		cursor: pointer;
	}
</style>
