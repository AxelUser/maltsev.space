<!--
	@component
	Image for use inside markdown posts. `ai` adds an "AI Generated Image" flag on the image; pass a string to name the tool, e.g. `ai="Stable Diffusion"`.

	<Figure src="/images/posts/<slug>/diagram.png" alt="…" caption="…" ai />
-->
<script lang="ts">
	import { aiLabel } from '$lib/utils';
	import { AiFlag } from '$lib/components/ui';

	interface Props {
		src: string;
		alt: string;
		caption?: string;
		ai?: boolean | string;
	}

	const { src, alt, caption, ai = false }: Props = $props();

	const label = $derived(aiLabel(ai));
</script>

<figure class="hud my-8 block place-items-stretch p-2.5">
	<div class="relative">
		<img {src} {alt} loading="lazy" decoding="async" class="m-0 block h-auto w-full shadow-frame" />
		{#if label}<AiFlag {label} />{/if}
	</div>
	{#if caption}
		<figcaption class="eyebrow mt-1.5 text-right">{caption}</figcaption>
	{/if}
</figure>
