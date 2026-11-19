<!--
	@component
	HUD corner brackets around a clipped, `relative` box for any content. The box is 3:2 unless
	`ratio="natural"`, which lets the content set its height.

	<Frame><Picture src={hero} sizes="480px" /></Frame>
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';

	interface Props {
		size?: 'sm' | 'md';
		ratio?: '3/2' | 'natural';
		class?: ClassValue;
		children?: Snippet;
	}

	const { size = 'md', ratio = '3/2', class: className, children }: Props = $props();
</script>

<div class={cn('hud', size === 'sm' ? 'p-2' : 'p-2.5', className)}>
	<div
		class={cn(
			'relative overflow-hidden bg-surface shadow-frame',
			ratio === '3/2' && 'aspect-[3/2]'
		)}
	>
		{@render children?.()}
	</div>
</div>
