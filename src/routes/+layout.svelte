<script lang="ts">
	import { Header, Footer, TwinklingStars } from '$lib/components';
	import '../app.css';

	const { children } = $props();
</script>

<div class="space-layout">
	<Header />
	<TwinklingStars />
	<main>
		<div class="space-container">
			{@render children()}
		</div>
	</main>

	<Footer />
</div>

<style>
	.space-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--surface-1);
		position: relative;
		overflow-x: hidden;
		z-index: 0;
	}

	main {
		flex: 1;
		padding-block: var(--gap-large);
	}
</style>
