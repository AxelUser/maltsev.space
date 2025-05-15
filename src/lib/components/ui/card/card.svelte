<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const card = cva('card', {
		variants: {
			variant: {
				default: 'default',
				neon: 'neon'
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
		clickable = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const cardClasses = $derived(card({ variant, clickable, class: className }));
</script>

<div class={cardClasses} {...rest}>
	{@render children?.()}
	{#if variant === 'neon'}
		<div class="neon-border"></div>
	{/if}
</div>

<style>
	.card {
		display: block;
		color: var(--text-1);
		text-decoration: none;
		background-color: var(--surface-2);
		border: 1px solid var(--surface-3);
		padding: var(--gap);
		border-radius: var(--radius-3);
		transition: all var(--animation-fade);
		position: relative;
		overflow: hidden;
	}

	.default {
		box-shadow: var(--shadow-3);
	}

	.neon {
		border: none;
		position: relative;
		z-index: 1;
	}

	.neon:hover {
		background-color: var(--surface-3);
	}

	.neon-border {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: var(--radius-3);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		z-index: -1;
	}

	.neon-border::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: var(--radius-3);
		padding: 2px;
		background: linear-gradient(45deg, var(--accent), var(--star), var(--nebula), var(--accent));
		background-size: 400% 400%;
		z-index: -1;
	}

	.neon-border::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		right: 2px;
		bottom: 2px;
		background-color: var(--surface-3);
		border-radius: calc(var(--radius-3) - 2px);
		z-index: 1;
	}

	.neon:hover .neon-border {
		opacity: 1;
	}

	.neon:hover .neon-border::before {
		animation: rotate 3s linear infinite;
	}

	@keyframes rotate {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.clickable {
		cursor: pointer;
	}
</style>
