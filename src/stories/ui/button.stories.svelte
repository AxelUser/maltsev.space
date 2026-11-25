<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '#lib/components/ui/button.svelte';
	import '../../app.css';

	const { Story } = defineMeta({
		title: 'UI/Button',
		component: Button,
		args: { href: '#' },
		argTypes: {
			variant: { control: 'radio', options: ['primary', 'ghost'] },
			href: { control: 'text' }
		}
	});
</script>

<Story name="Primary" args={{ variant: 'primary' }}>
	{#snippet template(args)}
		<Button variant={args.variant} href={args.href}>Read the notes →</Button>
	{/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>
	{#snippet template(args)}
		<Button variant={args.variant} href={args.href}>About me</Button>
	{/snippet}
</Story>
