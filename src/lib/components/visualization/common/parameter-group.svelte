<script lang="ts">
	import DisplayCard from './display-card.svelte';

	interface Parameter {
		label: string;
		value: string | number | null;
		unit?: string;
		description?: string;
	}

	interface Props {
		title: string;
		parameters: Parameter[];
		variant?: 'default' | 'sticky';
		cardVariant?: 'default' | 'compact' | 'elevated' | 'centered';
	}

	const { title, parameters, variant = 'default', cardVariant = 'compact' }: Props = $props();
</script>

<div class={['mb-5 border border-line bg-canvas p-2 md:p-5', variant === 'sticky' && 'md:sticky']}>
	<h3 class="m-0 mb-5 pb-2 text-center text-lg leading-tight font-semibold text-ink">{title}</h3>
	{#each parameters as param (param.label)}
		<DisplayCard
			label={param.label}
			value={param.value}
			unit={param.unit}
			description={param.description}
			variant={cardVariant}
		/>
	{/each}
</div>
