<!--
	@component
	All notes as a rail grouped by year, with `current` highlighted. Expects posts sorted newest first.
-->
<script lang="ts">
	import type { PostIndexEntry } from '$lib/types';

	interface Props {
		posts: PostIndexEntry[];
		current: string;
	}

	const { posts, current }: Props = $props();

	let list: HTMLDivElement;

	const years = $derived(
		Object.entries(
			posts.reduce<Record<string, PostIndexEntry[]>>((acc, post) => {
				(acc[post.year] ??= []).push(post);
				return acc;
			}, {})
		).sort(([a], [b]) => Number(b) - Number(a))
	);

	// Keep the current note in view. Sets scrollTop, as scrollIntoView would also scroll the page.
	$effect(() => {
		void current;
		const row = list.querySelector<HTMLElement>('[aria-current="page"]');
		if (!row) return;
		const top = row.getBoundingClientRect().top - list.getBoundingClientRect().top;
		list.scrollTop += top - list.clientHeight / 3;
	});
</script>

<nav aria-label="All notes">
	<span class="eyebrow">Notes · Index</span>
	<div
		bind:this={list}
		class="mt-3 max-h-[calc(100svh-var(--spacing-header)-160px)] overflow-y-auto py-2 [scrollbar-color:var(--color-line-2)_transparent] [scrollbar-width:thin] [mask-image:linear-gradient(transparent,#000_12px,#000_calc(100%-12px),transparent)]"
	>
		{#each years as [year, entries] (year)}
			<div class="mt-3 first:mt-0">
				<div
					class="mb-1.5 flex items-center gap-3 font-mono text-[12px] font-medium text-ink-3 after:h-px after:flex-1 after:bg-line"
				>
					{year}
				</div>
				<ol class="m-0 list-none border-l border-line-2 p-0">
					{#each entries as post (post.slug)}
						{@const isCurrent = post.slug === current}
						<li
							class={[
								'relative',
								isCurrent &&
									'before:absolute before:inset-y-0 before:-left-px before:w-[2px] before:bg-livery-1'
							]}
						>
							<a
								href="/blog/{post.slug}"
								title={post.title}
								aria-current={isCurrent ? 'page' : undefined}
								class="group grid grid-cols-[34px_1fr] items-baseline py-1 pl-3 no-underline"
							>
								<span
									class={[
										'font-mono text-[12px]',
										isCurrent ? 'text-livery-1' : 'text-ink-3 group-hover:text-link'
									]}
								>
									{post.number}
								</span>
								<span
									class={[
										'line-clamp-2 font-display text-[14px]/[1.35] transition-colors font-stretch-[104%]',
										isCurrent ? 'font-semibold text-ink' : 'text-ink-2 group-hover:text-link'
									]}
								>
									{post.title}
								</span>
							</a>
						</li>
					{/each}
				</ol>
			</div>
		{/each}
	</div>
</nav>
