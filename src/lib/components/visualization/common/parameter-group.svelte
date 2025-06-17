<script lang="ts">
	import DisplayCard from './display-card.svelte';

	interface Parameter {
		label: string;
		value: string | number;
		unit?: string;
		description?: string;
	}

	interface Props {
		title: string;
		parameters: Parameter[];
		variant?: 'default' | 'sticky';
	}

	const { title, parameters, variant = 'default' }: Props = $props();
</script>

<div class="parameters-section" class:sticky={variant === 'sticky'}>
	<h3>{title}</h3>
	{#each parameters as param}
		<DisplayCard
			label={param.label}
			value={param.value}
			unit={param.unit}
			description={param.description}
			variant="parameter"
		/>
	{/each}
</div>

<style>
	.parameters-section {
		background: var(--surface-1);
		border-radius: var(--radius-2);
		padding: var(--gap);
		margin-bottom: var(--gap);
	}

	.parameters-section.sticky {
		position: sticky;
		top: var(--gap);
	}

	.parameters-section h3 {
		margin: 0 0 var(--gap) 0;
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-6);
		color: var(--text-1);
	}

	@media (max-width: 768px) {
		.parameters-section {
			padding: var(--gap-small);
		}

		.parameters-section.sticky {
			position: static;
		}
	}
</style>
