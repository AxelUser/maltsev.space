<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ContentCard from '$lib/components/content-card.svelte';
	import '../../app.css';
	import 'open-props/style';
	import 'open-props/normalize';
	import heroImage from './hero.jpg';

	const { Story } = defineMeta({
		title: 'UI/ContentCard',
		component: ContentCard,
		args: {
			href: '#',
			title: 'Sample Article Title',
			description:
				'This is a sample description for the content card. It demonstrates how the component looks with typical content.',
			date: '2025-01-06',
			image: heroImage,
			imageAlt: 'Sample hero image',
			tags: ['React', 'JavaScript', 'Web Development'],
			metadata: 'Engineering Blog'
		},
		argTypes: {
			href: { control: 'text' },
			title: { control: 'text' },
			description: { control: 'text' },
			date: { control: 'text' },
			image: { control: 'text' },
			imageAlt: { control: 'text' },
			imageDisplayMode: { control: 'select', options: ['top', 'cover'] },
			tags: { control: 'object' },
			activeTag: { control: 'text' },
			metadata: { control: 'text' },
			onTagClick: { action: 'tag-clicked' }
		}
	});
</script>

<Story name="Default" />

<Story
	name="With Image"
	args={{
		href: '#',
		title: 'Understanding Bloom Filters: A Deep Dive',
		description:
			'Learn about probabilistic data structures and how Bloom filters can help optimize your applications for faster lookups.',
		date: '2025-01-06',
		image: heroImage,
		imageAlt: 'Abstract visualization of bloom filters',
		tags: ['Data Structures', 'Algorithms', 'Performance'],
		metadata: 'Technical Article'
	}}
/>

<Story
	name="Image Top Placement"
	args={{
		href: '#',
		title: 'Modern Frontend Development',
		description:
			'Explore the latest trends and best practices in frontend development. Learn about component architecture, state management, and performance optimization.',
		date: '2025-01-06',
		image: heroImage,
		imageAlt: 'Modern frontend development workspace',
		imageDisplayMode: 'top',
		tags: ['Frontend', 'React', 'Performance'],
		metadata: 'Development Guide'
	}}
/>

<Story
	name="Image Cover Placement"
	args={{
		href: '#',
		title: 'Advanced CSS Techniques',
		description:
			'Discover advanced CSS techniques including custom properties, grid layouts, and modern animation patterns. Perfect for creating stunning user interfaces.',
		date: '2025-01-06',
		image: heroImage,
		imageAlt: 'CSS code and design patterns',
		imageDisplayMode: 'cover',
		tags: ['CSS', 'Design', 'Animation'],
		metadata: 'Design Tutorial'
	}}
/>

<Story
	name="Without Image"
	args={{
		href: '#',
		title: 'Getting Started with Svelte 5',
		description:
			'A comprehensive guide to the new features and improvements in Svelte 5, including runes, enhanced reactivity, and better TypeScript support.',
		date: '2025-01-05',
		tags: ['Svelte', 'Frontend', 'TypeScript'],
		metadata: 'Tutorial'
	}}
/>

<Story
	name="With Active Tag"
	args={{
		href: '#',
		title: 'Modern CSS Techniques for 2025',
		description:
			'Explore the latest CSS features and techniques including container queries, cascade layers, and new color spaces.',
		date: '2025-01-04',
		image: heroImage,
		imageAlt: 'Modern CSS code preview',
		tags: ['CSS', 'Frontend', 'Web Standards'],
		activeTag: 'CSS',
		metadata: 'Design Guide'
	}}
/>

<Story
	name="Long Title and Description"
	args={{
		href: '#',
		title:
			'Building Scalable Microservices Architecture with Domain-Driven Design Patterns and Event Sourcing',
		description:
			'A comprehensive exploration of how to design and implement scalable microservices using domain-driven design principles, event sourcing patterns, and modern deployment strategies. This article covers everything from initial architecture decisions to production deployment considerations.',
		date: '2025-01-03',
		image: heroImage,
		imageAlt: 'Microservices architecture diagram',
		tags: ['Architecture', 'Microservices', 'DDD', 'Event Sourcing', 'Scalability'],
		metadata: 'Architecture Deep Dive'
	}}
/>

<Story
	name="Minimal Content"
	args={{
		href: '#',
		title: 'Quick Tip',
		description: 'A short and sweet tip.',
		date: '2025-01-02'
	}}
/>

<Story
	name="With Many Tags"
	args={{
		href: '#',
		title: 'Full-Stack Web Development with Modern Tools',
		description:
			'Learn how to build complete web applications using the latest technologies and best practices.',
		date: '2025-01-01',
		image: heroImage,
		imageAlt: 'Full-stack development setup',
		tags: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Testing'],
		metadata: 'Complete Course'
	}}
/>

<Story
	name="Interactive Tags"
	args={{
		href: '#',
		title: 'Interactive Component Design',
		description:
			'Learn about creating interactive components with proper event handling and user feedback.',
		date: '2024-12-31',
		image: heroImage,
		imageAlt: 'Interactive UI components',
		tags: ['UI/UX', 'React', 'Svelte', 'Interaction Design'],
		onTagClick: (tag) => alert(`Clicked on tag: ${tag}`)
	}}
/>

<style>
	:global(.sb-show-main) {
		background: var(--surface-1);
		padding: 2rem;
	}
</style>
