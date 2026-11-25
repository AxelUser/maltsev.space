<!--
	@component
	`<figure>` holding a framed media box, overlays in its corners and a caption below.

	<Figure.Root>
		<Figure.Media>
			<Picture src={image} sizes="…" />
			<Figure.Corner at="top-left"><AiFlag label="AI Generated Image" /></Figure.Corner>
		</Figure.Media>
		<Figure.Caption>…</Figure.Caption>
	</Figure.Root>

	`Figure.Media` is `Frame`; pass `ratio="natural"` for images that keep their own aspect ratio.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		class?: ClassValue;
		children: Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<figure class={cn(className)}>
	{@render children()}
</figure>
