<script lang="ts">
	import FloatingStars from '$lib/components/floating-stars.svelte';
	import { Timeline, TimelineItem, TagCloud } from '$lib/components';
	import { Card, Badge, Link, Button } from '$lib/components/ui';
	import { bio } from '$lib/bio';
</script>

<div class="about-page">
	<header class="about-header">
		<FloatingStars height={250} />
		<h1 class="space-title">About Me</h1>
	</header>

	<div class="about-content">
		<section class="section intro-section">
			<div class="avatar-container">
				<div class="avatar"></div>
				<div class="avatar-ring"></div>
			</div>

			<div class="intro-text">
				<h2 class="space-heading">Hello, I'm {bio.fullName}</h2>
				<p class="tagline">Senior Software Engineer</p>
				<p>
					I've been programming for fun and profit since 2014, focusing on distributed systems,
					highload applications, and database internals.
				</p>
			</div>
		</section>

		<section>
			<h2 class="space-heading">My Journey</h2>
			<Timeline>
				<TimelineItem date="2020–present">
					<h3 class="section-title">Infobip</h3>
					<p>
						As part of a distributed team, I developed and maintained over a dozen event-driven
						microservices that power real-time user segmentation. I was involved in migrating
						services and data from a MongoDB replica set to a sharded cluster, which improved
						performance significantly without any downtime. I also designed algorithms to balance
						workloads across services and independently created automation tools in Go and C# to
						support daily operations. Additionally, I contributed to documentation and led
						development on multiple data-related epics.
					</p>
				</TimelineItem>

				<TimelineItem date="2019–2020">
					<h3 class="section-title">Veeam</h3>
					<p>
						At Veeam, I worked on a RESTful integration between their Azure and Backup platforms,
						ensuring real-time synchronization of entities. I developed notification systems to
						provide progress tracking for long-running operations in the UI. I also led initiatives
						to improve engineering workflows, including a migration from TFS to Git and better code
						review tooling.
					</p>
				</TimelineItem>

				<TimelineItem date="2017–2019">
					<h3 class="section-title">SKB Kontur</h3>
					<p>
						I contributed to enhancing a flagship accounting product by implementing
						high-performance bulk operations that greatly reduced user wait times. I also built
						Chrome-based daemons via the DevTools protocol to power browser automation for key
						customers, expanding the product's capabilities.
					</p>
				</TimelineItem>

				<TimelineItem date="2018">
					<h3 class="section-title">Freelancer @ Upwork</h3>
					<p>
						During my time as a freelancer, I improved a Xamarin-based language learning app by
						optimizing UI rendering and implementing MVVM architecture. My changes significantly
						boosted app responsiveness and doubled daily active users. I also integrated robust
						local storage with SQLite and Realm
					</p>
				</TimelineItem>

				<TimelineItem date="2015–2017">
					<h3 class="section-title">Pro IT</h3>
					<p>
						I worked on .NET-based enterprise software, optimizing LINQ and SQL queries to double
						request throughput in edge cases. I developed admin dashboards to streamline operations
						and created an internal framework for automated Excel report generation, which
						accelerated future development efforts.
					</p>
				</TimelineItem>

				<TimelineItem date="2014–2015">
					<h3 class="section-title">KAI Development</h3>
					<p>
						My early work involved building internal dashboards to improve SEO workflows. I migrated
						performance-heavy logic to stored procedures in Transact-SQL, resulting in notable speed
						improvements for data-intensive processes.
					</p>
				</TimelineItem>

				<TimelineItem>
					<h3 class="section-title">Personal Projects</h3>
					<ul class="projects-list">
						<li>
							<Link href="https://carryon.fit/" external={true}>CarryFit</Link> – Carry-on luggage size
							checker.
						</li>
						<li>
							<Link href="https://github.com/AxelUser/MongoTransit" external={true}
								>MongoTransit</Link
							> – Data transfer tool for MongoDB clusters.
						</li>
						<li>
							<Link href="https://www.maltsev.space/" external={true}>Blog</Link> – Occasional posts
							on distributed systems and more.
						</li>
					</ul>
				</TimelineItem>
			</Timeline>
		</section>

		<section>
			<h2 class="space-heading">Professional Interests</h2>
			<Card variant="default">
				<TagCloud tags={bio.interests} />
			</Card>
		</section>

		<section>
			<h2 class="space-heading">Hobbies & Interests</h2>

			<div class="card-grid">
				<Card variant="elevated">
					<div class="interest-icon books"></div>
					<h3 class="section-title">Reading</h3>
					<p>
						I'm an avid reader, always looking to expand my knowledge and perspectives through books
						on technology, science, and other topics.
					</p>
				</Card>

				<Card variant="elevated">
					<div class="interest-icon climbing"></div>
					<h3 class="section-title">Rock Climbing</h3>
					<p>
						Rock climbing is one of my favorite physical activities, challenging both body and mind
						while connecting with nature.
					</p>
				</Card>

				<Card variant="elevated">
					<div class="interest-icon skiing"></div>
					<h3 class="section-title">Mountain Skiing</h3>
					<p>
						I enjoy mountain skiing as a winter activity, combining the thrill of speed with
						beautiful mountain landscapes.
					</p>
				</Card>
			</div>
		</section>

		<section>
			<h2 class="space-heading">Programming Challenges</h2>
			<p>
				I enjoy participating in coding challenges to sharpen my skills and explore new programming
				concepts.
			</p>

			<div class="card-grid">
				<Card variant="default">
					<h3 class="section-title">Advent of Code</h3>
					<p>I've completed multiple years of Advent of Code challenges:</p>
					<div class="badge-container">
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
					<h3 class="section-title">LeetCode</h3>
					<p>
						I practice algorithmic problem solving on LeetCode to improve my coding efficiency and
						understanding of data structures.
					</p>
					<div class="badge-container">
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

			<div class="button-group">
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

	.about-content {
		display: flex;
		flex-direction: column;
		gap: var(--gap-large);
	}

	section {
		margin-top: var(--gap);
	}

	.section-title {
		margin-top: var(--gap-small);
		margin-bottom: var(--gap-small);
		color: var(--text-1);
		font-size: var(--font-size-3);
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
		color: var(--text-1);
		text-shadow: 0 0 10px var(--brand);
		z-index: 1;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--gap);
		margin-top: var(--gap);
	}

	.button-group {
		display: flex;
		justify-content: center;
		gap: var(--gap);
		margin-top: var(--gap);
		flex-wrap: wrap;
	}

	.badge-container {
		display: flex;
		gap: var(--gap-small);
		flex-wrap: wrap;
	}
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

	.contact-section {
		text-align: center;
	}

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

		.button-group {
			flex-direction: column;
			align-items: center;
		}
	}

	.projects-list {
		padding-left: 1.5rem;
		margin: 0;
		color: var(--text-2);
	}

	.projects-list li {
		margin-bottom: var(--gap-small);
	}
</style>
