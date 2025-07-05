<script lang="ts">
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
	console.log('placeholderBase64', placeholderBase64);
</script>

<div class="hero-background-container">
	{#if heroImage}
		<enhanced:img
			src={heroImage}
			alt="{title} hero image"
			loading="lazy"
			class="hero-background-image"
			sizes="min(1536px, 100vw)"
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
		width: 100%;
		padding: var(--gap-large) 0;
		margin-bottom: var(--gap);
		color: var(--text-on-dark-bg, white);
	}

	.hero-background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.3;
		z-index: -1;
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
		.hero-content hgroup {
			text-align: center;
		}

		.post-meta {
			justify-content: center;
		}
	}
</style>
