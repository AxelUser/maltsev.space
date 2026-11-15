<script lang="ts">
	import { tagStyle } from '$lib/content';

	const { tag }: { tag: string } = $props();

	const style = $derived(tagStyle(tag));
</script>

<span
	class="chevron inline-block py-0.5 pr-2.5 pl-3.5 font-mono text-[12px]/[1.5] font-medium tracking-normal whitespace-nowrap text-on-livery normal-case [--cut:6px]"
	style:background={style.color}
>
	{style.label}
</span>
