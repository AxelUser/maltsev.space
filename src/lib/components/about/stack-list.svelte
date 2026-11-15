<script lang="ts">
	import { stack, type StackKey } from '$lib/components/icons';

	const { items }: { items: readonly StackKey[] } = $props();
</script>

<ul class="m-0 mt-6 flex list-none flex-wrap gap-2.5 p-0" aria-label="Main stack">
	{#each items as key (key)}
		{@const item = stack[key]}
		<li
			class="inline-flex items-center gap-2 border border-line bg-surface py-1.5 pr-3 pl-2 font-mono text-[13px] font-medium"
		>
			<item.icon size="20px" />
			{item.name}
		</li>
	{/each}
</ul>
