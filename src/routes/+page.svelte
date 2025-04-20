<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Card, Link, Badge } from '$lib/components/ui';

	let isVisible = $state(false);

	onMount(() => {
		setTimeout(() => {
			isVisible = true;
		}, 200);
	});

	const { data } = $props();
</script>

<div class="hero" class:visible={isVisible}>
	<div class="hero-content">
		<h1 class="space-title">Howdy, I'm Aleksey</h1>
		<p class="space-subtitle">Exploring Code, Ideas, and the Digital Universe</p>

		<div class="planet-container">
			<div class="planet">
				<div class="planet-shadow"></div>
			</div>
			<div class="orbit">
				<div class="moon"></div>
			</div>
		</div>

		<div class="cta-buttons">
			<Button href="/blog" elevated>Read Blog</Button>
			<Button href="/about" intent="secondary" elevated>About Me</Button>
		</div>
	</div>
</div>

<section class="latest-posts">
	<h2 class="space-heading">Latest Articles</h2>

	<div class="posts-grid">
		{#each data.posts as post}
			<a href={`/blog/${post.slug}`} class="card-link">
				<Card variant="elevated">
					<span class="post-date">{post.date}</span>
					<h3>{post.title}</h3>
					<p>{post.preview}</p>
				</Card>
			</a>
		{/each}

		<div class="view-all">
			<Link href="/blog" hasArrow={true}>View All Posts</Link>
		</div>
	</div>
</section>

<section class="about-preview">
	<div class="about-grid">
		<div class="about-text">
			<h2 class="space-heading">About Me</h2>
			<p>
				Senior Software Engineer at Infobip with focus on distributed systems and highload
				applications. Programming since 2014, previously at Veeam and SkbKontur.
			</p>
			<p>Creator of CarryFit and MongoTransit. Tech blogger and coding challenges enthusiast.</p>
			<Link href="/about" hasArrow={true}>Learn more about me</Link>
		</div>
		<div class="skills-container">
			<h3>Professional Interests:</h3>
			<div class="skills-grid">
				<Badge>Distributed Systems</Badge>
				<Badge>Highload Apps</Badge>
				<Badge>Database Internals</Badge>
				<Badge>System Design</Badge>
				<Badge>Performance</Badge>
				<Badge>Microservices</Badge>
				<Badge>NoSQL</Badge>
				<Badge>Cloud</Badge>
			</div>
		</div>
	</div>
</section>

<style>
	/* Hero section */
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-height: 80vh;
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 1s ease,
			transform 1s ease;
	}

	.hero.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-large);
	}

	.space-title {
		margin: 0;
		background: linear-gradient(90deg, var(--brand), var(--accent));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		text-shadow: 0 0 20px rgba(76, 170, 255, 0.3);
	}

	.space-subtitle {
		margin: 0;
		max-width: 60ch;
	}

	/* Planet animation */
	.planet-container {
		position: relative;
		width: 200px;
		height: 200px;
		margin: var(--gap) 0;
	}

	.planet {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: radial-gradient(circle at 30% 30%, var(--planet), var(--brand));
		box-shadow: 0 0 20px rgba(76, 170, 255, 0.4);
	}

	.planet-shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: linear-gradient(45deg, rgba(0, 0, 0, 0.5), transparent 70%);
	}

	.orbit {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 180px;
		height: 180px;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--text-2) 50%, transparent);
		animation: orbit-rotation 20s linear infinite;
	}

	.moon {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: var(--text-2);
	}

	@keyframes orbit-rotation {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	/* CTA Buttons */
	.cta-buttons {
		display: flex;
		gap: var(--gap);
		margin-top: var(--gap);
	}

	/* Latest Posts Section */
	.latest-posts {
		margin-top: var(--gap-large);
		margin-bottom: var(--gap-large);
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--gap);
		margin-top: var(--gap);
	}

	.card-link {
		text-decoration: none;
	}

	.post-date {
		font-size: var(--font-size-0);
		color: var(--accent);
	}

	.view-all {
		margin-top: var(--gap-large);
		text-align: center;
	}

	/* About section */
	.about-preview {
		margin-top: var(--gap-large);
		padding: var(--gap-large) 0;
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

	.skills-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-small);
	}

	/* Responsive design */
	@media (--lg-n-above) {
		.posts-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--gap-large);
		}

		.about-grid {
			grid-template-columns: 3fr 2fr;
			gap: calc(var(--gap-large) * 2);
		}
	}

	@media (--md-n-below) {
		.about-grid {
			grid-template-columns: 1fr;
		}

		.planet-container {
			width: 150px;
			height: 150px;
		}

		.planet {
			width: 80px;
			height: 80px;
		}

		.orbit {
			width: 140px;
			height: 140px;
		}
	}

	@media (--sm-n-below) {
		.cta-buttons {
			flex-direction: column;
			width: 100%;
			max-width: 200px;
		}
	}
</style>
