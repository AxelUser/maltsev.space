<script lang="ts">
	import type { HobbyIcon } from '#lib/content/index.ts';

	interface Props {
		name: HobbyIcon;
		class?: string;
	}

	const { name, class: className }: Props = $props();

	const paths: Record<HobbyIcon, string> = {
		reading: 'M3 6c3-1.5 6-1.5 9 .5 3-2 6-2 9-.5v12c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z M12 6.5v12',
		climbing: 'M2 20l7-12 4 6 3-4 6 10z M9 8l1.5-3 M10.5 5l2 .5',
		skiing: 'M3 17l18-6 M5 21l18-6 M14 5a1.6 1.6 0 1 0 0.1 0 M9 13l3-4 3 2 2-1'
	};
</script>

<svg
	class={className}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={paths[name]} />
</svg>
