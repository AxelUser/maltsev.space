<script lang="ts">
	import { Button, Link } from '$lib/components/ui';
	import { PostsGrid } from '$lib/components';
	import { OneColumnLayout } from '$lib/components/layouts';
	import { getPosts } from '$lib/posts';

	import { page } from '$app/state';

	let recommendedPosts = $state(getPosts(2));
</script>

<svelte:head>
	<title>Oops! Lost in Space</title>
</svelte:head>

<OneColumnLayout>
	<div class="error-container">
		<h1>Error {page.status}</h1>
		<p class="error-message">Oops! We've drifted into unknown space coordinates!</p>

		<div class="cta-buttons">
			<Button href="/">Go Home</Button>
			<Button href="/blog" intent="secondary">Read Blog</Button>
		</div>
	</div>

	<div class="recommendations">
		<section>
			<h2 class="space-heading">While You're Here...</h2>

			<PostsGrid posts={recommendedPosts} />

			<div class="view-all">
				<Link href="/blog" hasArrow={true}>View All Posts</Link>
			</div>
		</section>
	</div>
</OneColumnLayout>

<style lang="postcss">
	@import 'open-props/media';

	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-height: 40vh;
		gap: var(--gap-large);

		h1 {
			margin: 0;
			font-size: var(--font-size-8);
			background: linear-gradient(90deg, var(--brand), var(--accent));
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			text-shadow: 0 0 20px color-mix(in srgb, var(--brand) 50%, transparent);
		}
	}

	.error-message {
		font-size: var(--font-size-4);
		font-weight: 600;
		color: var(--accent);
		text-shadow: 0 0 15px color-mix(in srgb, var(--accent) 30%, transparent);
		letter-spacing: 0.02em;
		padding: 0.5em;
		border: 2px solid var(--accent);
		border-radius: var(--radius-base);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
	}

	.cta-buttons {
		display: flex;
		gap: var(--gap);
		margin-top: var(--gap);
	}

	.recommendations {
		margin-top: var(--gap-large);
	}

	.view-all {
		margin-top: var(--gap-large);
		text-align: center;
	}

	@media (--sm-n-below) {
		.cta-buttons {
			flex-direction: column;
			width: 100%;
			max-width: 200px;
		}

		.error-message {
			font-size: var(--font-size-3);
			padding: 0.4em;
		}
	}

	@media (--xs-n-below) {
		.error-message {
			font-size: var(--font-size-2);
			border-width: 1px;
			padding: 0.3em;
		}

		.error-container h1 {
			font-size: var(--font-size-7);
		}

		.error-details {
			padding: var(--gap-small);
		}
	}
</style>
