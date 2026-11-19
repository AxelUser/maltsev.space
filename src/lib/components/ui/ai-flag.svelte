<!--
	@component
	Badge for marking AI generated media.
-->
<script lang="ts">
	interface Props {
		media?: 'Image' | 'Animation';
		tool?: string;
	}

	const { media = 'Image', tool }: Props = $props();

	const name = $derived(tool?.trim());
</script>

<span class="pointer-events-none badge" aria-hidden="true">
	<span class="size-1.5 rounded-full bg-livery-3/80"></span>
	AI Generated {media}{name ? ` · ${name}` : ''}
</span>
