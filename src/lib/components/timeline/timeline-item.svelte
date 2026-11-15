<script lang="ts">
	import { Badge, Link } from '$lib/components/ui';
	import { ExternalLink } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		date?: string;
		role?: string;
		companyDescription?: string;
		companyUrl?: string;
		technologies?: string[];
		children?: Snippet;
	}

	const {
		title,
		date,
		role,
		companyDescription,
		companyUrl,
		technologies = [],
		children
	}: Props = $props();
</script>

<div class="relative mb-12">
	<div
		class="absolute top-[5px] -left-5 size-3 rounded-full border-3 border-surface-1 bg-accent sm:-left-6 sm:size-4 md:-left-[37px]"
	></div>
	<div>
		<div
			class="mb-2 flex flex-col flex-wrap items-start gap-1 sm:flex-row sm:items-center md:gap-2"
		>
			{#if date}
				<span class="text-lg font-semibold text-brand">{date}</span>
			{/if}
			{#if date && (title || role)}
				<span class="font-normal max-sm:hidden">•</span>
			{/if}
			{#if companyUrl}
				<Link
					href={companyUrl}
					external={true}
					class="inline-flex items-center gap-1 text-xl font-semibold text-fg-1 no-underline hover:text-link hover:underline"
				>
					{title}
					<ExternalLink size={14} />
				</Link>
			{:else}
				<span class="text-xl font-semibold text-fg-1">{title}</span>
			{/if}
			{#if role && title}
				<span class="font-normal max-sm:hidden">•</span>
				<span class="text-lg font-medium text-fg-2">{role}</span>
			{/if}
		</div>

		{#if companyDescription}
			<p class="mb-2 max-w-[768px] text-base/[1.4] text-fg-2">{companyDescription}</p>
		{/if}

		<div
			class="[&_li]:mb-2 [&_li]:ps-2 [&_li]:text-fg-2 [&_p]:m-0 [&_p]:text-fg-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5"
		>
			{@render children?.()}
		</div>

		{#if technologies.length > 0}
			<div class="mt-2 flex flex-wrap gap-2">
				{#each technologies as tech (tech)}
					<Badge>{tech}</Badge>
				{/each}
			</div>
		{/if}
	</div>
</div>
