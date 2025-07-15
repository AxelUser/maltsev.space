<script lang="ts">
	import HeroPlanet from './hero-planet.svelte';

	type Props = {
		title: string;
		date: string;
		preview: string;
		author: string;
		heroImage: any;
		placeholder?: string;
	};

	const {
		title,
		date,
		preview,
		author,
		heroImage,
		placeholder: placeholderBase64
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

<div class="hero-background-container">
	{#if heroImage}
		<img
			src={placeholderBase64}
			alt="{title} hero image placeholder"
			class="hero-image hero-placeholder-image"
			class:loaded={imageLoaded}
		/>
		<enhanced:img
			src={heroImage}
			alt="{title} hero image"
			loading="lazy"
			class="hero-image hero-background-image"
			class:loaded={imageLoaded}
			sizes="min(1536px, 100vw)"
			onload={handleImageLoad}
			onerror={handleImageError}
		/>
	{/if}
	<div class="hero-content">
		<hgroup>
			<div class="post-meta">
				<time datetime="2024-06-15" class="publish-date">{date}</time>
				<span class="meta-separator">•</span>
				<span class="author-name">by {author}</span>
			</div>
			<h1 class="space-title">{title}</h1>
			{#if preview}
				<p class="post-preview">{preview}</p>
			{/if}
		</hgroup>
	</div>
</div>

<style>
	@import 'open-props/media';

	.hero-background-container {
		position: relative;
		max-width: var(--content-width);
		padding: var(--gap-large) 0;
		margin: 0 auto var(--gap);
		color: var(--text-on-dark-bg, white);
	}

	.hero-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-background-image {
		opacity: 0;
		z-index: -1;
		transition: opacity 0.3s ease-in-out;
	}

	.hero-background-image.loaded {
		opacity: 0.3;
	}

	.hero-placeholder-image {
		opacity: 0.3;
		z-index: -2;
		animation: pulse 2s ease-in-out infinite;
	}

	.hero-placeholder-image.loaded {
		opacity: 0;
		animation: none;
	}

	@keyframes pulse {
		0% {
			opacity: 0.2;
		}
		50% {
			opacity: 0.4;
		}
		100% {
			opacity: 0.2;
		}
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: var(--max-width-prose, 70ch);
		margin: 0 auto;
		padding: 0;
	}

	.hero-content hgroup {
		margin-bottom: 0;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: var(--gap-small);
		margin-bottom: var(--gap);
		font-size: var(--font-size-1);
		color: var(--text-2);
		font-weight: var(--font-weight-5);
	}

	.publish-date {
		color: inherit;
	}

	.meta-separator {
		color: var(--text-3);
		opacity: 0.6;
	}

	.author-name {
		color: inherit;
		opacity: 0.9;
	}

	.post-preview {
		font-size: var(--font-size-2);
		color: var(--text-2);
		font-style: italic;
		line-height: 1.6;
		margin-top: var(--gap);
		display: block;
	}

	@media (--md-n-below) {
		.hero-background-container {
			max-width: none;
		}

		.hero-content hgroup {
			text-align: center;
		}

		.post-meta {
			justify-content: center;
		}

		.post-preview {
			padding-left: var(--gap);
			padding-right: var(--gap);
		}
	}
</style>
