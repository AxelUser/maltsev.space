<script lang="ts">
	import { Card, Badge } from '$lib/components/ui';

	interface Props {
		href: string;
		title: string;
		description: string;
		date?: string;
		image?: string;
		imageAlt?: string;
		imageDisplayMode?: 'cover' | 'top';
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
		imageAlt,
		imageDisplayMode = 'top',
		placeholder: placeholderBase64,
		tags,
		activeTag,
		onTagClick,
		metadata
	}: Props = $props();

	let imageLoaded = $state(false);

	$effect(() => {
		if (!placeholderBase64) {
			imageLoaded = true;
		} else {
			imageLoaded = false;
		}
	});

	function handleImageLoad() {
		imageLoaded = true;
	}

	function handleImageError() {
		imageLoaded = false;
	}
</script>

<a {href} class="block h-full no-underline">
	<Card
		variant="neon"
		clickable={true}
		coverImage={imageDisplayMode === 'cover' ? image : undefined}
		placeholder={imageDisplayMode === 'cover' ? placeholderBase64 : undefined}
	>
		{#if image && imageDisplayMode === 'top'}
			<div class="relative aspect-video overflow-hidden rounded-t-md">
				{#if placeholderBase64}
					<img
						src={placeholderBase64}
						alt={imageAlt || title}
						class={[
							'absolute inset-0 z-1 size-full object-cover transition-transform [--pulse-max:0.8] [--pulse-min:0.6]',
							imageLoaded ? 'opacity-0' : 'animate-placeholder-pulse'
						]}
					/>
				{/if}
				<enhanced:img
					src={image}
					alt={imageAlt || title}
					loading="lazy"
					sizes="min(800px, 50vw)"
					class="size-full object-cover transition-[opacity,transform] duration-300 ease-in-out {imageLoaded
						? 'opacity-100'
						: 'opacity-0'}"
					onload={handleImageLoad}
					onerror={handleImageError}
				/>
			</div>
		{/if}

		<div class="flex h-full min-h-[250px] flex-col p-5">
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
				<div class="mb-2">
					<span class="text-xs font-normal text-fg-2">{metadata}</span>
				</div>
			{/if}

			{#if tags && tags.length > 0}
				<div class="mt-auto flex flex-wrap gap-2 pt-2">
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
