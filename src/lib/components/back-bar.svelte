<script lang="ts">
	import { Button } from '$lib/components/ui';

	interface Props {
		href: string;
		label: string;
	}

	const { href, label }: Props = $props();
</script>

<div class="mb-12 border-b border-brand/20 pb-5">
	<Button {href}>← {label}</Button>
</div>
