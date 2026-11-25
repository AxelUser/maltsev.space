<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Tag from '#lib/components/ui/tag.svelte';
	import '../../app.css';

	const { Story } = defineMeta({
		title: 'UI/Tag',
		component: Tag,
		args: { tag: 'C#' },
		argTypes: {
			tag: { control: 'select', options: ['C#', 'Bitwise', 'MongoDB', 'Algorithms', 'Unknown'] }
		}
	});
</script>

<Story name="Livery colour" />
<Story name="Unmapped tag" args={{ tag: 'Rust' }} />
