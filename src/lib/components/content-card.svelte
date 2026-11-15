<script lang="ts">
	import { Card, Badge } from '$lib/components/ui';
	import type { EnhancedImageSrc } from '$lib/utils';

	interface Props {
		href: string;
		title: string;
		description: string;
		date?: string;
		/** Cover image shown faded behind the card content. */
		image?: EnhancedImageSrc;
		placeholder?: string;
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
		placeholder,
		tags,
		activeTag,
		onTagClick,
		metadata
	}: Props = $props();
</script>

<a {href} class="block h-full no-underline">
	<Card variant="neon" class="h-full" contentClass="h-full" coverImage={image} {placeholder}>
		<div class="flex h-full min-h-[250px] flex-col">
			{#if date}
				<span class="mb-2 text-xs text-accent">{date}</span>
			{/if}

			<h3
				class="m-0 mb-2 block min-h-[2.8em] overflow-hidden text-2xl leading-tight text-ellipsis text-fg-1"
			>
				{title}
			</h3>
			<p class="mb-5 block min-h-[4em] grow overflow-hidden text-lg/normal text-ellipsis text-fg-2">
				{description}
			</p>

			{#if metadata}
				<span class="mb-2 text-xs text-fg-2">{metadata}</span>
			{/if}

			{#if tags && tags.length > 0}
				<div class="mt-auto flex flex-wrap gap-2 pt-2">
					{#each tags as tag (tag)}
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
