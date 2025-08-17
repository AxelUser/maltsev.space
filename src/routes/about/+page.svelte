<script lang="ts">
	import Nebula from '$lib/components/nebula.svelte';
	import { Timeline, TimelineItem, TagCloud, SEO } from '$lib/components';
	import { Card, Badge, Link } from '$lib/components/ui';
	import { bio } from '$lib/bio';
	import { OneColumnLayout } from '$lib/components/layouts';
</script>

<SEO
	title="About Me"
	description={`Learn about ${bio.fullName}, Senior Software Engineer at Infobip. Programming since 2014, specializing in distributed systems, C#, Go, and highload applications. Previously at Veeam and SkbKontur.`}
	url="/about"
	keywords={['about', 'software engineer', 'career', 'experience', 'distributed systems']}
/>

<OneColumnLayout>
	<div class="about-page">
		<header class="about-header">
			<Nebula />
			<h1 class="space-title">About Me</h1>
		</header>

		<div class="about-content">
			<section class="intro-section">
				<div class="avatar-container">
					<img src="/images/ava.jpg" alt="Avatar" class="avatar" loading="lazy" />
					<div class="avatar-ring"></div>
				</div>

				<div class="intro-text">
					<h2 class="space-heading">Hello, I'm {bio.fullName}</h2>
					<p class="tagline">Senior Software Engineer</p>
					<div class="intro-text-content">
						<p>
							I've been programming for fun and profit since 2014, focusing on distributed systems
							and highload applications. My main stack is <b>C#</b>, <b>Kotlin</b>, and
							<b>TypeScript</b>, but I'm also proficient in <b>Go</b>.
						</p>
						<p>
							<b>Fun fact:</b> I was born on the 11th of April, just a day before Yuri Gagarin's flight.
							Poehali! 🚀
						</p>
					</div>
				</div>

				<div class="contact-information">
					<div class="button-group">
						<Link href={`mailto:${bio.social.email}`} external={true}>{bio.social.email}</Link>
						<Link href={bio.social.github} external={true}>GitHub</Link>
						<Link href={bio.social.linkedIn} external={true}>LinkedIn</Link>
					</div>
				</div>
			</section>

			<section>
				<h2 class="space-heading">My Journey</h2>
				<Timeline>
					<TimelineItem
						date="August 2020–present"
						title="Infobip"
						role="Senior Software Engineer"
						companyDescription="Infobip is a global Communications-Platform-as-a-Service (CPaaS) provider offering APIs for messaging, voice, video, and contact center services."
						companyUrl="https://www.infobip.com/"
						technologies={[
							'C#',
							'Kotlin',
							'Go',
							'TypeScript',
							'React',
							'ASP.NET',
							'Spring Boot',
							'Kafka',
							'MongoDB'
						]}
					>
						<ul>
							<li>
								Led a zero-downtime migration of 3 microservices and approximately 1 TB of data from
								a MongoDB replica set to a sharded cluster
							</li>
							<li>
								Improved platform performance by optimizing bottleneck queries, reducing p95 latency
								by 5 to 10 times
							</li>
							<li>
								Designed and implemented a fault-tolerant architecture in Kotlin and C# for 4
								real-time audience segmentation microservices, processing ~10,000 events per second
							</li>
							<li>
								Delivered a segmentation feature that replaced an external product via "dogfooding".
							</li>
							<li>Developed internal CLI and CI/CD tools, replacing manual work with automation</li>
						</ul>
					</TimelineItem>

					<TimelineItem
						date="August 2019–August 2020"
						title="Veeam Software"
						role="Software Engineer"
						companyDescription="Veeam Software is the global leader in backup and data recovery solutions for virtual machines, serving over 550,000 customers across more than 30 countries."
						companyUrl="https://www.veeam.com/"
						technologies={['C#', 'Azure', 'TypeScript', 'React', 'ASP.NET', 'PostgreSQL']}
					>
						<ul>
							<li>
								Integrated a RESTful microservice connecting Veeam Backup for Microsoft Azure with
								Veeam Backup & Replication using C#, .NET Core 3.1, ASP.NET Core, and
								Swagger-documented APIs
							</li>
							<li>
								Engineered an event-driven pipeline ensuring sub-1-second for daily entity updates,
								maintaining eventual data consistency through SignalR, PostgreSQL, and Entity
								Framework Core
							</li>
							<li>
								Implemented a real-time notification center in the web UI, reducing status-check
								time from 6 clicks to a single click via React, TypeScript, and SignalR
							</li>
						</ul>
					</TimelineItem>

					<TimelineItem
						date="October 2017–August 2019"
						title="Kontur"
						role="Software Engineer"
						companyDescription="Kontur is Russia's second-largest SaaS provider, offering 70+ cloud services for accounting, compliance, and e-government to 2.2 million business customers in Russia and abroad."
						companyUrl="https://kontur.ru/"
						technologies={[
							'C#',
							'.NET Framework',
							'TypeScript',
							'React',
							'ASP.NET',
							'WCF',
							'MSSQL Server'
						]}
					>
						<ul>
							<li>
								Delivered 5 enterprise features for Kontur Extern using C#/.NET and React,
								supporting over 800,000 B2B clients
							</li>
							<li>
								Refactored the monolithic backend by replacing global context with scoped services
								in ASP.NET, enabling batch processing of 1,000+ documents per request
							</li>
							<li>
								Migrated legacy JavaScript UI to React, Redux, and TypeScript, cutting feature
								delivery time by 6 to 10 hours per task
							</li>
						</ul>
					</TimelineItem>

					<TimelineItem
						date="April 2018–December 2019"
						title="Freelancing"
						role="Software Engineer"
						companyDescription="Independent contractor working on mobile application development."
						companyUrl="https://www.upwork.com/"
						technologies={['C#', 'Xamarin', 'Android', 'Realm', 'MVVM']}
					>
						<ul>
							<li>
								Optimized the rendering pipeline of a Xamarin.Forms Android app, increasing frame
								rate from 30–35 fps to a steady 55–60 fps (+70%), significantly enhancing user
								experience
							</li>
							<li>
								Implemented custom caching and full offline mode using Realm database, reducing
								remote API calls and improving load times
							</li>
							<li>
								Refactored legacy code to clean MVVM architecture, shortening feature lead time and
								boosting unit-test coverage to nearly 90%
							</li>
						</ul>
					</TimelineItem>

					<TimelineItem
						date="October 2015–August 2017"
						title="PRO IT"
						role="Software Developer"
						companyDescription="PRO IT is a Russian software company developing web-based electronic document workflow systems for government agencies, employing over 100 staff."
						technologies={['C#', '.NET Framework', 'ASP.NET', 'React', 'MSSQL Server', 'LINQ']}
					>
						<ul>
							<li>
								Engineered a push-based scheduling daemon, reducing client polling traffic by
								approximately 80%
							</li>
							<li>
								Developed self-service admin panels, enabling support staff to resolve ~90% of
								common tickets without engineering involvement
							</li>
							<li>
								Refactored a jQuery codebase to Knockout.js (MVVM), halving front-end defect rates
								and accelerating feature delivery
							</li>
							<li>
								Optimized heavy LINQ queries in Entity Framework for Oracle, cutting average latency
								from 1 minute to 4–5 seconds
							</li>
						</ul>
					</TimelineItem>

					<TimelineItem
						date="December 2014–October 2015"
						title="Kai Development"
						role="Junior Software Engineer"
						companyDescription="Kai Development is a Russian software engineering studio specializing in web-based business and government automation. Since 2007, the company has delivered 45+ projects, including the legal-tech spin-off XSUD for Russian ministries and major corporations."
						companyUrl="https://kaidev.ru/"
						technologies={[
							'C#',
							'.NET Framework',
							'PHP',
							'JavaScript',
							'Java',
							'Android',
							'MSSQL Server',
							'Transact-SQL'
						]}
					>
						<ul>
							<li>
								Developed a jQuery-based WYSIWYG admin panel for the XSUD project blog and
								introduced semantic versioning of post markup in ASP.NET MVC, reducing publishing
								time and increasing click-through rates by approximately 35% within 4 months
							</li>
							<li>
								Designed and launched an offline-capable Android app for the Safe-Childhood Map
								project within 2 months
							</li>
							<li>
								Refactored CPU-heavy business logic into parameterized Microsoft SQL Server stored
								procedures, reducing p95 latency from 30 seconds to under 5 seconds
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
				<h2 class="space-heading">Personal Projects</h2>
				<div class="card-grid">
					<Card>
						<div class="project-icon">
							<img src="/images/projects/carryfit.png" alt="CarryFit icon" loading="lazy" />
						</div>
						<h3 class="section-title">CarryFit</h3>
						<p>
							An online tool that helps travelers check if their carry-on luggage meets size
							requirements for different airlines worldwide. Simply enter your bag's dimensions to
							instantly see which of 150+ airlines will accept it as cabin baggage.
						</p>
						<div class="badge-container">
							<Badge>SvelteKit</Badge>
							<Badge>TailwindCSS</Badge>
							<Badge>TypeScript</Badge>
						</div>
						<div class="project-link">
							<Link href="https://carryon.fit/" external={true}>Visit Site</Link>
						</div>
					</Card>

					<Card>
						<div class="project-icon">
							<img src="/images/projects/humble-hire.png" alt="HumbleHire icon" loading="lazy" />
						</div>
						<h3 class="section-title">HumbleHire</h3>
						<p>
							A small, growing collection of helpers to make your profile look great and your
							application flow smoother.
						</p>
						<div class="badge-container">
							<Badge>Svelte 5</Badge>
							<Badge>TailwindCSS</Badge>
							<Badge>TypeScript</Badge>
						</div>
						<div class="project-link">
							<Link href="http://humblehire.maltsev.space/" external={true}>Visit Site</Link>
						</div>
					</Card>

					<Card>
						<div class="project-icon">🔄</div>
						<h3 class="section-title">MongoTransit</h3>
						<p>
							A tool for automatic replication of documents between MongoDB clusters. Supports
							iterative transfers, sharded collections, and configurable synchronization parameters,
							making it ideal for database migrations and data synchronization tasks.
						</p>
						<div class="badge-container">
							<Badge>C#</Badge>
							<Badge>MongoDB</Badge>
						</div>
						<div class="project-link">
							<Link href="https://github.com/AxelUser/MongoTransit" external={true}
								>View on GitHub</Link
							>
						</div>
					</Card>
				</div>
			</section>

			<section>
				<h2 class="space-heading">Hobbies & Interests</h2>

				<div class="card-grid">
					<Card>
						<div class="interest-icon books">📚</div>
						<h3 class="section-title">Reading</h3>
						<p>
							I enjoy reading books on technology, science, and other topics to learn new things.
						</p>
					</Card>

					<Card>
						<div class="interest-icon climbing">🧗</div>
						<h3 class="section-title">Rock Climbing</h3>
						<p>I like rock climbing to stay active and enjoy the outdoors.</p>
					</Card>

					<Card>
						<div class="interest-icon skiing">⛷️</div>
						<h3 class="section-title">Mountain Skiing</h3>
						<p>I enjoy mountain skiing in the winter.</p>
					</Card>
				</div>
			</section>

			<section>
				<h2 class="space-heading">Programming Challenges</h2>
				<p>
					I enjoy participating in coding challenges to sharpen my skills and explore new
					programming concepts.
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
								<Link href="https://github.com/AxelUser/AdventOfCode2020" external={true}>2020</Link
								>
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
		</div>
	</div>
</OneColumnLayout>

<style>
	@import 'open-props/media';
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
		justify-content: flex-start;
		gap: var(--gap);
		margin-top: var(--gap);
		flex-wrap: wrap;
	}

	.badge-container {
		display: flex;
		gap: var(--gap-small);
		flex-wrap: wrap;
		margin-top: var(--gap-small);
		margin-bottom: var(--gap-small);
	}

	.project-icon {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: var(--surface-3);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-1);
		font-size: var(--font-size-5);
		margin-bottom: var(--gap-small);
	}

	.project-icon img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}

	.project-link {
		margin-top: var(--gap-small);
	}

	.intro-section {
		display: grid;
		grid-template-columns: 1fr 4fr;
		grid-template-areas: 'avatar intro' 'social social';
		column-gap: var(--gap-large);
		row-gap: var(--gap);
		align-items: center;
	}

	.avatar-container {
		grid-area: avatar;
		position: relative;
		width: 200px;
		height: 200px;
		flex-shrink: 0;
	}

	.avatar {
		width: 180px;
		height: 180px;
		border-radius: 50%;
		object-fit: cover;
		object-position: center;
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
		grid-area: intro;
		flex: 1;
	}

	.intro-text h2 {
		margin-top: 0;
	}

	.intro-text-content {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
	}

	.contact-information {
		display: flex;
		justify-content: space-around;
		grid-area: social;
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

	@media (--lg-n-below) {
		.intro-section {
			grid-template-columns: 1fr;
			grid-template-areas: 'avatar' 'intro' 'social';
			text-align: center;
			gap: var(--gap);

			.avatar-container {
				justify-self: center;
			}
		}

		.intro-text .space-heading {
			justify-self: center;
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
			gap: var(--gap-small);
		}
	}
</style>
