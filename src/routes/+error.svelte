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
	<div class="flex min-h-[40vh] flex-col items-center justify-center gap-12 text-center">
		<h1
			class="m-0 text-5xl leading-tight xs:text-[3.5rem] bg-linear-90/srgb from-brand to-accent bg-clip-text text-transparent [text-shadow:0_0_20px_color-mix(in_srgb,var(--brand)_50%,transparent)]"
		>
			Error {page.status}
		</h1>
		<p
			class="border-2 border-accent bg-accent/10 p-[0.3em] text-lg leading-normal font-semibold tracking-[0.02em] text-accent max-xs:border xs:p-[0.4em] xs:text-xl sm:p-[0.5em] sm:text-2xl [text-shadow:0_0_15px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
		>
			Oops! We've drifted into unknown space coordinates!
		</p>

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
