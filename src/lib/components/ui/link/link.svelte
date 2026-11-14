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
				default: 'font-semibold text-link hover:text-accent',
				subtle: 'text-fg-2 hover:text-fg-1',
				nav: 'font-semibold text-fg-1 hover:text-accent'
			},
			hasArrow: {
				true: 'group/link inline-flex items-center gap-1',
				false: ''
			},
			underlined: {
				true: 'underline hover:no-underline',
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

	const linkClasses = $derived(cn(link({ variant, hasArrow, underlined }), className));
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
