<!--
	@component
	Caption under `Figure.Media`; must be a direct child of `Figure.Root`.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<!-- svelte-ignore a11y_figcaption_parent -->
<figcaption class="eyebrow mt-1.5 text-right">{@render children()}</figcaption>
