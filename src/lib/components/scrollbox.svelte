<script lang="ts">
	const { children } = $props();
</script>

<div class="scrollbox">
	{@render children()}
</div>

<style>
	.scrollbox {
		overflow-x: auto;
		max-inline-size: fit-content;
		margin-bottom: var(--gap);
	}
</style>
