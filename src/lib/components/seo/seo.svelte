<script lang="ts">
	import { config } from '$lib/config';
	import { bio } from '$lib/bio';

	interface Props {
		title?: string;
		description?: string;
		image?: string;
		imageAlt?: string;
		url?: string;
		type?: 'website' | 'article';
		publishedTime?: string;
		modifiedTime?: string;
		author?: string;
		keywords?: string[];
		noindex?: boolean;
	}

	const {
		title = config.websiteTitle,
		description = `${bio.fullName} - Senior Software Engineer focused on distributed systems and highload applications. Blog about C#, Go, system design, and performance optimization.`,
		image = '/images/ava.jpg',
		imageAlt = `${bio.fullName} - Software Engineer`,
		url,
		type = 'website',
		publishedTime,
		modifiedTime,
		author = bio.fullName,
		keywords = [],
		noindex = false
	}: Props = $props();

	const fullTitle = title === config.websiteTitle ? title : `${title} | ${config.websiteTitle}`;
	const fullUrl = url ? `${config.websiteUrl.replace(/\/$/, '')}${url}` : config.websiteUrl;
	const fullImageUrl = image.startsWith('http')
		? image
		: `${config.websiteUrl.replace(/\/$/, '')}${image}`;
</script>

<svelte:head>
	<!-- Basic SEO -->
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={fullUrl} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={fullImageUrl} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta property="og:url" content={fullUrl} />
	<meta property="og:site_name" content={config.websiteTitle} />
	<meta property="og:locale" content="en_US" />

	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if modifiedTime}
			<meta property="article:modified_time" content={modifiedTime} />
		{/if}
		{#if author}
			<meta property="article:author" content={author} />
		{/if}
		<meta property="article:section" content="Technology" />
		{#each keywords as keyword}
			<meta property="article:tag" content={keyword} />
		{/each}
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={fullImageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />
	<meta name="twitter:site" content={bio.social.twitter} />
	<meta name="twitter:creator" content={bio.social.twitter} />
</svelte:head>
