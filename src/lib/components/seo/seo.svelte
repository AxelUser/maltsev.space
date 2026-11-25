<script lang="ts">
	import { config } from '#lib/config.ts';
	import { bio } from '#lib/content/index.ts';

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
		description = `${bio.fullName} - ${bio.role} at ${bio.company}, focused on distributed systems and highload applications. Blog about C#, Go, system design, and performance optimization.`,
		image = '/images/ava.jpg',
		imageAlt = `${bio.fullName} - Software Engineer`,
		url,
		type = 'website',
		publishedTime,
		modifiedTime,
		author = bio.fullName,
		keywords: rawKeywords = [],
		noindex = false
	}: Props = $props();

	// Callers may merge keywords with tags, so drop duplicates (also keeps meta tags unique)
	const keywords = $derived([...new Set(rawKeywords)]);

	const fullUrl = $derived(
		url ? `${config.websiteUrl.replace(/\/$/, '')}${url}` : config.websiteUrl
	);
	const fullImageUrl = $derived(
		image?.startsWith('http') ? image : `${config.websiteUrl.replace(/\/$/, '')}${image}`
	);

	/** Serializes schema data into a JSON-LD script tag (`<` escaped so content can't close the tag). */
	const jsonLd = (data: unknown) =>
		'<script type="application/ld+json">' +
		JSON.stringify(data).replace(/</g, '\\u003c') +
		'</' +
		'script>';

	const personSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: bio.fullName,
		jobTitle: bio.role,
		description: `${bio.role} at ${bio.company}, focused on distributed systems and highload applications`,
		url: config.websiteUrl,
		image: `${config.websiteUrl}images/ava.jpg`,
		sameAs: [bio.social.github, bio.social.linkedIn].filter(Boolean)
	});

	const websiteSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Website',
		name: config.websiteTitle,
		description: description,
		url: config.websiteUrl,
		author: personSchema,
		publisher: personSchema
	});

	const blogSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: config.websiteTitle,
		description: 'Technical blog about C#, Go, system design, and performance optimization',
		url: config.websiteUrl,
		author: personSchema,
		publisher: personSchema
	});

	const articleSchema = $derived(
		type === 'article'
			? {
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: title,
					description: description,
					image: fullImageUrl,
					author: personSchema,
					publisher: personSchema,
					url: fullUrl,
					datePublished: publishedTime,
					dateModified: modifiedTime || publishedTime,
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': fullUrl
					},
					keywords: keywords
				}
			: null
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={fullUrl} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
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
		{#each keywords as keyword (keyword)}
			<meta property="article:tag" content={keyword} />
		{/each}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={fullImageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />
	<meta name="twitter:site" content={bio.social.twitter} />
	<meta name="twitter:creator" content={bio.social.twitter} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party data, `<` escaped -->
	{@html jsonLd(personSchema)}

	{#if type === 'website'}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party data, `<` escaped -->
		{@html jsonLd(websiteSchema)}
		{#if url && url.includes('/blog')}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party data, `<` escaped -->
			{@html jsonLd(blogSchema)}
		{/if}
	{/if}

	{#if articleSchema}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party data, `<` escaped -->
		{@html jsonLd(articleSchema)}
	{/if}
</svelte:head>
