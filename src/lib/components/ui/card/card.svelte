<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const card = cva('card', {
		variants: {
			variant: {
				default: 'default',
				glassmorphism: 'glassmorphism'
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
	{#if variant === 'glassmorphism'}
		<div class="shine"></div>
	{/if}
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
		position: relative;
		overflow: hidden;
	}

	.default {
		box-shadow: var(--shadow-3);
	}

	.default:hover {
		background-color: var(--surface-2);
		box-shadow: var(--shadow-4);
	}

	.glassmorphism {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}

	.glassmorphism:hover {
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		transform: translateY(-0.125rem);
	}

	.shine {
		position: absolute;
		bottom: -200%;
		left: -200%;
		width: 150%;
		height: 150%;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		transform: rotate(45deg);
		pointer-events: none;
		transition: all 0.7s ease-in-out;
	}

	.glassmorphism:hover .shine {
		bottom: 100%;
		left: 100%;
		transition: all 0.7s ease-in-out;
	}

	.clickable {
		cursor: pointer;
	}
</style>
