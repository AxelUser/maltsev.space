<script>
	import { bio } from '$lib/bio';
	import { OneColumnLayout } from '$lib/components/layouts';
</script>

<footer
	class="flex min-h-20 items-center justify-center border-t border-brand/30 bg-surface-1/90 text-center backdrop-blur-[5px]"
>
	<OneColumnLayout>
		<p>
			© {new Date().getFullYear()} | {bio.fullName}
		</p>
	</OneColumnLayout>
</footer>
