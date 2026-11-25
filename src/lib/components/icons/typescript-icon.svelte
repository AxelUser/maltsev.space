<script lang="ts">
	interface Props {
		size?: string;
		class?: string;
	}

	const { size = '24px', class: className = '' }: Props = $props();
</script>

<svg width={size} height={size} class={className} viewBox="0 0 32 32" aria-hidden="true">
	<rect x="3" y="3" width="26" height="26" rx="3" fill="#3178c6" />
	<text
		x="26.5"
		y="25.5"
		text-anchor="end"
		font-family="Arial, sans-serif"
		font-weight="700"
		font-size="13"
		fill="#fff"
	>
		TS
	</text>
</svg>
