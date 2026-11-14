<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
	}

	const { title, subtitle }: Props = $props();
</script>

<header
	class="mx-auto mb-12 flex max-w-[800px] flex-col items-center justify-center px-5 text-center"
>
	<h1 class="space-title mb-2">{title}</h1>
	{#if subtitle}
		<p class="space-subtitle m-0 max-w-[600px] text-xl leading-[1.6]">{subtitle}</p>
	{/if}
</header>
