<!--
	@component
	On/off switch for the live cover.
-->
<script lang="ts">
	import { cn } from '$lib/utils';

	let { enabled = $bindable() }: { enabled: boolean } = $props();
</script>

<button
	type="button"
	aria-pressed={enabled}
	title={enabled ? 'Turn the animation off' : 'Turn the animation on'}
	onclick={() => (enabled = !enabled)}
	class="badge cursor-pointer transition-colors hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
>
	<span
		class={cn(
			'size-1.5 rounded-full transition-colors',
			enabled ? 'bg-livery-3/80' : 'bg-white/35'
		)}
		aria-hidden="true"
	></span>
	Live cover: {enabled ? 'on' : 'off'}
</button>
