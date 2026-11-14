<script lang="ts">
	import { ThemeSwitch } from '$lib/components';
	import { config } from '$lib/config';
	import { Rss, Menu, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { OneColumnLayout } from './layouts';

	const navItems = [
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' },
		{ href: '/art', label: 'Art' }
	];

	const navLinkClass =
		'p-2 text-base font-normal text-fg-2 no-underline transition-colors hover:bg-brand/15 hover:text-fg-1';

	let mobileMenuOpen = $state(false);
	let navContainer: HTMLDivElement;
	let menuToggle: HTMLButtonElement;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		if (!mobileMenuOpen) return;

		const target = event.target as Node;

		if (menuToggle && menuToggle.contains(target)) return;

		if (navContainer && !navContainer.contains(target)) {
			mobileMenuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside, { capture: true });
		return () => {
			document.removeEventListener('click', handleClickOutside, { capture: true });
		};
	});
</script>

<header
	class="sticky top-0 z-10 h-header border-b border-brand/20 bg-surface-1/85 backdrop-blur-[5px]"
>
	<OneColumnLayout class="relative flex h-full items-center">
		<div>
			<a
				href="/"
				class="text-base font-bold tracking-normal text-brand no-underline transition-colors [text-shadow:0_0_3px_var(--brand)] hover:text-accent xs:text-lg xs:tracking-[0.05em] md:text-xl md:tracking-[0.1em]"
			>
				{config.websiteTitle}
			</a>
		</div>

		<ul class="ml-5 flex grow gap-5 max-md:hidden">
			{#each navItems as item (item.href)}
				<li>
					<a class={navLinkClass} href={item.href} onclick={() => (mobileMenuOpen = false)}>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>

		<div class="ml-auto flex items-center gap-2">
			<a
				href="/rss.xml"
				onclick={() => (mobileMenuOpen = false)}
				class="{navLinkClass} flex items-center"
				aria-label="RSS Feed"
			>
				<Rss size={16} aria-hidden="true" />
			</a>
			<ThemeSwitch />

			<button
				class="hidden items-center justify-center bg-transparent p-0 text-fg-1 transition-colors max-md:flex"
				bind:this={menuToggle}
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<X size={24} stroke-width={2.5} aria-hidden="true" />
				{:else}
					<Menu size={24} stroke-width={2.5} aria-hidden="true" />
				{/if}
			</button>
		</div>
	</OneColumnLayout>

	<div
		class={[
			'absolute inset-x-0 top-full z-5 hidden border-b border-brand/20 bg-surface-1 p-5 shadow-md transition-all duration-300 ease-[ease] max-md:block',
			mobileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-5 opacity-0'
		]}
		bind:this={navContainer}
	>
		<ul class="flex flex-col items-center gap-5">
			{#each navItems as item (item.href)}
				<li
					class="w-full text-center not-last:after:mx-auto not-last:after:mt-2 not-last:after:block not-last:after:h-px not-last:after:w-[30%] not-last:after:bg-brand/30"
				>
					<a
						class="block px-0 py-2 text-center text-[1.2rem] text-fg-2 no-underline transition-colors hover:bg-brand/15 hover:text-fg-1"
						href={item.href}
						onclick={() => (mobileMenuOpen = false)}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</header>
