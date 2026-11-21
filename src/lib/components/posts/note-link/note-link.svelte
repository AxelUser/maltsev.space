<!--
	@component
	Root of every link to a note. It is the hover group for `NoteTitle` and `NoteArrow` and the
	zoom area for `NoteThumb`, and sets the accent. `boxed` adds HUD brackets that
	light up in the accent, with a surface fill. Lay out the children with `class`.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';

	interface Props {
		href: string;
		boxed?: boolean;
		class?: ClassValue;
		children: Snippet;
	}

	const { href, boxed = false, class: className, children }: Props = $props();
</script>

<a
	{href}
	class={cn(
		'group group/zoom block text-ink no-underline [--accent:var(--color-livery-1)]',
		boxed &&
			'hud transition-colors hover:bg-surface hover:[--hud-c:var(--accent)] focus-visible:[--hud-c:var(--accent)]',
		className
	)}
>
	{@render children()}
</a>
