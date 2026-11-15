<script lang="ts">
	import { Button, Badge, Card } from '$lib/components/ui';
	import { PageHeader, PostsGrid, SEO } from '$lib/components';
	import { bio } from '$lib/bio';
	import { OneColumnLayout } from '$lib/components/layouts';

	const { data } = $props();

	let activeTag = $state<string | undefined>(undefined);

	function toggleTag(tag: string) {
		activeTag = activeTag === tag ? undefined : tag;
	}

	function getAllTags() {
		const tagsSet = new Set<string>();
		data.posts.forEach((post) => {
			post.tags.forEach((tag) => tagsSet.add(tag));
		});
		return Array.from(tagsSet);
	}

	const filteredPosts = $derived(
		activeTag ? data.posts.filter((post) => post.tags.includes(activeTag!)) : data.posts
	);

	const allTags = getAllTags();
</script>

<SEO
	title="Blog"
	description={`${bio.fullName}'s blog about software engineering, distributed systems, C#, Go, and system design. Insights from a Software Developer at JetBrains.`}
	url="/blog"
	keywords={['blog', 'software engineering', 'programming', 'distributed systems', 'C#', 'Go']}
/>

<OneColumnLayout>
	<div class="flex flex-col pb-12">
		<PageHeader title="Blog" subtitle="Thoughts, ideas, and explorations" />

		<section class="mb-12 flex flex-wrap items-center gap-5 max-sm:flex-col max-sm:items-start">
			<div class="text-lg text-fg-2">Filter by topic:</div>
			<div class="flex flex-wrap gap-2">
				{#each allTags as tag (tag)}
					<Badge
						variant={activeTag === tag ? 'active' : 'default'}
						interactive={true}
						onclick={() => toggleTag(tag)}
					>
						{tag}
					</Badge>
				{/each}
				{#if activeTag}
					<Button size="small" intent="secondary" onclick={() => (activeTag = undefined)}>
						Clear filter
					</Button>
				{/if}
			</div>
		</section>

		<section>
			{#if filteredPosts.length === 0}
				<Card class="p-12 text-center">
					<p class="mx-auto mb-5">No posts found matching the selected filter.</p>
					<Button size="small" intent="secondary" onclick={() => (activeTag = undefined)}>
						Clear filter
					</Button>
				</Card>
			{:else}
				<PostsGrid posts={filteredPosts} {activeTag} onTagClick={toggleTag} />
			{/if}
		</section>
	</div>
</OneColumnLayout>
