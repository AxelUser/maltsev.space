<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface OwnProps {
		external?: boolean;
	}

	const link = cva('link', {
		variants: {
			variant: {
				default: 'default',
				subtle: 'subtle',
				nav: 'nav'
			},
			hasArrow: {
				true: 'has-arrow',
				false: ''
			},
			underlined: {
				true: 'underlined',
				false: ''
			}
		}
	});

	type Props = OwnProps & SvelteHTMLElements['a'] & VariantProps<typeof link>;

	const {
		variant = 'default',
		hasArrow = false,
		underlined = false,
		external = false,
		class: className = '',
		href,
		children,
		...rest
	}: Props = $props();

	const linkClasses = $derived(link({ variant, hasArrow, underlined, class: className }));
</script>

<a
	class={linkClasses}
	target={href && external ? '_blank' : undefined}
	rel={href && external ? 'noopener noreferrer' : undefined}
	{href}
	{...rest}
>
	{@render children?.()}
	{#if hasArrow}
		<span class="arrow">→</span>
	{/if}
</a>

<style>
	.link {
		text-decoration: none;
		transition: all var(--animation-fade);
	}

	.default {
		color: var(--link);
		font-weight: var(--font-weight-6);
	}

	.default:hover {
		color: var(--accent);
	}

	.subtle {
		color: var(--text-2);
	}

	.subtle:hover {
		color: var(--text-1);
	}

	.nav {
		color: var(--text-1);
		font-weight: var(--font-weight-6);
	}

	.nav:hover {
		color: var(--accent);
	}

	.has-arrow {
		display: inline-flex;
		align-items: center;
		gap: var(--size-1);
	}

	.underlined {
		text-decoration: underline;
	}

	.underlined:hover {
		text-decoration: none;
	}

	.arrow {
		transition: transform var(--animation-fade);
	}

	.link:hover .arrow {
		transform: translateX(var(--size-1));
	}
</style>
