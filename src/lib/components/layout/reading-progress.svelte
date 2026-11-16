<script lang="ts">
	import { onMount } from 'svelte';

	let bar: HTMLDivElement;

	onMount(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			const max = document.documentElement.scrollHeight - innerHeight;
			bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
		};

		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		addEventListener('scroll', schedule, { passive: true });
		addEventListener('resize', schedule, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			removeEventListener('scroll', schedule);
			removeEventListener('resize', schedule);
		};
	});
</script>

<div
	bind:this={bar}
	class="livery h-1 origin-left will-change-transform"
	style:transform="scaleX(0)"
	role="presentation"
></div>
