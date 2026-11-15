<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';

	type Props = {
		title: string;
		date: string;
		/** Machine-readable publish date for the `<time datetime>` attribute. */
		isoDate?: string;
		preview: string;
		author: string;
		heroImage?: EnhancedImageSrc;
		placeholder?: string;
		views?: number;
		readingTimeMinutes?: number;
	};

	const {
		title,
		date,
		isoDate,
		preview,
		author,
		heroImage,
		placeholder,
		views,
		readingTimeMinutes
	}: Props = $props();

	let imageLoaded = $state(false);

	$effect(() => {
		imageLoaded = !placeholder;
	});

	const meta = $derived(
		[
			`by ${author}`,
			readingTimeMinutes && `${readingTimeMinutes} min`,
			views && `${views.toLocaleString()} views`
		].filter(Boolean)
	);
</script>

<div class="relative mx-auto mb-5 bg-surface-1 py-12 md:max-w-[min(90%,var(--container-content))]">
	{#if heroImage}
		{#if placeholder}
			<img
				src={placeholder}
				alt=""
				class={[
					'absolute inset-0 size-full object-cover [--pulse-max:0.4] [--pulse-min:0.2]',
					imageLoaded ? 'opacity-0' : 'animate-placeholder-pulse opacity-30'
				]}
			/>
		{/if}
		<enhanced:img
			src={heroImage}
			alt="{title} hero image"
			fetchpriority="high"
			class={[
				'absolute inset-0 size-full object-cover transition-opacity duration-300 ease-in-out',
				imageLoaded ? 'opacity-30' : 'opacity-0'
			]}
			sizes="min(1536px, 100vw)"
			onload={() => (imageLoaded = true)}
			onerror={() => (imageLoaded = false)}
		/>
	{/if}
	<div class="relative z-1 mx-auto max-w-[70ch]">
		<hgroup class="max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
			<div
				class="mb-5 flex flex-wrap items-center gap-2 text-base font-medium text-fg-1 max-md:justify-center max-md:text-sm"
			>
				<time datetime={isoDate} class="opacity-90">{date}</time>
				{#each meta as item (item)}
					<span class="opacity-60" aria-hidden="true">•</span>
					<span class="opacity-90">{item}</span>
				{/each}
			</div>
			<h1 class="space-title">{title}</h1>
			{#if preview}
				<p class="mt-5 block text-lg/[1.6] text-fg-1 italic max-md:px-5">{preview}</p>
			{/if}
		</hgroup>
	</div>
</div>
