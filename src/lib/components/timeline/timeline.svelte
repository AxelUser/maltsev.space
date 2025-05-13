<script lang="ts">
</script>

<div class="timeline">
	<slot />
</div>

<style>
	@import 'open-props/media';
	.timeline {
		margin-top: var(--gap-large);
		position: relative;
		padding-left: 30px;
	}

	.timeline:before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 2px;
		background: linear-gradient(to bottom, var(--brand), var(--accent));
	}

	@media (--md-n-below) {
		.timeline {
			padding-left: 20px;
		}
	}
</style>
