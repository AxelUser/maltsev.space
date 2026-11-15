<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { getPostHeroImage } from '$lib/utils';
	import { Thumb } from '$lib/components/ui';
	import PostMeta from './post-meta.svelte';

	const { post }: { post: PostPreview } = $props();
</script>

<a
	href="/blog/{post.slug}"
	class="group grid grid-cols-[88px_1fr] items-center gap-3.5 py-4 no-underline sm:grid-cols-[120px_1fr_auto] sm:gap-6"
>
	<Thumb src={getPostHeroImage(post.slug)} class="w-[88px] sm:w-[120px]" />
	<span>
		<span
			class="block font-display text-[16.5px]/[1.3] font-medium transition-colors font-stretch-[104%] group-hover:text-link sm:text-[19px]"
		>
			{post.title}
		</span>
		<span class="mt-1.5 block"><PostMeta {post} /></span>
	</span>
	<span
		class="font-display text-[18px] font-medium text-ink-3 transition-[color,transform] group-hover:translate-x-1 group-hover:text-link max-sm:hidden"
		aria-hidden="true">→</span
	>
</a>
