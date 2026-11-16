<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';
	import { HudBox } from '$lib/components/ui';

	interface Props {
		href: string;
		image: EnhancedImageSrc;
		kicker: string;
		title: string;
		text: string;
		round?: boolean;
	}

	const { href, image, kicker, title, text, round = false }: Props = $props();
</script>

<HudBox
	{href}
	class="grid grid-cols-[72px_1fr] items-center gap-6 p-[26px] md:grid-cols-[96px_1fr]"
>
	<enhanced:img
		src={image}
		alt=""
		sizes="96px"
		loading="lazy"
		class={[
			'size-[72px] object-cover md:size-24',
			round && 'rounded-full shadow-[0_0_0_4px_var(--color-canvas),0_0_0_5px_var(--color-line-2)]'
		]}
	/>
	<div>
		<span class="eyebrow">{kicker}</span>
		<h3 class="my-1 text-[22px] font-semibold font-stretch-[110%]">{title}</h3>
		<p class="m-0 text-[15px] text-ink-2">{text}</p>
	</div>
</HudBox>
