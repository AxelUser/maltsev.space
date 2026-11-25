export const bio = {
	firstName: 'Aleksey',
	fullName: 'Aleksey Maltsev',
	role: 'Software Developer',
	company: 'JetBrains',
	about: [
		"I've been programming for fun and profit since 2014, focusing on distributed systems and highload applications. My main stack is C#, Kotlin, and TypeScript, but I'm also proficient in Go.",
		"I love programming because it feels like bringing something to life, something that quietly hums along, never gets tired, and might just keep running long after I'm gone."
	],
	funFact: "I was born on the 11th of April, just a day before Yuri Gagarin's flight. Poehali! 🚀",
	interests: [
		'C#',
		'Go',
		'Kotlin',
		'Fullstack',
		'Distributed Systems',
		'Highload Apps',
		'Database Internals',
		'System Design',
		'Performance',
		'Microservices',
		'NoSQL'
	],
	/** Keys of the `stack` registry in `#lib/components/icons/index.ts`. */
	stack: ['csharp', 'kotlin', 'typescript', 'go', 'svelte'] as const,
	social: {
		email: 'aleksey@maltsev.space',
		linkedIn: 'https://www.linkedin.com/in/dev-alexey-maltsev/',
		github: 'https://github.com/AxelUser',
		soundCloud: 'https://soundcloud.com/mlcv',
		twitter: '@axel_user'
	}
};
