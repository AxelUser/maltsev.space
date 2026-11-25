<script lang="ts">
	import type { Challenge } from '#lib/content/index.ts';
	import { PillLinks } from '#lib/components/ui/index.ts';

	const { challenges }: { challenges: Challenge[] } = $props();
</script>

{#each challenges as challenge (challenge.title)}
	<div class="border-t border-line py-3.5">
		<h3 class="m-0 text-[19px] font-semibold font-stretch-[106%]">{challenge.title}</h3>
		<p class="mt-0.5 mb-2.5 text-[15px] text-ink-2">{challenge.text}</p>
		<PillLinks links={challenge.links} size="sm" />
	</div>
{/each}
