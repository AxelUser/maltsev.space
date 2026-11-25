<script lang="ts">
	import type { Project } from '#lib/content/index.ts';
	import { HudBox, TechList } from '#lib/components/ui/index.ts';

	const { project }: { project: Project } = $props();
</script>

<HudBox href={project.url} external class="flex flex-col p-6">
	<div class="flex items-center gap-3.5">
		{#if project.icon}
			<img src={project.icon} alt="" loading="lazy" class="size-10 shrink-0 rounded-lg" />
		{:else}
			<span
				class="grid size-10 shrink-0 place-items-center rounded-lg bg-ink font-display text-[15px] font-semibold text-canvas"
				aria-hidden="true"
			>
				{project.title.slice(0, 2)}
			</span>
		{/if}
		<h3
			class="m-0 text-[21px] font-semibold transition-colors font-stretch-[108%] group-hover:text-link"
		>
			{project.title} <span class="text-[15px] text-ink-3" aria-hidden="true">↗</span>
		</h3>
	</div>
	<p class="mt-3.5 mb-[18px] flex-1 text-[15px] text-ink-2">{project.description}</p>
	<TechList items={project.tech} />
</HudBox>
