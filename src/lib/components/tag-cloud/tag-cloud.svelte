<script lang="ts">
	import { Badge } from '$lib/components/ui';

	export let tags: string[] = [];
</script>

<div class="tag-cloud">
	{#each tags as tag}
		<Badge>{tag}</Badge>
	{/each}
</div>

<style>
	.tag-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-small);
	}
</style>
