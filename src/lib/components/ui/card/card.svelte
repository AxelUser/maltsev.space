<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { cn } from '$lib/utils';

	const card = cva(
		'relative block overflow-hidden rounded-2xl border border-surface-3 bg-surface-2 p-5 text-fg-1 no-underline transition-colors',
		{
			variants: {
				variant: {
					default: 'shadow-lg',
					neon: 'group/card z-1 border-none hover:bg-surface-3'
				},
				clickable: {
					true: 'cursor-pointer',
					false: ''
				}
			}
		}
	);

	const coverImageClass = 'absolute inset-0 size-full object-cover';

	type Props = SvelteHTMLElements['div'] &
		VariantProps<typeof card> & {
			coverImage?: string;
			placeholder?: string;
			/** Extra classes for the inner content wrapper. */
			contentClass?: string;
		};

	const {
		variant = 'default',
		clickable = false,
		coverImage,
		placeholder: placeholderBase64,
		class: className = '',
		contentClass,
		children,
		...rest
	}: Props = $props();

	const cardClasses = $derived(cn(card({ variant, clickable }), className));

	let imageLoaded = $state(false);

	$effect(() => {
		if (!placeholderBase64) {
			imageLoaded = true;
		} else {
			imageLoaded = false;
		}
	});

	function handleImageLoad() {
		imageLoaded = true;
	}

	function handleImageError() {
		imageLoaded = false;
	}
</script>

<div class={cardClasses} {...rest}>
	{#if coverImage}
		{#if placeholderBase64}
			<!-- svelte-ignore a11y_missing_attribute -->
			<img
				src={placeholderBase64}
				class={[
					coverImageClass,
					'-z-1 [--pulse-max:0.2] [--pulse-min:0.1]',
					imageLoaded ? 'opacity-0' : 'animate-placeholder-pulse opacity-20'
				]}
			/>
		{/if}
		<!-- svelte-ignore a11y_missing_attribute -->
		<enhanced:img
			src={coverImage}
			loading="lazy"
			class="{coverImageClass} z-0 transition-opacity duration-300 ease-in-out {imageLoaded
				? 'opacity-20'
				: 'opacity-0'}"
			sizes="min(800px, 30vw)"
			onload={handleImageLoad}
			onerror={handleImageError}
		/>
	{/if}
	<div class={cn('relative z-1', contentClass)}>
		{@render children?.()}
	</div>
	{#if variant === 'neon'}
		<div
			class="pointer-events-none absolute inset-0 -z-999 rounded-2xl opacity-0 transition-opacity duration-300 ease-[ease] group-hover/card:opacity-100 before:absolute before:inset-0 before:-z-1 before:rounded-2xl before:bg-[linear-gradient(45deg,var(--accent),var(--star),var(--nebula),var(--accent))] before:bg-size-[400%_400%] before:p-0.5 group-hover/card:before:animate-gradient-shift after:absolute after:inset-0.5 after:z-1 after:rounded-[calc(1rem-2px)] after:bg-surface-3"
		></div>
	{/if}
</div>
