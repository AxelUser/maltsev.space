<script>
	import { ThemeSwitch } from '$lib/components';
	import { Rss, Menu } from '@lucide/svelte';
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header>
	<nav class="space-container">
		<div class="logo">
			<a href="/">MALTSEV.SPACE</a>
		</div>

		<button class="mobile-menu-toggle" onclick={toggleMobileMenu} aria-label="Toggle menu">
			<Menu size={24} stroke-width={2.5} aria-hidden="true" />
		</button>

		<div class="nav-container" class:active={mobileMenuOpen}>
			<ul class="nav-links">
				<li><a href="/" onclick={() => (mobileMenuOpen = false)}>Home</a></li>
				<li><a href="/about" onclick={() => (mobileMenuOpen = false)}>About</a></li>
				<li><a href="/blog" onclick={() => (mobileMenuOpen = false)}>Blog</a></li>
				<li>
					<a
						href="/rss.xml"
						onclick={() => (mobileMenuOpen = false)}
						class="rss-link"
						aria-label="RSS Feed"
					>
						<Rss size={16} aria-hidden="true" />
					</a>
				</li>
			</ul>
			<ThemeSwitch />
		</div>
	</nav>
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

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		position: relative;
	}

	.nav-container {
		display: flex;
		align-items: center;
		gap: var(--gap);
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
	}

	.nav-links a {
		color: var(--text-2);
		text-decoration: none;
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-4);
		padding: var(--gap-small) var(--gap-small);
		border-radius: var(--radius-sm);
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast);
	}

	.nav-links a:hover {
		color: var(--text-1);
		background-color: color-mix(in srgb, var(--brand) 15%, transparent);
	}

	.mobile-menu-toggle {
		display: none;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 20;
		color: var(--text-1);
		transition: color var(--transition-fast);
	}

	.mobile-menu-toggle:hover {
		color: var(--accent);
	}

	@media (--md-n-below) {
		.nav-links {
			gap: var(--gap-small);
		}

		.logo a {
			font-size: var(--font-size-2);
		}
	}

	@media (--md-n-below) {
		.mobile-menu-toggle {
			display: flex;
		}

		header {
			height: var(--header-height);
		}

		nav {
			flex-direction: row;
			padding-block: var(--gap-small);
		}

		.logo a {
			font-size: var(--font-size-2);
			letter-spacing: 0.05em;
		}

		.nav-container {
			position: absolute;
			top: var(--header-height);
			left: 0;
			right: 0;
			flex-direction: column;
			background-color: var(--surface-1);
			border-bottom: 1px solid var(--surface-3);
			padding: var(--gap) var(--gap);
			transform: translateY(-100%);
			opacity: 0;
			visibility: hidden;
			transition: all var(--transition-fast);
			width: 100%;
		}

		.nav-container.active {
			transform: translateY(0);
			opacity: 1;
			visibility: visible;
		}

		.nav-links {
			flex-direction: column;
			align-items: center;
			width: 100%;
			margin-bottom: var(--gap);
		}

		.nav-links a {
			display: block;
			width: 100%;
			text-align: center;
			padding: var(--gap-small) 0;
			font-size: calc(var(--font-size-1) * 1.2);
		}
	}

	@media (--xs-n-below) {
		.logo a {
			font-size: var(--font-size-1);
			letter-spacing: 0;
		}
	}

	.rss-link {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.rss-link svg {
		width: 16px;
		height: 16px;
	}
</style>
