<!--
	@component
	Renders the `::contents` directive as a nested list of the post's headings inside the article. It is
	hidden from `2xl` up, where the `PostToc` sidebar lists the headings. It renders nothing when the post
	has no headings.
-->
<script lang="ts">
	import { getContext } from 'svelte';
	import { toc_tree, type TocData } from '@mdsvex/plugin-toc';

	const data = getContext<{ current?: { toc?: TocData } } | undefined>(
		Symbol.for('mdsvex.plugin_data')
	);

	const tree = $derived(toc_tree(data?.current?.toc?.headings ?? []));
</script>

{#if tree.length > 0}
	<nav aria-labelledby="contents-label" class="2xl:hidden print:block">
		<p
			id="contents-label"
			class="mt-[2.2em] mb-[0.7em] font-display text-[24px]/[1.2] font-semibold text-ink font-stretch-[108%] sm:text-[27px]"
		>
			Contents
		</p>
		<ul>
			{#each tree as node (node.id)}
				<li>
					<a href="#{node.id}">{node.text}</a>
					{#if node.children.length > 0}
						<ul>
							{#each node.children as child (child.id)}
								<li><a href="#{child.id}">{child.text}</a></li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
{/if}
