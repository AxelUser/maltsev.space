<script lang="ts">
	interface Props {
		size?: string;
		class?: string;
	}

	const { size = '24px', class: className = '' }: Props = $props();
</script>

<svg width={size} height={size} class={className} viewBox="0 0 32 32" aria-hidden="true">
	<path
		d="M1 12.5h6M2.5 16h5M1 19.5h5"
		stroke="#00ADD8"
		stroke-width="1.8"
		stroke-linecap="round"
	/>
	<text
		x="19.5"
		y="21.5"
		text-anchor="middle"
		font-family="Arial Black, Arial, sans-serif"
		font-weight="900"
		font-style="italic"
		font-size="14.5"
		fill="#00ADD8"
	>
		GO
	</text>
</svg>
