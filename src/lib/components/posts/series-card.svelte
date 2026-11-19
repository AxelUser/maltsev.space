<!--
	@component
	`posts` must be in reading order (oldest first).
-->
<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { seriesDescription } from '$lib/content';
	import { getPostHeroImage } from '$lib/utils';
	import { HudBox, Picture } from '$lib/components/ui';

	interface Props {
		name: string;
		posts: PostPreview[];
	}

	const { name, posts }: Props = $props();
	const description = $derived(seriesDescription(name));
</script>

{#if posts.length > 0}
	<HudBox
		href="/blog/{posts[0].slug}"
		accent="var(--color-livery-4)"
		class="grid items-center gap-3.5 p-[22px] md:grid-cols-[auto_1fr_auto] md:gap-7"
	>
		<span class="flex" aria-hidden="true">
			{#each posts as post, i (post.slug)}
				<Picture
					src={getPostHeroImage(post.slug)}
					sizes="96px"
					class={[
						'aspect-[3/2] h-auto w-24 shrink-0 bg-surface shadow-frame outline-[3px] outline-canvas',
						i > 0 && '-ml-9'
					]}
				/>
			{/each}
		</span>
		<div>
			<span class="eyebrow">Series · {posts.length} parts</span>
			<h3 class="mt-1 mb-0.5 text-[22px] font-semibold font-stretch-[108%]">{name}</h3>
			{#if description}
				<p class="m-0 text-[15px] text-ink-2">{description}</p>
			{/if}
		</div>
		<span class="font-display text-[15px] font-semibold text-link">Start reading →</span>
	</HudBox>
{/if}
