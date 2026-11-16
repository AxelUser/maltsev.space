<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		/** Right-hand caption. Becomes a link when `href` is set. */
		aside?: string;
		href?: string;
		id?: string;
		children?: Snippet;
	}

	const { title, aside, href, id, children }: Props = $props();
</script>

<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
	<h2
		{id}
		class="m-0 text-[26px] font-semibold tracking-[-0.01em] font-stretch-[112%] sm:text-[30px]"
	>
		{title}
	</h2>
	{#if aside && href}
		<a {href} class="eyebrow text-ink-2 no-underline hover:text-link">{aside}</a>
	{:else if aside}
		<span class="eyebrow">{aside}</span>
	{/if}
	{@render children?.()}
</div>
