<script lang="ts">
	import { SEO } from '$lib/components';
	import { Container } from '$lib/components/layout';
	import { PillLinks, SectionHeading } from '$lib/components/ui';
	import {
		CareerTimeline,
		ChallengeList,
		HobbyList,
		Portrait,
		ProjectCard,
		StackList
	} from '$lib/components/about';
	import {
		bio,
		career,
		careerStart,
		challenges,
		challengesIntro,
		hobbies,
		projects
	} from '$lib/content';
	import avatar from '/static/images/ava.jpg?enhanced';

	const contacts = [
		{ label: bio.social.email, url: `mailto:${bio.social.email}` },
		{ label: 'GitHub', url: bio.social.github },
		{ label: 'LinkedIn', url: bio.social.linkedIn }
	];
</script>

<SEO
	title="About Me"
	description={`Learn about ${bio.fullName}, Software Developer at JetBrains. Programming since 2014, specializing in distributed systems, C#, Go, and highload applications. Previously at Infobip, Veeam and SkbKontur.`}
	url="/about"
	keywords={['about', 'software engineer', 'career', 'experience', 'distributed systems']}
/>

<Container>
	<section
		class="grid items-start gap-6 pt-14 pb-10 sm:pt-[72px] lg:grid-cols-[300px_1fr] lg:gap-16"
	>
		<Portrait src={avatar} alt={bio.fullName} />
		<div>
			<span class="eyebrow">About</span>
			<h1
				class="mt-2.5 mb-0 text-[clamp(38px,5vw,60px)]/[1.02] font-semibold tracking-[-0.02em] font-stretch-[112%]"
			>
				{bio.fullName}
			</h1>
			<p class="mt-2.5 mb-7 text-ink-2">{bio.role} at {bio.company}</p>
			{#each bio.about as paragraph (paragraph)}
				<p class="mt-0 mb-[1.1em] max-w-[36em]">{paragraph}</p>
			{/each}
			<p
				class="mt-0 mb-[1.1em] max-w-[36em] border-l-[3px] border-livery-3 pl-3.5 text-[15px] text-ink-2"
			>
				<b class="font-semibold text-ink">Fun fact:</b>
				{bio.funFact}
			</p>
			<StackList items={bio.stack} />
			<div class="mt-6">
				<PillLinks links={contacts} />
			</div>
		</div>
	</section>

	<section class="pt-10" aria-labelledby="projects">
		<SectionHeading id="projects" title="Side projects" aside="things I build for myself" />
		<div class="grid gap-5 lg:grid-cols-3">
			{#each projects as project (project.title)}
				<ProjectCard {project} />
			{/each}
		</div>
	</section>

	<section class="pt-10" aria-labelledby="trajectory">
		<SectionHeading id="trajectory" title="Trajectory" aside="since {careerStart}" />
		<CareerTimeline jobs={career} />
	</section>

	<section class="grid gap-6 pt-10 pb-24 lg:grid-cols-2 lg:gap-16">
		<div>
			<SectionHeading title="Off the clock" />
			<HobbyList {hobbies} />
		</div>
		<div>
			<SectionHeading title="Puzzles" />
			<p class="mt-0 mb-4 text-[15px] text-ink-2">{challengesIntro}</p>
			<ChallengeList {challenges} />
		</div>
	</section>
</Container>
