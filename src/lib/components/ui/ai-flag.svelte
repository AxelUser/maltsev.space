<!--
	@component
	Corner flag for AI-generated images. Place inside a `relative` box; hidden from screen
	readers because the caption carries the same text.
-->
<script lang="ts">
	const { label }: { label: string } = $props();
</script>

<span
	class="pointer-events-none absolute top-3 left-3 z-1 inline-flex items-center gap-1.5 border border-white/15 bg-[rgb(7_10_15/0.55)] px-2 py-0.5 font-mono text-[11px]/[1.4] font-medium text-white/80 backdrop-blur-sm"
	aria-hidden="true"
>
	<span class="size-1.5 rounded-full bg-livery-3/80"></span>
	{label}
</span>
