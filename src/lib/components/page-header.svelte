<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
	}

	const { title, subtitle }: Props = $props();
</script>

<header class="page-header">
	<h1 class="space-title">{title}</h1>
	{#if subtitle}
		<p class="space-subtitle">{subtitle}</p>
	{/if}
</header>

<style>
	.page-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		margin-bottom: var(--gap-large);
		padding: 0 var(--gap);
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}

	.page-header .space-title {
		margin-bottom: var(--gap-small);
	}

	.page-header .space-subtitle {
		margin: 0;
		max-width: 600px;
		line-height: 1.6;
		font-size: var(--font-size-3);
	}
</style>
