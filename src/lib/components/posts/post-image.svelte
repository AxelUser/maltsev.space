<!--
	@component
	Image inside a markdown post, framed and sized to the article column. `src` is the public URL of
	a file in `/static/images/posts/<slug>/`. `ai` adds an "AI Generated Image" flag; pass a string
	to name the tool, e.g. `ai="Stable Diffusion"`.

	<script>
		import { PostImage } from '$lib/components';
	</script>

	<PostImage src="/images/posts/<slug>/diagram.png" alt="…" caption="…" ai />
-->
<script lang="ts">
	import { getPostImage } from '$lib/utils/post-image';
	import { AiFlag, Figure, Picture } from '$lib/components/ui';

	interface Props {
		src: string;
		alt: string;
		caption?: string;
		ai?: boolean | string;
	}

	const { src, alt, caption, ai = false }: Props = $props();

	const image = $derived(getPostImage(src));
</script>

<Figure.Root class="block">
	<Figure.Media ratio="natural">
		<Picture src={image} {alt} sizes="min(720px, 100vw)" class="m-0" />
		{#if ai}
			<Figure.Corner at="bottom-left">
				<AiFlag tool={typeof ai === 'string' ? ai : undefined} />
			</Figure.Corner>
		{/if}
	</Figure.Media>
	{#if caption}
		<Figure.Caption>{caption}</Figure.Caption>
	{/if}
</Figure.Root>
