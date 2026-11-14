<script lang="ts">
	import { Card, Badge, Link } from '$lib/components/ui';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		href: string;
		icon?: string;
		technologies?: string[];
		children: Snippet;
	}

	const { title, href, icon, technologies = [], children }: Props = $props();

	const isEmoji = $derived(!icon?.startsWith('/') && !icon?.startsWith('http'));
</script>

<Card class="h-full" contentClass="h-full">
	<div class="flex h-full flex-col">
		{#if icon}
			<div
				class="mb-2 flex size-[50px] items-center justify-center rounded-full bg-surface-3 text-[2rem] text-fg-1"
			>
				{#if isEmoji}
					{icon}
				{:else}
					<img src={icon} alt="{title} icon" loading="lazy" class="size-8 object-contain" />
				{/if}
			</div>
		{/if}
		<h3 class="m-0 mb-5 text-2xl leading-tight font-bold text-fg-1">
			<Link {href} external={true}>{title}</Link>
		</h3>
		<p class="grow">
			{@render children()}
		</p>
		{#if technologies.length > 0}
			<div class="mt-auto pt-5">
				<div class="flex flex-wrap gap-2">
					{#each technologies as tech}
						<Badge>{tech}</Badge>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</Card>
