<script lang="ts">
	import { Badge, Link } from '$lib/components/ui';
	import { ExternalLink } from '@lucide/svelte';
	export let date: string | undefined = undefined;
	export let technologies: string[] = [];
	export let title: string;
	export let companyUrl: string | undefined = undefined;
</script>

<div class="timeline-item">
	<div class="timeline-dot"></div>
	<div class="timeline-content">
		{#if date}
			<div class="timeline-date">{date}</div>
		{/if}
		{#if companyUrl}
			<h3 class="section-title">
				<Link href={companyUrl} external={true} class="company-link">
					{title}
					<ExternalLink size={16} class="external-link-icon" />
				</Link>
			</h3>
		{:else}
			<h3 class="section-title">{title}</h3>
		{/if}
		<slot />
		{#if technologies.length > 0}
			<div class="badge-container">
				{#each technologies as tech}
					<Badge>{tech}</Badge>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	@import 'open-props/media';
	.timeline-item {
		position: relative;
		margin-bottom: var(--gap-large);
	}

	.timeline-dot {
		position: absolute;
		left: -37px;
		top: 5px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: var(--accent);
		border: 3px solid var(--surface-1);
	}

	.timeline-date {
		font-size: var(--font-size-2);
		font-weight: 600;
		color: var(--brand);
		margin-bottom: var(--gap-small);
	}

	.timeline-content :global(p) {
		margin: 0;
		color: var(--text-2);
	}

	.badge-container {
		display: flex;
		gap: var(--gap-small);
		flex-wrap: wrap;
		margin-top: var(--gap-small);
	}

	@media (--md-n-below) {
		.timeline-dot {
			left: -24px;
		}
	}

	@media (--sm-n-below) {
		.timeline-dot {
			width: 12px;
			height: 12px;
			left: -20px;
		}
	}

	.section-title {
		margin-top: 0;
		margin-bottom: var(--gap-small);
		color: var(--text-1);
		font-size: var(--font-size-3);
	}

	.section-title :global(a.company-link) {
		color: var(--text-1);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: var(--size-1);
	}

	.section-title :global(a.company-link:hover) {
		text-decoration: underline;
		color: var(--link);
	}

	.external-link-icon {
		color: var(--text-2);
		transition: color 0.2s ease-in-out;
	}
</style>
