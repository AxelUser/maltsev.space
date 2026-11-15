<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Card, Link } from '$lib/components/ui';
	import { HeroPlanet, TagCloud, SEO, PostsGrid } from '$lib/components';
	import { bio } from '$lib/bio';
	import { OneColumnLayout } from '$lib/components/layouts';

	let isVisible = $state(false);

	onMount(() => {
		setTimeout(() => {
			isVisible = true;
		}, 200);
	});

	const { data } = $props();
</script>

<SEO
	title="Home"
	description={`${bio.fullName} - Software Developer at JetBrains focusing on distributed systems and highload applications. Programming since 2014, sharing insights about C#, Go, system design, and performance optimization.`}
	url="/"
	keywords={['portfolio', 'blog', 'software engineering', 'distributed systems']}
/>

<OneColumnLayout>
	<div
		class={[
			'flex min-h-[90vh] flex-col items-center justify-center gap-12 text-center transition-[opacity,transform] duration-1000 ease-[ease]',
			isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
		]}
	>
		<h1 class="space-hero">Howdy, I'm {bio.firstName}</h1>
		<p class="space-tagline">Space is dangerous — use tabs</p>

		<HeroPlanet />

		<div class="mt-5 flex gap-5 max-sm:w-full max-sm:max-w-[200px] max-sm:flex-col">
			<Button href="/blog">Read Blog</Button>
			<Button href="/about" intent="secondary">About Me</Button>
		</div>
	</div>

	<div class="flex flex-col gap-12">
		<section>
			<h2 class="space-heading">Latest Articles</h2>

			<PostsGrid posts={data.posts} />

			<div class="mt-12 text-center">
				<Link href="/blog" hasArrow={true}>View All Posts</Link>
			</div>
		</section>

		<section
			class="grid grid-cols-1 items-start gap-12 md:grid-cols-2 lg:grid-cols-[3fr_2fr] lg:gap-24"
		>
			<div class="flex flex-col gap-5">
				<h2 class="space-heading">About Me</h2>
				<p>
					Software Developer at JetBrains with focus on distributed systems and highload
					applications. Programming since 2014, previously at Infobip, Veeam and SkbKontur.
				</p>
				<Link href="/about" hasArrow={true}>Learn more about me</Link>
			</div>
			<Card>
				<h3 class="mt-0 mb-5 text-lg text-fg-2">Professional Interests:</h3>
				<TagCloud tags={bio.interests} />
			</Card>
		</section>
	</div>
</OneColumnLayout>
