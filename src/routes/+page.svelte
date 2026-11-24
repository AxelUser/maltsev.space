<script lang="ts">
	import { SEO } from '$lib/components';
	import { Container } from '$lib/components/layout';
	import { SectionHeading } from '$lib/components/ui';
	import { Hero, DestinationCard } from '$lib/components/home';
	import { PostFeature, PostRows } from '$lib/components/posts';
	import { bio, getAllCollections } from '$lib/content';
	import { getArtImage } from '$lib/utils/art-image';
	import avatar from '/static/images/ava.jpg?enhanced';

	const { data } = $props();

	const [featured, ...recent] = $derived(data.latest);

	const artCover = (() => {
		const visual = getAllCollections().find((c) => c.kind === 'visual');
		return visual && getArtImage(visual.id, visual.images[0]);
	})();
</script>

<SEO
	title="Home"
	description={`${bio.fullName} - Software Developer at JetBrains focusing on distributed systems and highload applications. Programming since 2014, sharing insights about C#, Go, system design, and performance optimization.`}
	url="/"
	keywords={['portfolio', 'blog', 'software engineering', 'distributed systems']}
/>

<Hero />

{#if featured}
	<Container as="section" class="pt-10 pb-[72px]">
		<SectionHeading title="Latest note" aside="All {data.total} notes →" href="/blog" />
		<div class="contents" data-ph-capture-attribute-nav="home-latest">
			<PostFeature post={featured} />
			<PostRows posts={recent} class="mt-10" />
		</div>
	</Container>
{/if}

<Container as="section" class="grid gap-5 pb-24 md:grid-cols-2">
	<DestinationCard
		href="/about"
		image={avatar}
		round
		kicker="About"
		title={bio.fullName}
		text="Career, stack, and how to reach me."
	/>
	{#if artCover}
		<DestinationCard
			href="/misc"
			image={artCover}
			kicker="Misc"
			title="Things I make"
			text="Pictures and music."
		/>
	{/if}
</Container>
