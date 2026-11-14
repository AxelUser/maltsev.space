<script lang="ts">
	import type { PostPreview } from '$lib/types';

	interface Props {
		posts: PostPreview[];
	}

	const { posts }: Props = $props();
</script>

{#if posts.length > 0}
	<div class="mb-12 rounded-md border border-brand/20 bg-surface-2 p-2 md:p-5">
		<div
			class="m-0 mb-5 flex items-center gap-2 text-lg font-semibold text-fg-1 before:text-lg before:content-['📚'] md:text-xl"
		>
			More from this series
		</div>
		<ol class="list-none pl-0 [counter-reset:series-counter]">
			{#each posts as post}
				<li
					class="relative m-0 flex items-start pl-5 [counter-increment:series-counter] before:absolute before:top-1/2 before:left-0 before:min-w-5 before:-translate-y-1/2 before:text-left before:font-medium before:text-fg-2 before:content-[counter(series-counter)_'.']"
				>
					<a
						href={`/blog/${post.slug}`}
						class="inline-block py-2 font-medium text-link no-underline transition-colors hover:text-accent"
						>{post.title}</a
					>
				</li>
			{/each}
		</ol>
	</div>
{/if}
