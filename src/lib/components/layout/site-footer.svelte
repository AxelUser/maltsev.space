<script lang="ts">
	import { bio } from '#lib/content/index.ts';
	import Container from './container.svelte';

	const links = [
		{ label: 'Email', href: `mailto:${bio.social.email}` },
		{ label: 'GitHub', href: bio.social.github },
		{ label: 'LinkedIn', href: bio.social.linkedIn },
		{ label: 'SoundCloud', href: bio.social.soundCloud },
		{ label: 'RSS', href: '/rss.xml' }
	];
</script>

<footer class="border-t border-line py-8">
	<Container class="flex flex-wrap items-center justify-between gap-4">
		<span class="eyebrow">© {new Date().getFullYear()} {bio.fullName}</span>
		<nav aria-label="Elsewhere" class="eyebrow flex flex-wrap gap-5">
			{#each links as link (link.label)}
				<a href={link.href} class="no-underline hover:text-ink">{link.label}</a>
			{/each}
		</nav>
	</Container>
</footer>
