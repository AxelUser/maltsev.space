<!--
	@component
	Turns link-coloured and nudges on hover.
-->
<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';

	interface Props {
		dir?: 'forward' | 'back';
		/** A call to action label (e.g. "Read the note"). */
		label?: string;
		class?: ClassValue;
	}

	const { dir = 'forward', label, class: className }: Props = $props();

	const back = $derived(dir === 'back');
</script>

{#snippet arrow()}
	<span
		class={[
			'inline-block transition-transform',
			back ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
		]}
		aria-hidden="true">{back ? '←' : '→'}</span
	>
{/snippet}

<span
	class={cn(
		'inline-flex items-center gap-1.5 font-display transition-colors group-hover:text-link',
		label ? 'text-[15px] font-semibold text-ink-2' : 'text-[18px] font-medium text-ink-3',
		className
	)}
	aria-hidden={label ? undefined : 'true'}
>
	{#if back}{@render arrow()}{/if}
	{#if label}<span>{label}</span>{/if}
	{#if !back}{@render arrow()}{/if}
</span>
