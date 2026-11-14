<script lang="ts">
	type Props = {
		title: string;
		date: string;
		preview: string;
		author: string;
		heroImage: any;
		placeholder?: string;
		views?: number;
		readingTimeMinutes?: number;
	};

	const {
		title,
		date,
		preview,
		author,
		heroImage,
		placeholder: placeholderBase64,
		views,
		readingTimeMinutes
	}: Props = $props();

	let imageLoaded = $state(false);

	$effect(() => {
		if (!placeholderBase64) {
			imageLoaded = true;
		} else {
			imageLoaded = false;
		}
	});

	function handleImageLoad() {
		imageLoaded = true;
	}

	function handleImageError() {
		imageLoaded = false;
	}
</script>

<div
	class="relative mx-auto mb-5 bg-surface-1 py-12 text-white md:max-w-[min(90%,var(--container-content))]"
>
	{#if heroImage}
		<img
			src={placeholderBase64}
			alt="{title} hero image placeholder"
			class={[
				'absolute inset-0 size-full object-cover [--pulse-max:0.4] [--pulse-min:0.2]',
				imageLoaded ? 'opacity-0' : 'animate-placeholder-pulse opacity-30'
			]}
		/>
		<enhanced:img
			src={heroImage}
			alt="{title} hero image"
			loading="lazy"
			class="absolute inset-0 size-full object-cover transition-opacity duration-300 ease-in-out {imageLoaded
				? 'opacity-30'
				: 'opacity-0'}"
			sizes="min(1536px, 100vw)"
			onload={handleImageLoad}
			onerror={handleImageError}
		/>
	{/if}
	<div class="relative z-1 mx-auto max-w-[70ch] p-0">
		<hgroup class="mb-0 max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
			<div
				class="mb-5 flex items-center gap-2 text-base font-medium text-fg-1 max-md:justify-center"
			>
				<time datetime="2024-06-15" class="opacity-90 max-md:text-[0.8rem]">{date}</time>
				<span class="opacity-60 max-md:text-[0.8rem]">•</span>
				<span class="opacity-90 max-md:text-[0.8rem]">by {author}</span>
				{#if readingTimeMinutes}
					<span class="opacity-60 max-md:text-[0.8rem]">•</span>
					<span class="opacity-90 max-md:text-[0.8rem]">{readingTimeMinutes} min</span>
				{/if}
				{#if views}
					<span class="opacity-60 max-md:text-[0.8rem]">•</span>
					<span class="opacity-90 max-md:text-[0.8rem]">{views.toLocaleString()} views</span>
				{/if}
			</div>
			<h1 class="space-title">{title}</h1>
			{#if preview}
				<p class="mt-5 block text-lg/[1.6] text-fg-1 italic max-md:px-5">{preview}</p>
			{/if}
		</hgroup>
	</div>
</div>
