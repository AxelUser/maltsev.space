<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { cn, getPostHeroImage } from '$lib/utils';
	import { Frame, HoverZoom, Picture } from '$lib/components/ui';
	import PostMeta from './post-meta.svelte';

	const { post }: { post: PostPreview } = $props();
</script>

<HoverZoom.Area>
	{#snippet child({ props })}
		<a href="/blog/{post.slug}" class={cn(props.class, 'group block no-underline')}>
			<Frame size="sm">
				<HoverZoom.Target>
					{#snippet child({ props: zoom })}
						<Picture
							{...zoom}
							src={getPostHeroImage(post.slug)}
							placeholder={post.placeholder}
							sizes="(min-width: 900px) 360px, (min-width: 640px) 50vw, 85vw"
						/>
					{/snippet}
				</HoverZoom.Target>
			</Frame>
			<div class="mt-3"><PostMeta {post} /></div>
			<h3
				class="mt-2 mb-0 text-[19px]/[1.3] font-medium transition-colors font-stretch-[104%] group-hover:text-link"
			>
				{post.title}
			</h3>
		</a>
	{/snippet}
</HoverZoom.Area>
