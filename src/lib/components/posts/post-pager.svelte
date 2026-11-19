<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { getPostHeroImage } from '$lib/utils';
	import { Picture } from '$lib/components/ui';

	interface Props {
		older?: PostPreview;
		newer?: PostPreview;
	}

	const { older, newer }: Props = $props();

	const links = $derived(
		[
			older && {
				href: `/blog/${older.slug}`,
				label: '← Previous',
				title: older.title,
				post: older
			},
			newer
				? { href: `/blog/${newer.slug}`, label: 'Next →', title: newer.title, post: newer }
				: { href: '/blog', label: 'Index', title: 'All notes →', post: older }
		].filter((link) => link !== undefined)
	);
</script>

<nav class="mt-14 grid gap-4 sm:grid-cols-2" aria-label="More notes">
	{#each links as link (link.href)}
		<a
			href={link.href}
			class="grid grid-cols-[96px_1fr] items-center gap-4 border border-line p-3.5 no-underline transition-colors hover:border-line-2 hover:bg-surface"
		>
			<Picture
				src={link.post && getPostHeroImage(link.post.slug)}
				sizes="96px"
				class="aspect-[3/2] h-auto shrink-0 bg-surface w-24"
			/>
			<span>
				<span class="eyebrow block">{link.label}</span>
				<span class="mt-1 block font-display text-[15.5px]/[1.35] font-medium">{link.title}</span>
			</span>
		</a>
	{/each}
</nav>
