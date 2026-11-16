export interface Job {
	org: string;
	role: string;
	period: string;
	from: number;
	to: number | null;
	description: string;
	url?: string;
	tech: string[];
	highlights: string[];
}

export const career: Job[] = [
	{
		org: 'JetBrains',
		role: 'Software Developer',
		period: 'June 2026–present',
		from: 2026,
		to: null,
		description:
			'JetBrains is a global software company that builds developer tools and IDEs, including IntelliJ IDEA, PyCharm, Rider, and the Kotlin programming language.',
		url: 'https://www.jetbrains.com/',
		tech: ['C#', 'Kotlin'],
		highlights: []
	},
	{
		org: 'Infobip',
		role: 'Senior Software Engineer',
		period: 'August 2020–June 2026',
		from: 2020,
		to: 2026,
		description:
			'Infobip is a global Communications Platform as a Service (CPaaS) provider offering APIs for messaging, voice, video, and contact center services.',
		url: 'https://www.infobip.com/',
		tech: [
			'C#',
			'Kotlin',
			'Go (Golang)',
			'TypeScript',
			'React',
			'ASP.NET',
			'Spring Boot',
			'Kafka',
			'MongoDB'
		],
		highlights: [
			'Designed and implemented fault-tolerant architecture in Kotlin and C# for 4 real-time audience-segmentation services, processing up to 50,000 events per second. One delivered feature replaced an external product through internal dogfooding.',
			'Led a zero-downtime migration of 3 microservices and ~1 TB of data from a MongoDB replica set to a sharded cluster.',
			'Improved platform performance by optimizing MongoDB query p95 latency and redesigning the leader-election algorithm, achieving a 5–10× improvement in key technical metrics.',
			'Developed internal tools in C# and Go to automate maintenance and troubleshooting.'
		]
	},
	{
		org: 'Veeam Software',
		role: 'Software Engineer',
		period: 'August 2019–August 2020',
		from: 2019,
		to: 2020,
		description:
			'Veeam Software is the global leader in backup and data recovery solutions for virtual machines, serving over 550,000 customers across more than 30 countries.',
		url: 'https://www.veeam.com/',
		tech: ['C#', 'Azure', 'TypeScript', 'React', 'ASP.NET', 'PostgreSQL'],
		highlights: [
			'Built a RESTful integration between Veeam Backup for Azure and Veeam Backup & Replication using C#, ASP.NET Core, and Swagger-documented APIs.',
			'Implemented a real-time notification center in Veeam Backup for Azure using WebSockets.',
			'Engineered an event-driven data synchronization pipeline handling thousands of daily entity updates, ensuring eventual consistency between two major products.'
		]
	},
	{
		org: 'Kontur',
		role: 'Software Engineer',
		period: 'October 2017–August 2019',
		from: 2017,
		to: 2019,
		description:
			"Kontur is Russia's second-largest SaaS provider, offering 70+ cloud services for accounting, compliance, and e-government to 2.2 million business customers in Russia and abroad.",
		url: 'https://kontur.ru/',
		tech: ['C#', '.NET Framework', 'TypeScript', 'React', 'ASP.NET', 'WCF', 'MSSQL Server'],
		highlights: [
			'Delivered 5 enterprise features for Kontur Extern using C#/.NET and React for B2B clients.',
			'Refactored the monolithic backend by replacing the global context with scoped services in ASP.NET, enabling batch document processing per request.',
			'Migrated a legacy JavaScript UI to React, Redux, and TypeScript.'
		]
	},
	{
		org: 'Freelancing',
		role: 'Software Engineer',
		period: 'April 2018–December 2019',
		from: 2018,
		to: 2019,
		description: 'Independent contractor working on mobile application development.',
		url: 'https://www.upwork.com/',
		tech: ['C#', 'Xamarin', 'Android', 'Realm', 'MVVM'],
		highlights: [
			'Optimized the rendering pipeline of a Xamarin.Forms Android app, increasing frame rate from 30–35 FPS to a steady 55–60 FPS (+70%), significantly improving the user experience.',
			'Implemented custom caching and a full offline mode using the Realm database, reducing remote API calls and improving load times.',
			'Refactored legacy code into a clean MVVM architecture, shortening feature lead time and boosting unit-test coverage to nearly 90%.'
		]
	},
	{
		org: 'PRO IT',
		role: 'Software Developer',
		period: 'October 2015–August 2017',
		from: 2015,
		to: 2017,
		description:
			'PRO IT is a Russian software company developing web-based electronic document workflow systems for government agencies, with over 100 employees.',
		tech: ['C#', '.NET Framework', 'ASP.NET', 'React', 'MSSQL Server', 'LINQ'],
		highlights: [
			'Engineered a push-based scheduling daemon, reducing client polling traffic by approximately 80%.',
			'Developed self-service admin panels, enabling support staff to resolve ~90% of common tickets without involving engineers.',
			'Refactored a jQuery codebase to Knockout.js (MVVM), halving front-end defect rates and speeding up feature delivery.',
			'Optimized heavy LINQ queries in Entity Framework for Oracle, cutting average query latency from 1 minute to 4–5 seconds.'
		]
	},
	{
		org: 'Kai Development',
		role: 'Junior Software Engineer',
		period: 'December 2014–October 2015',
		from: 2014,
		to: 2015,
		description:
			'Kai Development is a Russian software engineering studio specializing in web-based business and government automation. Since 2007, the company has delivered 45+ projects, including the legal-tech spin-off XSUD for Russian ministries and major corporations.',
		url: 'https://kaidev.ru/',
		tech: [
			'C#',
			'.NET Framework',
			'PHP',
			'JavaScript',
			'Java',
			'Android',
			'MSSQL Server',
			'Transact-SQL'
		],
		highlights: [
			'Developed a jQuery-based WYSIWYG admin panel for the XSUD project blog and introduced semantic versioning for post markup in ASP.NET MVC, reducing publishing time and increasing click-through rates by ~35% within 4 months.',
			'Designed and launched an offline-capable Android app for the Safe-Childhood Map project within 2 months.',
			'Refactored CPU-heavy business logic into parameterized Microsoft SQL Server stored procedures, reducing p95 latency from 30 seconds to under 5 seconds.'
		]
	}
];

export const careerStart = Math.min(...career.map((job) => job.from));
