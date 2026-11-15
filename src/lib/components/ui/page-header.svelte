<script lang="ts">
	interface Props {
		title: string;
		kicker?: string;
		lead?: string;
		/** Replaces the kicker with "← {back.label}". */
		back?: { href: string; label: string };
	}

	const { title, kicker, lead, back }: Props = $props();
</script>

<header class="pt-14 pb-8 sm:pt-[72px]">
	{#if back}
		<a href={back.href} class="eyebrow no-underline hover:text-link">← {back.label}</a>
	{:else if kicker}
		<span class="eyebrow">{kicker}</span>
	{/if}
	<h1
		class="mt-3 mb-0 text-[clamp(40px,6vw,72px)]/[1] font-semibold tracking-[-0.02em] font-stretch-[115%]"
	>
		{title}
	</h1>
	{#if lead}
		<p class="mt-5 mb-0 max-w-[36em] text-ink-2">{lead}</p>
	{/if}
</header>
