<script>
	import { bio } from '$lib/bio';
</script>

<footer>
	<div class="space-container">
		<p class="space-text-small">
			© {new Date().getFullYear()} | {bio.fullName}
		</p>
	</div>
</footer>

<style>
	footer {
		min-height: var(--footer-height);
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		backdrop-filter: blur(5px);
		background-color: color-mix(in srgb, var(--surface-1) 90%, transparent);
		border-top: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
	}
</style>
