<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface OwnProps {
		external?: boolean;
	}

	const link = cva('no-underline transition-colors', {
		variants: {
			variant: {
				default: 'font-semibold text-link hover:text-accent'
			},
			hasArrow: {
				true: 'group/link inline-flex items-center gap-1',
				false: ''
			}
		}
	});

	type Props = OwnProps & SvelteHTMLElements['a'] & VariantProps<typeof link>;

	const {
		variant = 'default',
		hasArrow = false,
		external = false,
		class: className = '',
		href,
		children,
		...rest
	}: Props = $props();

	const linkClasses = $derived(cn(link({ variant, hasArrow }), className));
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
		<span class="transition-transform group-hover/link:translate-x-1">→</span>
	{/if}
</a>
