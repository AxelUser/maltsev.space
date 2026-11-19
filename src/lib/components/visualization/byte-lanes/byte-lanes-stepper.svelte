<!--
@component
A Stepper whose steps are ByteLanes calculations, so a post can use it without snippet syntax.
-->
<script lang="ts">
	import { Stepper, type Step } from '../array-steps';
	import ByteLanes from './byte-lanes.svelte';
	import type { ByteLanesState } from './types';

	interface Props {
		steps: Step<ByteLanesState>[];
		/** Accessible name of the widget. */
		title: string;
		class?: string;
	}

	const { steps, title, class: className }: Props = $props();
</script>

<Stepper {steps} {title} class={className}>
	{#snippet view(state: ByteLanesState)}
		<ByteLanes {state} class="my-0" />
	{/snippet}
</Stepper>
