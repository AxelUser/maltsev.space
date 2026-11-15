<script lang="ts">
	import { Badge } from '$lib/components/ui';

	const { tags = [] }: { tags?: string[] } = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag (tag)}
		<Badge>{tag}</Badge>
	{/each}
</div>
