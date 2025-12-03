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

<Card class="project-card">
	<div class="project-card-body">
		{#if icon}
			<div class="project-icon">
				{#if isEmoji}
					{icon}
				{:else}
					<img src={icon} alt="{title} icon" loading="lazy" />
				{/if}
			</div>
		{/if}
		<h3 class="project-title">
			<Link {href} external={true}>{title}</Link>
		</h3>
		<p class="project-description">
			{@render children()}
		</p>
		{#if technologies.length > 0}
			<div class="project-card-footer">
				<div class="badge-container">
					{#each technologies as tech}
						<Badge>{tech}</Badge>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</Card>

<style>
	:global(.project-card) {
		height: 100%;
	}

	:global(.project-card .card-content) {
		height: 100%;
	}

	.project-card-body {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.project-icon {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: var(--surface-3);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-1);
		font-size: var(--font-size-5);
		margin-bottom: var(--gap-small);
	}

	.project-icon img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}

	.project-title {
		font-size: var(--font-size-4);
		font-weight: var(--font-weight-7);
		color: var(--text-1);
		margin: 0;
		margin-bottom: var(--gap);
	}

	.project-description {
		flex-grow: 1;
	}

	.project-card-footer {
		margin-top: auto;
		padding-top: var(--gap);
	}

	.badge-container {
		display: flex;
		gap: var(--gap-small);
		flex-wrap: wrap;
	}
</style>
