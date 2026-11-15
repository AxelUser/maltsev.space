<script lang="ts">
	const { items }: { items: string[] } = $props();
</script>

{#if items.length > 0}
	<ul class="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Technologies">
		{#each items as item (item)}
			<li class="border border-line px-2 py-0.5 font-mono text-[11.5px] font-medium text-ink-2">
				{item}
			</li>
		{/each}
	</ul>
{/if}
