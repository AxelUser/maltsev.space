<script lang="ts">
	import { OneColumnLayout } from '$lib/components/layouts';

	const { children } = $props();
</script>

<OneColumnLayout>
	{@render children()}
</OneColumnLayout>
