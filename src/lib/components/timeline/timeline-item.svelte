<script lang="ts">
	import { Badge, Link } from '$lib/components/ui';
	import { ExternalLink } from '@lucide/svelte';
	export let date: string | undefined = undefined;
	export let technologies: string[] = [];
	export let title: string;
	export let role: string | undefined = undefined;
	export let companyDescription: string | undefined = undefined;
	export let companyUrl: string | undefined = undefined;
</script>

<div class="timeline-item">
	<div class="timeline-dot"></div>
	<div class="timeline-content">
		<div class="timeline-header">
			{#if date}
				<span class="timeline-date">{date}</span>
			{/if}
			{#if date && (title || role)}
				<span class="separator">•</span>
			{/if}
			{#if companyUrl}
				<Link href={companyUrl} external={true} class="company-link">
					{title}
					<ExternalLink size={14} class="external-link-icon" />
				</Link>
			{:else}
				<span class="company-name">{title}</span>
			{/if}
			{#if role && title}
				<span class="separator">•</span>
				<span class="role">{role}</span>
			{/if}
		</div>

		{#if companyDescription}
			<p class="company-description">{companyDescription}</p>
		{/if}

		<div class="timeline-body">
			<slot />
		</div>

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

	.timeline-header {
		display: flex;
		align-items: center;
		gap: var(--size-2);
		margin-bottom: var(--gap-small);
		flex-wrap: wrap;
	}

	.timeline-date {
		font-size: var(--font-size-2);
		font-weight: 600;
		color: var(--brand);
	}

	.separator {
		color: var(--text-3);
		font-weight: normal;
	}

	.company-name {
		font-size: var(--font-size-3);
		font-weight: 600;
		color: var(--text-1);
	}

	.timeline-header :global(a.company-link) {
		color: var(--text-1);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: var(--size-1);
		font-size: var(--font-size-3);
		font-weight: 600;
	}

	.timeline-header :global(a.company-link:hover) {
		text-decoration: underline;
		color: var(--link);
	}

	.role {
		font-size: var(--font-size-2);
		color: var(--text-2);
		font-weight: 500;
	}

	.company-description {
		max-inline-size: var(--size-md);
		font-size: var(--font-size-1);
		color: var(--text-2);
		margin-bottom: var(--gap-small);
		line-height: 1.4;
	}

	.timeline-body :global(p) {
		margin: 0;
		color: var(--text-2);
	}

	.timeline-body :global(ul) {
		margin: var(--gap-small) 0 0 0;
		padding-left: var(--size-4);
	}

	.timeline-body :global(li) {
		margin-bottom: var(--gap-small);
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

		.timeline-header {
			gap: var(--size-1);
		}
	}

	@media (--sm-n-below) {
		.timeline-dot {
			width: 12px;
			height: 12px;
			left: -20px;
		}

		.timeline-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--size-1);
		}

		.separator {
			display: none;
		}
	}
</style>
