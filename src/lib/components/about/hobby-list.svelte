<script lang="ts">
	import type { Hobby } from '#lib/content/index.ts';
	import { HobbyIcon } from '#lib/components/icons/index.ts';

	const { hobbies }: { hobbies: Hobby[] } = $props();
</script>

<ul class="m-0 list-none p-0">
	{#each hobbies as hobby (hobby.title)}
		<li class="grid grid-cols-[44px_1fr] gap-4 border-t border-line py-3.5">
			<HobbyIcon name={hobby.icon} class="mt-1 size-[30px] text-livery-4" />
			<div>
				<h3 class="m-0 text-[19px] font-semibold font-stretch-[106%]">{hobby.title}</h3>
				<p class="mt-0.5 mb-0 text-[15px] text-ink-2">{hobby.text}</p>
			</div>
		</li>
	{/each}
</ul>
