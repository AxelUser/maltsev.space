<script lang="ts">
	export let date: string | undefined = undefined;
</script>

<div class="timeline-item">
	<div class="timeline-dot"></div>
	<div class="timeline-content">
		{#if date}
			<div class="timeline-date">{date}</div>
		{/if}
		<slot />
	</div>
</div>

<style>
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
</style>
