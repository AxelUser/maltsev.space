<script lang="ts">
	import FloatingStars from '$lib/components/floating-stars.svelte';
	import { Card, Badge, Link, Button } from '$lib/components/ui';
</script>

<div class="about-page">
	<header class="about-header">
		<FloatingStars height={250} />
		<h1 class="space-title">About Me</h1>
	</header>

	<div class="about-content">
		<section class="intro-section">
			<div class="avatar-container">
				<div class="avatar"></div>
				<div class="avatar-ring"></div>
			</div>

			<div class="intro-text">
				<h2 class="space-heading">Hello, I'm Alex Maltsev</h2>
				<p class="tagline">Senior Software Engineer</p>
				<p>
					I've been programming for fun and profit since 2014, focusing on distributed systems,
					highload applications, and database internals.
				</p>
			</div>
		</section>

		<section class="bio-section">
			<h2 class="space-heading">My Journey</h2>
			<div class="timeline">
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-content">
						<h3>Current Position</h3>
						<p>
							I'm currently working as a Senior Software Engineer at
							<Link href="https://github.com/infobip" external={true}>Infobip</Link>, where I
							continue to develop my expertise in distributed systems and high-load applications.
						</p>
					</div>
				</div>

				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-content">
						<h3>Previous Experience</h3>
						<p>
							I've previously worked at
							<Link href="https://www.veeam.com/" external={true}>Veeam</Link>
							and
							<Link href="https://github.com/skbkontur" external={true}>SkbKontur</Link>, where I
							gained valuable experience in software development and engineering practices.
						</p>
					</div>
				</div>

				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-content">
						<h3>Projects</h3>
						<p>
							I'm the developer of
							<Link href="https://carryon.fit/" external={true}>CarryFit</Link>, an online carry-on
							luggage compliance checker, and
							<Link href="https://github.com/AxelUser/MongoTransit" external={true}
								>MongoTransit</Link
							>, a tool for transferring data between MongoDB clusters.
						</p>
					</div>
				</div>

				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-content">
						<h3>Tech Blogging</h3>
						<p>
							I maintain a tech blog at
							<Link href="https://www.maltsev.space/" external={true}>maltsev.space</Link>
							where I share insights and experiences from my work in software development.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="skills-section">
			<h2 class="space-heading">Professional Interests</h2>

			<div class="skills-categories">
				<Card variant="default">
					<h3>Technical Focus</h3>
					<ul class="skill-list">
						<li>Distributed Systems</li>
						<li>Highload Applications</li>
						<li>Database Internals</li>
						<li>Software Architecture</li>
						<li>System Design</li>
						<li>Performance Optimization</li>
						<li>Scalability Solutions</li>
					</ul>
				</Card>

				<Card variant="default">
					<h3>Programming</h3>
					<ul class="skill-list">
						<li>Backend Development</li>
						<li>Data Engineering</li>
						<li>Cloud Infrastructure</li>
						<li>RESTful APIs</li>
						<li>Microservices</li>
						<li>NoSQL Databases</li>
						<li>Containerization</li>
					</ul>
				</Card>

				<Card variant="default">
					<h3>Practices</h3>
					<ul class="skill-list">
						<li>System Reliability</li>
						<li>Continuous Integration</li>
						<li>Test-Driven Development</li>
						<li>Code Quality</li>
						<li>Technical Documentation</li>
						<li>Performance Monitoring</li>
						<li>DevOps Culture</li>
					</ul>
				</Card>
			</div>
		</section>

		<section class="interests-section">
			<h2 class="space-heading">Hobbies & Interests</h2>

			<div class="interests-container">
				<Card variant="elevated">
					<div class="interest-icon books"></div>
					<h3>Reading</h3>
					<p>
						I'm an avid reader, always looking to expand my knowledge and perspectives through books
						on technology, science, and other topics.
					</p>
				</Card>

				<Card variant="elevated">
					<div class="interest-icon climbing"></div>
					<h3>Rock Climbing</h3>
					<p>
						Rock climbing is one of my favorite physical activities, challenging both body and mind
						while connecting with nature.
					</p>
				</Card>

				<Card variant="elevated">
					<div class="interest-icon skiing"></div>
					<h3>Mountain Skiing</h3>
					<p>
						I enjoy mountain skiing as a winter activity, combining the thrill of speed with
						beautiful mountain landscapes.
					</p>
				</Card>
			</div>
		</section>

		<section class="projects-section">
			<h2 class="space-heading">Programming Challenges</h2>
			<p>
				I enjoy participating in coding challenges to sharpen my skills and explore new programming
				concepts.
			</p>

			<div class="projects-grid">
				<Card variant="default">
					<h3>Advent of Code</h3>
					<p>I've completed multiple years of Advent of Code challenges:</p>
					<div class="project-links">
						<Badge interactive={true}>
							<Link href="https://github.com/AxelUser/aoc-2023-kt" external={true}>2023</Link>
						</Badge>
						<Badge interactive={true}>
							<Link href="https://github.com/AxelUser/aoc-2022" external={true}>2022</Link>
						</Badge>
						<Badge interactive={true}>
							<Link href="https://github.com/AxelUser/aoc-2021" external={true}>2021</Link>
						</Badge>
						<Badge interactive={true}>
							<Link href="https://github.com/AxelUser/AdventOfCode2020" external={true}>2020</Link>
						</Badge>
						<Badge interactive={true}>
							<Link href="https://github.com/AxelUser/advent-of-code-2017" external={true}
								>2017</Link
							>
						</Badge>
					</div>
				</Card>

				<Card variant="default">
					<h3>LeetCode</h3>
					<p>
						I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
						understanding of data structures.
					</p>
					<div class="project-links">
						<Badge interactive={true}>
							<Link href="https://github.com/AxelUser/leetcode-kt" external={true}
								>View Solutions</Link
							>
						</Badge>
					</div>
				</Card>
			</div>
		</section>

		<section class="contact-section">
			<h2 class="space-heading">Contact</h2>
			<p>Interested in collaborating or just want to say hello? Feel free to reach out.</p>

			<div class="contact-links">
				<Button href="mailto:contact@maltsev.space">Email</Button>
				<Button
					href="https://github.com/AxelUser"
					onclick={() => window.open('https://github.com/AxelUser', '_blank')}
				>
					GitHub
				</Button>
				<Button
					href="https://www.linkedin.com/in/dev-alexey-maltsev/"
					onclick={() => window.open('https://www.linkedin.com/in/dev-alexey-maltsev/', '_blank')}
				>
					LinkedIn
				</Button>
				<Button
					href="https://www.maltsev.space/"
					onclick={() => window.open('https://www.maltsev.space/', '_blank')}
				>
					Blog
				</Button>
			</div>
		</section>
	</div>
</div>

<style>
	.about-page {
		padding-bottom: var(--gap-large);
	}

	.about-header {
		height: 250px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		margin-bottom: var(--gap-large);
	}

	.about-header .space-title {
		font-size: var(--font-size-8);
		color: var(--space-text);
		text-shadow: 0 0 10px var(--space-primary);
		z-index: 1;
	}

	.about-content {
		display: flex;
		flex-direction: column;
		gap: var(--gap-large);
	}

	/* Intro section */
	.intro-section {
		display: flex;
		gap: var(--gap-large);
		align-items: center;
	}

	.avatar-container {
		position: relative;
		width: 200px;
		height: 200px;
		flex-shrink: 0;
	}

	.avatar {
		width: 180px;
		height: 180px;
		border-radius: 50%;
		background: linear-gradient(45deg, var(--brand), var(--accent));
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.avatar-ring {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 2px solid var(--brand);
		animation: pulse 3s infinite ease-in-out;
	}

	@keyframes pulse {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(var(--brand), 0.7);
		}
		70% {
			transform: scale(1);
			box-shadow: 0 0 0 15px rgba(var(--brand), 0);
		}
		100% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(var(--brand), 0);
		}
	}

	.intro-text {
		flex: 1;
	}

	.intro-text h2 {
		margin-top: 0;
	}

	.tagline {
		font-size: var(--font-size-3);
		color: var(--text-2);
		margin-bottom: var(--gap);
	}

	/* Bio section */
	.bio-section {
		position: relative;
	}

	.timeline {
		margin-top: var(--gap-large);
		position: relative;
		padding-left: 30px;
	}

	.timeline:before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 2px;
		background: linear-gradient(to bottom, var(--brand), var(--accent));
	}

	.timeline-item {
		position: relative;
		margin-bottom: var(--gap-large);
	}

	.timeline-dot {
		position: absolute;
		left: -34px;
		top: 5px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: var(--accent);
		border: 3px solid var(--surface-1);
	}

	.timeline-content h3 {
		margin: 0 0 var(--gap-small) 0;
		color: var(--text-1);
		font-size: var(--font-size-3);
	}

	.timeline-content p {
		margin: 0;
		color: var(--text-2);
	}

	.timeline-content a {
		color: var(--link);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.timeline-content a:hover {
		color: var(--accent);
		text-decoration: underline;
	}

	/* Skills Section */
	.skills-section {
		margin-top: var(--gap-large);
	}

	.skills-categories {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--gap-large);
		margin-top: var(--gap);
	}

	.skills-categories h3 {
		margin-top: 0;
		margin-bottom: var(--gap);
		color: var(--text-1);
		font-size: var(--font-size-3);
		padding-bottom: var(--gap-small);
		border-bottom: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
	}

	.skill-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.skill-list li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: var(--gap-small);
		color: var(--text-2);
	}

	.skill-list li:before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5em;
		width: 0.5rem;
		height: 0.5rem;
		background-color: var(--accent);
		border-radius: 50%;
	}

	/* Interests Section */
	.interests-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--gap);
		margin-top: var(--gap);
	}

	.interests-container h3 {
		margin-top: var(--gap);
		margin-bottom: var(--gap-small);
		color: var(--text-1);
		font-size: var(--font-size-3);
	}

	.interests-container p {
		color: var(--text-2);
		margin: 0;
	}

	.interest-icon {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: var(--surface-3);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-1);
		font-size: var(--font-size-5);
	}

	/* Projects Section */
	.projects-section {
		padding: var(--space-gap) 0;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--gap);
		margin-top: var(--gap);
	}

	.projects-grid h3 {
		margin-top: 0;
		margin-bottom: var(--gap-small);
		color: var(--text-1);
		font-size: var(--font-size-3);
	}

	.projects-grid p {
		margin: 0 0 var(--gap) 0;
		color: var(--text-2);
	}

	.project-links {
		display: flex;
		gap: var(--gap-small);
		flex-wrap: wrap;
	}

	/* Contact Section */
	.contact-section {
		margin-top: var(--gap-large);
		text-align: center;
	}

	.contact-links {
		display: flex;
		justify-content: center;
		gap: var(--gap);
		margin-top: var(--gap);
		flex-wrap: wrap;
	}

	/* Responsive */
	@media (--lg-n-below) {
		.intro-section {
			flex-direction: column;
			text-align: center;
			gap: var(--gap);
		}
	}

	@media (--md-n-below) {
		.about-header {
			height: 200px;
		}

		.timeline {
			padding-left: 20px;
		}

		.timeline-dot {
			left: -24px;
		}
	}

	@media (--sm-n-below) {
		.about-header {
			height: 150px;
		}

		.avatar-container {
			width: 150px;
			height: 150px;
		}

		.avatar {
			width: 130px;
			height: 130px;
		}

		.timeline-dot {
			width: 12px;
			height: 12px;
			left: -20px;
		}

		.contact-links {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
