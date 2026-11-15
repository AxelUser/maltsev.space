<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { getPostHeroImage } from '$lib/utils';
	import { Frame } from '$lib/components/ui';
	import PostMeta from './post-meta.svelte';

	const { post }: { post: PostPreview } = $props();
</script>

<a href="/blog/{post.slug}" class="group block no-underline">
	<Frame
		src={getPostHeroImage(post.slug)}
		placeholder={post.placeholder}
		size="sm"
		sizes="(min-width: 1180px) 360px, (min-width: 900px) 30vw, (min-width: 640px) 46vw, 100vw"
	/>
	<div class="mt-3"><PostMeta {post} /></div>
	<h3
		class="mt-2 mb-0 text-[19px]/[1.3] font-medium transition-colors font-stretch-[104%] group-hover:text-link"
	>
		{post.title}
	</h3>
</a>
