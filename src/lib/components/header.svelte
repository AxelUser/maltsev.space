<script>
	import { ThemeSwitch } from '$lib/components';
</script>

<header>
	<nav class="space-container">
		<div class="logo">
			<a href="/">MALTSEV.SPACE</a>
		</div>
		<div class="nav-container">
			<ul class="nav-links">
				<li><a href="/">Home</a></li>
				<li><a href="/about">About</a></li>
				<li><a href="/blog">Blog</a></li>
			</ul>
			<ThemeSwitch />
		</div>
	</nav>
</header>

<style>
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

	@media (--md-n-below) {
		.nav-links {
			gap: var(--gap-small);
		}
	}

	@media (--sm-n-below) {
		nav {
			flex-direction: column;
			padding-block: var(--gap-small);
			gap: var(--gap-small);
		}

		header {
			height: auto;
			min-height: var(--header-height);
		}

		.nav-container {
			width: 100%;
			justify-content: space-between;
		}

		.nav-links {
			gap: var(--gap-small);
		}
	}
</style>
