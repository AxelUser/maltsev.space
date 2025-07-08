<script lang="ts">
	import { ThemeSwitch } from '$lib/components';
	import { config } from '$lib/config';
	import { Rss, Menu, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { OneColumnLayout } from './layouts';

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

<header>
	<OneColumnLayout class="nav-bar">
		<div class="logo">
			<a href="/">{config.websiteTitle}</a>
		</div>

		<ul class="nav-links">
			<li><a class="nav-link" href="/" onclick={() => (mobileMenuOpen = false)}>Home</a></li>
			<li>
				<a class="nav-link" href="/about" onclick={() => (mobileMenuOpen = false)}>About</a>
			</li>
			<li><a class="nav-link" href="/art" onclick={() => (mobileMenuOpen = false)}>Gallery</a></li>
			<li><a class="nav-link" href="/blog" onclick={() => (mobileMenuOpen = false)}>Blog</a></li>
		</ul>

		<div class="nav-actions">
			<a
				href="/rss.xml"
				onclick={() => (mobileMenuOpen = false)}
				class="rss-link nav-link"
				aria-label="RSS Feed"
			>
				<Rss size={16} aria-hidden="true" />
			</a>
			<ThemeSwitch />

			<button
				class="mobile-menu-toggle"
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

	<div class="mobile-nav" class:active={mobileMenuOpen} bind:this={navContainer}>
		<ul>
			<li><a class="nav-link" href="/" onclick={() => (mobileMenuOpen = false)}>Home</a></li>
			<li>
				<a class="nav-link" href="/about" onclick={() => (mobileMenuOpen = false)}>About</a>
			</li>
			<li><a class="nav-link" href="/art" onclick={() => (mobileMenuOpen = false)}>Gallery</a></li>
			<li><a class="nav-link" href="/blog" onclick={() => (mobileMenuOpen = false)}>Blog</a></li>
		</ul>
	</div>
</header>

<style>
	@import 'open-props/media';

	header {
		height: var(--header-height);
		backdrop-filter: blur(5px);
		background-color: color-mix(in srgb, var(--surface-1) 85%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--brand) 20%, transparent);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	header :global(.nav-bar) {
		display: flex;
		align-items: center;
		height: 100%;
		position: relative;
	}

	.logo a {
		font-size: var(--font-size-3);
		font-weight: var(--font-weight-7);
		color: var(--brand);
		text-decoration: none;
		letter-spacing: 0.1em;
		text-shadow: 0 0 3px var(--brand);
		transition: color var(--transition-fast);
	}

	.logo a:hover {
		color: var(--accent);
	}

	.nav-links {
		display: flex;
		gap: var(--gap);
		list-style: none;
		margin: 0;
		padding: 0;
		margin-left: var(--gap);
		flex-grow: 1;
	}

	.nav-link {
		color: var(--text-2);
		text-decoration: none;
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-4);
		padding: var(--gap-small) var(--gap-small);
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast);
	}

	.nav-link:hover {
		color: var(--text-1);
		background-color: color-mix(in srgb, var(--brand) 15%, transparent);
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: var(--gap-small);
		margin-left: auto;
	}

	.rss-link {
		display: flex;
		align-items: center;
	}

	.mobile-menu-toggle {
		display: none;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		color: var(--text-1);
		transition: color var(--transition-fast);
	}

	.mobile-nav {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: var(--surface-1);
		padding: var(--gap);
		border-bottom: 1px solid color-mix(in srgb, var(--brand) 20%, transparent);
		box-shadow: var(--shadow-2);
		transform: translateY(-20px);
		opacity: 0;
		visibility: hidden;
		transition: all 0.3s ease;
		z-index: 5;
	}

	.mobile-nav.active {
		transform: translateY(0);
		opacity: 1;
		visibility: visible;
	}

	.mobile-nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap);
	}

	.mobile-nav .nav-link {
		display: block;
		text-align: center;
		padding: var(--gap-small) 0;
		font-size: calc(var(--font-size-1) * 1.2);
	}

	.mobile-nav li {
		width: 100%;
		text-align: center;
	}

	.mobile-nav li:not(:last-child)::after {
		content: '';
		display: block;
		width: 30%;
		height: 1px;
		background-color: color-mix(in srgb, var(--brand) 30%, transparent);
		margin: var(--gap-small) auto 0;
	}

	@media (--md-n-below) {
		.mobile-menu-toggle {
			display: flex;
		}

		.nav-links {
			display: none;
		}

		.mobile-nav {
			display: block;
		}

		.logo a {
			font-size: var(--font-size-2);
			letter-spacing: 0.05em;
		}
	}

	@media (--xs-n-below) {
		.logo a {
			font-size: var(--font-size-1);
			letter-spacing: 0;
		}
	}
</style>
