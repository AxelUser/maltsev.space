<!--
	@component
	HUD corner brackets around a 3:2 clipped box. Purely decorative: put any content inside
	(a `Picture`, a live cover, an `AiFlag`, which is positioned against the clipped box).

	<Frame><Picture src={hero} /></Frame>
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';

	interface Props {
		size?: 'sm' | 'md';
		class?: ClassValue;
		children?: Snippet;
	}

	const { size = 'md', class: className, children }: Props = $props();
</script>

<div class={cn('hud', size === 'sm' ? 'p-2' : 'p-2.5', className)}>
	<div class="relative aspect-[3/2] overflow-hidden bg-surface shadow-frame">
		{@render children?.()}
	</div>
</div>
