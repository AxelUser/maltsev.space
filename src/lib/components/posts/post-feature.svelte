<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { cn, getPostHeroImage } from '$lib/utils';
	import { Frame, HoverZoom, Picture, Tag } from '$lib/components/ui';

	const { post }: { post: PostPreview } = $props();
</script>

<HoverZoom.Area>
	{#snippet child({ props })}
		<a
			href="/blog/{post.slug}"
			class={cn(
				props.class,
				'group grid items-center gap-5 no-underline lg:grid-cols-[1.15fr_1fr] lg:gap-12'
			)}
		>
			<Frame>
				<HoverZoom.Target>
					{#snippet child({ props: zoom })}
						<Picture
							{...zoom}
							src={getPostHeroImage(post.slug)}
							placeholder={post.placeholder}
							sizes="(min-width: 900px) 560px, 85vw"
						/>
					{/snippet}
				</HoverZoom.Target>
			</Frame>
			<div>
				<span class="eyebrow">{post.number} · {post.date}</span>
				<h3
					class="mt-3.5 mb-0 text-[clamp(26px,3vw,36px)]/[1.12] font-semibold tracking-[-0.01em] transition-colors font-stretch-[106%] group-hover:text-link"
				>
					{post.title}
				</h3>
				<p class="mt-4 mb-0 text-ink-2">{post.preview}</p>
				<div class="mt-5 flex flex-wrap gap-2">
					{#each post.tags as tag (tag)}
						<Tag {tag} />
					{/each}
				</div>
				<span class="mt-6 inline-block font-display text-[15px] font-semibold text-link">
					Read the note →
				</span>
			</div>
		</a>
	{/snippet}
</HoverZoom.Area>
