<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Link } from '$lib/components/ui';
	import { HeroPlanet, TagCloud, SEO, PostsGrid } from '$lib/components';
	import { bio } from '$lib/bio';
	import { OneColumnLayout } from '$lib/components/layouts';

	let isVisible = $state(false);

	onMount(() => {
		setTimeout(() => {
			isVisible = true;
		}, 200);
	});

	const { data } = $props();
</script>

<SEO
	title="Home"
	description={`${bio.fullName} - Senior Software Engineer at Infobip focusing on distributed systems and highload applications. Programming since 2014, sharing insights about C#, Go, system design, and performance optimization.`}
	url="/"
	keywords={['portfolio', 'blog', 'software engineering', 'distributed systems']}
/>

<OneColumnLayout>
	<div class="hero" class:visible={isVisible}>
		<h1>Howdy, I'm {bio.firstName}</h1>
		<p class="slogan">Space is dangerous — use tabs</p>

		<HeroPlanet />

		<div class="cta-buttons">
			<Button href="/blog">Read Blog</Button>
			<Button href="/about" intent="secondary">About Me</Button>
		</div>
	</div>

	<div class="info">
		<section>
			<h2 class="space-heading">Latest Articles</h2>

			<PostsGrid posts={data.posts} />

			<div class="view-all">
				<Link href="/blog" hasArrow={true}>View All Posts</Link>
			</div>
		</section>

		<section class="about-grid">
			<div class="about-text">
				<h2 class="space-heading">About Me</h2>
				<p>
					Senior Software Engineer at Infobip with focus on distributed systems and highload
					applications. Programming since 2014, previously at Veeam and SkbKontur.
				</p>
				<Link href="/about" hasArrow={true}>Learn more about me</Link>
			</div>
			<div class="skills-container">
				<h3>Professional Interests:</h3>
				<TagCloud tags={bio.interests} />
			</div>
		</section>
	</div>
</OneColumnLayout>

<style lang="postcss">
	@import 'open-props/media';

	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-height: 90vh;
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 1s ease,
			transform 1s ease;
		gap: var(--gap-large);

		h1 {
			margin: 0;
			background: linear-gradient(90deg, var(--brand), var(--accent));
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			text-shadow: 0 0 20px rgba(76, 170, 255, 0.3);
		}

		p {
			margin: 0;
			max-width: 60ch;
		}
	}

	.hero.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.cta-buttons {
		display: flex;
		gap: var(--gap);
		margin-top: var(--gap);
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: var(--gap-large);
	}

	.view-all {
		margin-top: var(--gap-large);
		text-align: center;
	}

	.about-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gap-large);
		align-items: start;
	}

	.about-text {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	.skills-container {
		background-color: var(--surface-2);
		padding: var(--gap);
		border-radius: var(--radius-base);
		box-shadow: var(--shadow-base);
	}

	.skills-container h3 {
		margin-top: 0;
		margin-bottom: var(--gap);
		font-size: var(--font-size-2);
		color: var(--text-2);
	}

	@media (--lg-n-above) {
		.about-grid {
			grid-template-columns: 3fr 2fr;
			gap: calc(var(--gap-large) * 2);
		}
	}

	@media (--md-n-below) {
		.about-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (--sm-n-below) {
		.cta-buttons {
			flex-direction: column;
			width: 100%;
			max-width: 200px;
		}

		.slogan {
			font-size: var(--font-size-3);
			padding: 0.4em;
		}
	}

	@media (--xs-n-below) {
		.slogan {
			font-size: var(--font-size-2);
			border-width: 1px;
			padding: 0.3em;
		}

		.hero h1 {
			font-size: var(--font-size-5);
		}
	}

	.slogan {
		font-size: var(--font-size-4);
		font-weight: 600;
		color: var(--accent);
		text-shadow: 0 0 15px rgba(76, 170, 255, 0.4);
		letter-spacing: 0.02em;
		padding: 0.5em;
		border: 2px solid var(--accent);
		border-radius: var(--radius-base);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
	}
</style>
