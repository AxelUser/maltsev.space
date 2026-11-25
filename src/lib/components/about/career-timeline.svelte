<script lang="ts">
	import type { Job } from '#lib/content/index.ts';
	import { TechList } from '#lib/components/ui/index.ts';

	const { jobs }: { jobs: Job[] } = $props();

	const stopColors = [
		'var(--color-livery-1)',
		'var(--color-livery-2)',
		'var(--color-livery-3)',
		'var(--color-livery-4)'
	];

	const host = (url: string) => url.replace(/^https?:\/\/(www\.)?|\/$/g, '');
</script>

<ol
	class="relative m-0 mt-6 mb-10 list-none p-0 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line-2 lg:before:left-[131px]"
>
	{#each jobs as job, i (job.org + job.from)}
		<li
			class="relative grid gap-0 py-4 pl-7 before:absolute before:top-[22px] before:left-0 before:size-[11px] before:bg-(--stop) before:[clip-path:polygon(35%_0,100%_0,65%_100%,0_100%)] lg:grid-cols-[110px_1fr] lg:gap-11 lg:pl-0 lg:before:top-[26px] lg:before:left-[126px]"
			style:--stop={stopColors[i] ?? 'var(--color-ink-3)'}
		>
			<span class="font-mono text-[13px]/[1.6] text-ink-3 lg:text-right lg:leading-[2.2]">
				<span title={job.period}>{job.from}–{job.to ?? 'now'}</span>
			</span>
			<div>
				<h3 class="m-0 text-[22px] font-semibold font-stretch-[108%]">
					{job.org}<span class="ml-2 font-sans text-[15px] font-normal text-ink-2">{job.role}</span>
				</h3>
				<p class="mt-1 mb-0 max-w-[40em] text-[15px] text-ink-2">{job.description}</p>
				<div class="pt-3.5 pb-1.5">
					{#if job.highlights.length > 0}
						<ul
							class="mt-0 mb-3.5 max-w-[46em] pl-[18px] text-[15px] text-ink-2 marker:text-livery-2"
						>
							{#each job.highlights as point (point)}
								<li class="mb-1.5">{point}</li>
							{/each}
						</ul>
					{/if}
					<TechList items={job.tech} />
					{#if job.url}
						<a
							href={job.url}
							target="_blank"
							rel="noopener noreferrer"
							class="eyebrow mt-3 inline-block no-underline hover:text-link"
						>
							{host(job.url)} ↗
						</a>
					{/if}
				</div>
			</div>
		</li>
	{/each}
</ol>
