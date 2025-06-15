<script lang="ts">
	import { Card, Badge } from '$lib/components/ui';

	interface Props {
		href: string;
		title: string;
		description: string;
		date?: string;
		image?: string;
		imageAlt?: string;
		tags?: string[];
		activeTag?: string;
		onTagClick?: (tag: string) => void;
		metadata?: string;
	}

	const {
		href,
		title,
		description,
		date,
		image,
		imageAlt,
		tags,
		activeTag,
		onTagClick,
		metadata
	}: Props = $props();
</script>

<a {href} class="content-card-link">
	<Card variant="neon" class="content-card" clickable={true}>
		{#if image}
			<div class="card-image">
				<img src={image} alt={imageAlt || title} loading="lazy" />
			</div>
		{/if}

		<div class="card-content">
			{#if date}
				<span class="card-date">{date}</span>
			{/if}

			<h3 class="card-title">{title}</h3>
			<p class="card-description">{description}</p>

			{#if metadata}
				<div class="card-metadata">
					<span class="metadata-text">{metadata}</span>
				</div>
			{/if}

			{#if tags && tags.length > 0}
				<div class="card-tags">
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
	.content-card-link {
		text-decoration: none;
		display: block;
		height: 100%;
	}

	.content-card {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.card-image {
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: var(--radius-2) var(--radius-2) 0 0;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--transition-fast);
	}

	.content-card:hover .card-image img {
		transform: scale(1.05);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 250px;
		padding: var(--gap);
	}

	.card-date {
		font-size: var(--font-size-0);
		color: var(--accent);
		margin-bottom: var(--gap-small);
	}

	.card-title {
		font-size: var(--font-size-4);
		margin: 0;
		margin-bottom: var(--gap-small);
		color: var(--text-1);
		min-height: 2.8em;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-description {
		color: var(--text-2);
		margin-bottom: var(--gap);
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
		min-height: 4em;
	}

	.card-metadata {
		margin-bottom: var(--gap-small);
	}

	.metadata-text {
		color: var(--text-2);
		font-size: var(--font-size-0);
		font-weight: var(--font-weight-4);
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: var(--gap-small);
	}

	@media (--sm-n-below) {
		.card-content {
			min-height: 220px;
			padding: var(--gap-small);
		}

		.card-title {
			font-size: var(--font-size-3);
			min-height: 2.5em;
		}

		.card-description {
			font-size: calc(var(--font-size-2) * var(--font-scale-sm));
			min-height: 3em;
			max-height: 4.5em;
		}
	}

	@media (--xs-n-below) {
		.card-content {
			min-height: 200px;
		}

		.card-title {
			font-size: var(--font-size-2);
			min-height: 2em;
		}

		.card-description {
			font-size: calc(var(--font-size-1) * var(--font-scale-xs));
			min-height: 2.5em;
			max-height: 4em;
		}
	}
</style>
