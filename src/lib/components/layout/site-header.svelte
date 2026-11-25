<script lang="ts">
	import { page } from '$app/state';
	import { sections } from '#lib/config.ts';
	import ReadingProgress from './reading-progress.svelte';
	import ThemeSwitch from './theme-switch.svelte';
	import Container from './container.svelte';

	const isArticle = $derived(page.route.id === '/blog/[slug]');
	const isCurrent = (href: string) => page.url.pathname.startsWith(href);
</script>

<header
	class="sticky top-0 z-30 bg-[color-mix(in_srgb,var(--color-canvas)_84%,transparent)] backdrop-blur-[10px]"
>
	<div class="border-b border-line">
		<Container class="flex h-[68px] items-center gap-2 xs:gap-4 lg:gap-9">
			<a
				href="/"
				class="font-display text-[16px] font-semibold tracking-[0.02em] whitespace-nowrap no-underline font-stretch-[112%]"
				aria-label="maltsev.space, home"
			>
				maltsev<span class="max-xs:hidden">.space</span><span
					class="ml-[3px] inline-block h-[1em] w-[0.5em] animate-blink bg-livery-1 align-[-2px]"
					aria-hidden="true"
				></span>
			</a>

			<nav aria-label="Main" class="flex xs:gap-1.5">
				{#each sections as section (section.href)}
					{@const current = isCurrent(section.href)}
					<a
						href={section.href}
						aria-current={current ? 'page' : undefined}
						style:--c={section.color}
						class={[
							'chevron py-2 pr-2 pl-3 font-display text-[13.5px] font-medium no-underline transition-colors font-stretch-[108%] xs:text-[14px] lg:pr-4 lg:pl-5 lg:text-[15px]',
							current
								? 'bg-(--c) text-on-livery'
								: 'text-ink-2 hover:bg-[color-mix(in_srgb,var(--c)_18%,transparent)] hover:text-ink'
						]}
					>
						{section.label}
					</a>
				{/each}
			</nav>

			<div class="ml-auto flex items-center gap-1.5 xs:gap-3">
				<a
					href="/rss.xml"
					aria-label="RSS feed"
					class="inline-grid size-9 place-items-center border border-line text-ink-2 no-underline hover:border-line-2 hover:text-ink max-xs:hidden"
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
						<circle cx="5" cy="19" r="1" />
					</svg>
				</a>
				<ThemeSwitch />
			</div>
		</Container>
	</div>
	{#if isArticle}
		{#key page.url.pathname}
			<ReadingProgress />
		{/key}
	{/if}
</header>
