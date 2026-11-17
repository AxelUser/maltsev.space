<!--
	@component
	Dark overlay with a spinner and a label, for content that is still loading. Place inside a
	`relative` box; fades in and out with `visible`.
-->
<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		visible: boolean;
		label?: string;
	}

	const { visible, label = 'Loading' }: Props = $props();
</script>

<div
	class={cn(
		'pointer-events-none absolute inset-0 z-1 flex items-center justify-center bg-[rgb(5_6_12/0.6)] transition-opacity duration-500',
		visible ? 'opacity-100' : 'opacity-0'
	)}
	aria-hidden="true"
>
	<span class="eyebrow inline-flex items-center gap-2.5 text-white/80">
		<span class="size-3.5 animate-spin rounded-full border-2 border-white/25 border-t-white/85"
		></span>
		{label}
	</span>
</div>
