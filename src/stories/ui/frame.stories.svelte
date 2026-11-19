<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Frame from '$lib/components/ui/frame.svelte';
	import Picture from '$lib/components/ui/picture.svelte';
	import AiFlag from '$lib/components/ui/ai-flag.svelte';
	import * as HoverZoom from '$lib/components/ui/hover-zoom';
	import * as Figure from '$lib/components/ui/figure';
	import '../../app.css';
	import heroImage from './hero.jpg?enhanced';

	const { Story } = defineMeta({
		title: 'UI/Frame',
		component: Frame,
		argTypes: {
			size: { control: 'radio', options: ['sm', 'md'] },
			ratio: { control: 'radio', options: ['3/2', 'natural'] }
		}
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		<div class="max-w-[480px]">
			<Frame {...args}><Picture src={heroImage} sizes="480px" /></Frame>
		</div>
	{/snippet}
</Story>

<Story name="Small" args={{ size: 'sm' }}>
	{#snippet template(args)}
		<div class="max-w-[320px]">
			<Frame {...args}><Picture src={heroImage} sizes="320px" /></Frame>
		</div>
	{/snippet}
</Story>

<Story name="Natural ratio" args={{ ratio: 'natural' }}>
	{#snippet template(args)}
		<div class="max-w-[480px]">
			<Frame {...args}><Picture src={heroImage} sizes="480px" /></Frame>
		</div>
	{/snippet}
</Story>

<Story name="Hover zoom">
	{#snippet template(args)}
		<HoverZoom.Area class="max-w-[480px]">
			<Frame {...args}>
				<HoverZoom.Target>
					{#snippet child({ props })}<Picture {...props} src={heroImage} sizes="480px" />{/snippet}
				</HoverZoom.Target>
				<Figure.Corner at="top-left"><AiFlag /></Figure.Corner>
			</Frame>
		</HoverZoom.Area>
	{/snippet}
</Story>
