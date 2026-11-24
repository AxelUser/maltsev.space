<!--
	@component
	A sidebar list of the post's headings. It highlights the section the reader is on and renders nothing
	when the post has no headings.

	<PostToc headings={data.headings} />
-->
<script lang="ts">
	import { toc_tree, type TocHeading } from '@mdsvex/plugin-toc';

	interface Props {
		headings: TocHeading[];
	}

	const { headings }: Props = $props();

	const ACTIVE_HEADING_TOP_PX = 140;

	const tree = $derived(toc_tree(headings));
	let activeId = $state<string>();
	let frame = 0;

	function update() {
		frame = 0;
		let current: string | undefined;
		for (const { id } of headings) {
			const el = document.getElementById(id);
			if (!el || el.getBoundingClientRect().top > ACTIVE_HEADING_TOP_PX) break;
			current = id;
		}
		const atBottom =
			window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
		activeId = atBottom && headings.length > 0 ? headings[headings.length - 1].id : current;
	}

	function schedule() {
		if (!frame) frame = requestAnimationFrame(update);
	}

	$effect(() => {
		void headings;
		update();
		return () => cancelAnimationFrame(frame);
	});
</script>

<svelte:window onscroll={schedule} onresize={schedule} />

{#snippet entry(id: string, text: string, depth: number)}
	{@const isActive = id === activeId}
	<li
		class={[
			'relative',
			isActive &&
				'before:absolute before:inset-y-0 before:-left-px before:w-[2px] before:bg-livery-1'
		]}
	>
		<a
			href="#{id}"
			aria-current={isActive ? 'location' : undefined}
			class={[
				'block py-1 font-display no-underline transition-colors font-stretch-[104%] hover:text-link',
				depth > 2 ? 'pl-6 text-[13px]/[1.35]' : 'pl-3 text-[14px]/[1.35]',
				isActive ? 'font-semibold text-ink' : 'text-ink-2'
			]}
		>
			{text}
		</a>
	</li>
{/snippet}

{#if tree.length > 0}
	<nav aria-label="On this page">
		<span class="eyebrow">On this page</span>
		<ol
			class="mt-3 mb-0 max-h-[calc(100svh-var(--spacing-header)-160px)] list-none overflow-y-auto border-l border-line-2 p-0 [scrollbar-color:var(--color-line-2)_transparent] [scrollbar-width:thin]"
		>
			{#each tree as node (node.id)}
				{@render entry(node.id, node.text, node.depth)}
				{#each node.children as child (child.id)}
					{@render entry(child.id, child.text, child.depth)}
				{/each}
			{/each}
		</ol>
	</nav>
{/if}
