<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	const { children, class: className }: Props = $props();
</script>

<div class={`space-container ${className}`}>
	{@render children()}
</div>

<style>
	@import 'open-props/media';

	.space-container {
		max-width: var(--content-width);
		margin-inline: auto;
		padding-inline: var(--gap);
	}

	@media (--xl-n-below) {
		.space-container {
			max-width: min(90%, 1000px);
		}
	}

	@media (--md-n-below) {
		.space-container {
			max-width: 90%;
			padding-inline: var(--gap-small);
		}
	}
</style>
