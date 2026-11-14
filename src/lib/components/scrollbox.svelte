<script lang="ts">
	const { children } = $props();
</script>

<div class="mb-5 max-w-fit overflow-x-auto">
	{@render children()}
</div>
