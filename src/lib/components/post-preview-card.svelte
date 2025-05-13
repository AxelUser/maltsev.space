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
	<Card variant="neon" class="post-card">
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
		min-height: 300px;
	}

	.post-date {
		font-size: var(--font-size-0);
		color: var(--accent);
		margin-bottom: var(--gap-small);
	}

	.post-title {
		font-size: var(--font-size-4);
		margin: 0;
		margin-bottom: var(--gap-small);
		color: var(--text-1);
		min-height: 4em;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		max-height: 2.8em;
	}

	.post-excerpt {
		color: var(--text-2);
		margin-bottom: var(--gap);
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
		min-height: 6em;
		max-height: 9em;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: var(--gap-small);
	}
</style>
