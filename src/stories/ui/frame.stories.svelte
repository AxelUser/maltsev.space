<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Frame from '$lib/components/ui/frame.svelte';
	import '../../app.css';
	import heroImage from './hero.jpg?enhanced';

	const { Story } = defineMeta({
		title: 'UI/Frame',
		component: Frame,
		args: { src: heroImage, sizes: '480px' },
		argTypes: {
			size: { control: 'radio', options: ['sm', 'md'] }
		}
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		<div class="group max-w-[480px]"><Frame {...args} /></div>
	{/snippet}
</Story>

<Story name="Small" args={{ size: 'sm' }}>
	{#snippet template(args)}
		<div class="group max-w-[320px]"><Frame {...args} /></div>
	{/snippet}
</Story>
