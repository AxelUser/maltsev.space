<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	const { children, class: className }: Props = $props();
</script>

<div
	class={[
		'mx-auto max-w-[90%] px-2 md:px-5 xl:max-w-[min(90%,var(--container-content))] md:max-xl:max-w-[min(90%,1000px)]',
		className
	]}
>
	{@render children()}
</div>
