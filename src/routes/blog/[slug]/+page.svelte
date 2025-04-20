<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<article>
	<hgroup>
		<h1 class="space-title">{data.title}</h1>
		<p>
			<span>Published at <time datetime="2024-06-15">{data.date}</time></span>
		</p>
	</hgroup>

	<div class="prose">
		{@render data.content()}
	</div>

	<footer class="post-footer">
		<div class="post-navigation">
			<a href="/blog" class="back-to-blog">← Back to all posts</a>
		</div>

		<div class="share-post">
			<span>Share this post:</span>
			<div class="share-links">
				<a
					href={`https://twitter.com/intent/tweet?text=`}
					target="_blank"
					rel="noopener noreferrer"
					class="share-link twitter">Twitter</a
				>
				<a
					href={`https://www.linkedin.com/shareArticle?mini=true&url=`}
					target="_blank"
					rel="noopener noreferrer"
					class="share-link linkedin">LinkedIn</a
				>
			</div>
		</div>
	</footer>
</article>

<style>
	article {
		margin: 0 auto;
		padding-bottom: var(--gap-large);
	}

	h1 {
		max-inline-size: none;
	}

	hgroup {
		margin-bottom: var(--gap);
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
	}

	hgroup p {
		display: flex;
		gap: var(--gap);
		font-size: var(--font-size-1);
		color: var(--space-text-muted);
		margin-bottom: var(--gap-small);
	}

	/* Post footer */
	.post-footer {
		margin-top: var(--gap-large);
		padding-top: var(--gap);
		border-top: 1px solid color-mix(in srgb, var(--brand) 20%, transparent);
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	.post-navigation {
		display: flex;
		justify-content: space-between;
	}

	.back-to-blog {
		color: var(--space-primary-light);
		text-decoration: none;
		transition: color var(--space-transition-fast);
	}

	.back-to-blog:hover {
		color: var(--space-accent);
	}

	.share-post {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-gap);
		margin-top: var(--space-gap);
	}

	.share-post span {
		color: var(--space-text-muted);
		font-size: var(--font-size-1);
	}

	.share-links {
		display: flex;
		gap: var(--space-gap-small);
	}

	.share-link {
		display: inline-block;
		padding: var(--space-gap-small);
		background-color: var(--space-bg-light);
		border-radius: var(--space-radius-sm);
		color: var(--space-text-light);
		text-decoration: none;
		font-size: var(--font-size-1);
		transition: all var(--space-transition-fast);
	}

	.share-link:hover {
		background-color: var(--space-primary);
		color: var(--space-text);
		transform: translateY(-2px);
	}
</style>
