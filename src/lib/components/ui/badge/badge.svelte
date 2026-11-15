<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface OwnProps {
		class?: string;
	}

	const badge = cva('inline-block rounded-md transition-colors', {
		variants: {
			variant: {
				default: 'border border-brand/30 bg-brand/15 text-fg-2 hover:bg-brand/30 hover:text-fg-1',
				active: 'border border-brand bg-brand text-fg-1',
				subtle: 'bg-surface-2 text-fg-2 hover:bg-surface-3'
			},
			size: {
				small: 'px-1 py-0.5 text-xs',
				medium: 'px-2 py-1 text-base'
			},
			interactive: {
				true: 'cursor-pointer',
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

	const badgeClasses = $derived(cn(badge({ variant, size, interactive }), className));
</script>

<span class={badgeClasses} {...rest}>
	{@render children?.()}
</span>
