<script lang="ts">
	import { Card, Badge } from '$lib/components/ui';

	interface Props {
		slug: string;
		date: string;
		title: string;
		preview: string;
		tags?: string[];
		activeTag?: string;
		onTagClick?: (tag: string) => void;
	}

	const { slug, date, title, preview, tags, activeTag, onTagClick }: Props = $props();
</script>

<a href={`/blog/${slug}`} class="post-card-link">
	<Card variant="elevated" class="post-card">
		<div class="post-content">
			<span class="post-date">{date}</span>
			<h3 class="post-title">{title}</h3>
			<p class="post-excerpt">{preview}</p>

			{#if tags && tags.length > 0}
				<div class="post-tags">
					{#each tags as tag}
						<Badge
							variant={activeTag === tag ? 'active' : 'subtle'}
							size="small"
							interactive={!!onTagClick}
							onclick={(e) => {
								if (onTagClick) {
									e.preventDefault();
									onTagClick(tag);
								}
							}}
						>
							{tag}
						</Badge>
					{/each}
				</div>
			{/if}
		</div>
	</Card>
</a>

<style>
	.post-card-link {
		text-decoration: none;
		display: block;
		height: 100%;
	}

	.post-content {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.post-date {
		font-size: var(--font-size-0);
		color: var(--accent);
		margin-bottom: var(--gap-small);
	}

	.post-title {
		font-size: var(--font-size-3);
		margin: 0;
		margin-bottom: var(--gap-small);
		color: var(--text-1);
		/* Ensure consistent height for titles */
		min-height: 2.5em;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.post-excerpt {
		color: var(--text-2);
		margin-bottom: var(--gap);
		flex-grow: 1;
		/* Ensure consistent height for excerpts */
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: auto;
	}
</style>
