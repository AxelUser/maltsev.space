<script lang="ts">
	import type { PostPreview } from '$lib/types';

	interface Props {
		posts: PostPreview[];
	}

	const { posts }: Props = $props();
</script>

{#if posts.length > 0}
	<div class="series-banner">
		<div class="series-title">More from this series</div>
		<ol class="series-list">
			{#each posts as post}
				<li class="series-item">
					<a href={`/blog/${post.slug}`} class="series-link">{post.title}</a>
				</li>
			{/each}
		</ol>
	</div>
{/if}

<style>
	@import 'open-props/media';

	.series-banner {
		background-color: var(--surface-2);
		border: 1px solid color-mix(in srgb, var(--brand) 20%, transparent);
		border-radius: var(--radius-2);
		padding: var(--gap);
		margin-bottom: var(--gap-large);
	}

	.series-title {
		font-size: var(--font-size-3);
		font-weight: var(--font-weight-6);
		color: var(--text-1);
		margin: 0 0 var(--gap) 0;
		display: flex;
		align-items: center;
		gap: var(--gap-small);
	}

	.series-title::before {
		content: '📚';
		font-size: var(--font-size-2);
	}

	.series-list {
		list-style: none;
		padding-left: 0;
		counter-reset: series-counter;
	}

	.series-item {
		margin: 0;
		display: flex;
		align-items: flex-start;
		counter-increment: series-counter;
		padding-left: var(--gap);
		position: relative;
	}

	.series-item::before {
		content: counter(series-counter) '.';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		font-weight: var(--font-weight-5);
		color: var(--text-2);
		min-width: var(--gap);
		text-align: left;
	}

	.series-link {
		color: var(--link);
		text-decoration: none;
		font-weight: var(--font-weight-5);
		transition: color var(--transition-fast);
		display: inline-block;
		padding: var(--gap-small) 0;
	}

	.series-link:hover {
		color: var(--accent);
	}

	@media (--md-n-below) {
		.series-banner {
			padding: var(--gap-small);
		}

		.series-title {
			font-size: var(--font-size-2);
		}
	}
</style>
