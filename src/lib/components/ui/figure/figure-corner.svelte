<!--
	@component
	Pins its content to a corner of `Figure.Media`, above the media.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		at: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
		children: Snippet;
	}

	const { at, children }: Props = $props();

	const position = {
		'top-left': 'top-3 left-3',
		'top-right': 'top-3 right-3',
		'bottom-left': 'bottom-3 left-3',
		'bottom-right': 'right-3 bottom-3'
	};
</script>

<div class="absolute z-2 flex {position[at]}">
	{@render children()}
</div>
