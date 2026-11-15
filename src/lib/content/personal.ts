export interface Project {
	title: string;
	url: string;
	/** Path to an app icon; projects without one get a monogram. */
	icon?: string;
	tech: string[];
	description: string;
}

export const projects: Project[] = [
	{
		title: 'CarryFit',
		url: 'https://carryon.fit/',
		icon: '/images/projects/carryfit.png',
		tech: ['Svelte 5', 'TailwindCSS', 'TypeScript'],
		description:
			"An online tool that helps travelers check if their carry-on luggage meets size requirements for different airlines worldwide. Simply enter your bag's dimensions to instantly see which of 150+ airlines will accept it as cabin baggage."
	},
	{
		title: 'HumbleHire',
		url: 'https://humblehire.cv/',
		icon: '/images/projects/humble-hire.png',
		tech: ['Svelte 5', 'TailwindCSS', 'TypeScript'],
		description:
			'HumbleHire is a free, open-source CV builder that runs entirely in your browser. You keep one master CV with your whole history in it, branch a tailored copy for each job you apply to, and export a clean PDF to send.'
	},
	{
		title: 'MongoTransit',
		url: 'https://github.com/AxelUser/MongoTransit',
		tech: ['C#', 'MongoDB'],
		description:
			'A tool for automatic replication of documents between MongoDB clusters. Supports iterative transfers, sharded collections, and configurable synchronization parameters, making it ideal for database migrations and data synchronization tasks.'
	}
];

export type HobbyIcon = 'reading' | 'climbing' | 'skiing';

export interface Hobby {
	icon: HobbyIcon;
	title: string;
	text: string;
}

export const hobbies: Hobby[] = [
	{
		icon: 'reading',
		title: 'Reading',
		text: 'I enjoy reading books on technology, science, and other topics to learn new things.'
	},
	{
		icon: 'climbing',
		title: 'Rock Climbing',
		text: 'I like rock climbing to stay active and enjoy the outdoors.'
	},
	{ icon: 'skiing', title: 'Mountain Skiing', text: 'I enjoy mountain skiing in the winter.' }
];

export interface Challenge {
	title: string;
	text: string;
	links: { label: string; url: string }[];
}

export const challengesIntro =
	'I enjoy participating in coding challenges to sharpen my skills and explore new programming concepts.';

export const challenges: Challenge[] = [
	{
		title: 'Advent of Code',
		text: "I've completed multiple years of Advent of Code challenges:",
		links: [
			{ label: '2023', url: 'https://github.com/AxelUser/aoc-2023-kt' },
			{ label: '2022', url: 'https://github.com/AxelUser/aoc-2022' },
			{ label: '2021', url: 'https://github.com/AxelUser/aoc-2021' },
			{ label: '2020', url: 'https://github.com/AxelUser/AdventOfCode2020' },
			{ label: '2017', url: 'https://github.com/AxelUser/advent-of-code-2017' }
		]
	},
	{
		title: 'LeetCode',
		text: 'I practice algorithmic problem solving on LeetCode to improve my coding efficiency and understanding of data structures.',
		links: [{ label: 'View Solutions', url: 'https://github.com/AxelUser/leetcode-kt' }]
	}
];
