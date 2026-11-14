<script lang="ts">
	import { Badge } from '$lib/components/ui';

	export let tags: string[] = [];
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag}
		<Badge>{tag}</Badge>
	{/each}
</div>
