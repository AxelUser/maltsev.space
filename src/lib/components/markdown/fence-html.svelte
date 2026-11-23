<!--
	@component
	Prints the HTML that a fence plugin built for a ```svgbob or ```mermaid fence. mdsvex also
	passes the fence source as `children`, and this component doesn't render it.
-->
<script lang="ts">
	interface Props {
		/** Trusted HTML from `src/lib/plugins/svgbob-tones.js` or `zombie-mermaid.js`. */
		html?: string;
	}

	const { html = '' }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- generated at build time from the post's own fence -->
{@html html}
