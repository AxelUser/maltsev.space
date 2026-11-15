<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div
	class="relative mt-12 pl-5 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-linear-to-b/srgb before:from-brand before:to-accent md:pl-[30px]"
>
	{@render children()}
</div>
