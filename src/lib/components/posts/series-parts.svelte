<script lang="ts">
	import type { PostPreview } from '$lib/types';

	interface Props {
		name: string;
		posts: PostPreview[];
		current: string;
	}

	const { name, posts, current }: Props = $props();
</script>

{#if posts.length > 1}
	<nav class="hud my-10 p-5 sm:p-6" aria-label="Series: {name}">
		<span class="eyebrow">Series · {name}</span>
		<ol class="m-0 mt-3 list-none p-0">
			{#each posts as post, i (post.slug)}
				{@const isCurrent = post.slug === current}
				<li class="grid grid-cols-[36px_1fr] items-baseline gap-2 py-1.5">
					<span class={['font-mono text-[13px]', isCurrent ? 'text-livery-1' : 'text-ink-3']}>
						{String(i + 1).padStart(2, '0')}
					</span>
					{#if isCurrent}
						<span class="font-display text-[16px] font-semibold" aria-current="page">
							{post.title}
						</span>
					{:else}
						<a
							href="/blog/{post.slug}"
							class="font-display text-[16px] font-medium text-ink-2 no-underline hover:text-link"
						>
							{post.title}
						</a>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}
