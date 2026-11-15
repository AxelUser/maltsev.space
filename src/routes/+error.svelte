<script lang="ts">
	import { Button, Link } from '$lib/components/ui';
	import { PostsGrid } from '$lib/components';
	import { OneColumnLayout } from '$lib/components/layouts';
	import { getPosts } from '$lib/posts';

	import { page } from '$app/state';

	const recommendedPosts = getPosts(2);
</script>

<svelte:head>
	<title>Oops! Lost in Space</title>
</svelte:head>

<OneColumnLayout>
	<div class="flex min-h-[40vh] flex-col items-center justify-center gap-12 text-center">
		<h1 class="space-hero">Error {page.status}</h1>
		<p class="space-tagline">Oops! We've drifted into unknown space coordinates!</p>

		<div class="mt-5 flex gap-5 max-sm:w-full max-sm:max-w-[200px] max-sm:flex-col">
			<Button href="/">Go Home</Button>
			<Button href="/blog" intent="secondary">Read Blog</Button>
		</div>
	</div>

	<div class="mt-12">
		<section>
			<h2 class="space-heading">While You're Here...</h2>

			<PostsGrid posts={recommendedPosts} />

			<div class="mt-12 text-center">
				<Link href="/blog" hasArrow={true}>View All Posts</Link>
			</div>
		</section>
	</div>
</OneColumnLayout>
