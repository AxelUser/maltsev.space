<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { SimpleBloomFilter } from '$lib/components/visualization/bloom-filters';
	import '../../app.css';

	const { Story } = defineMeta({
		title: 'Visualization/BloomFilter',
		component: SimpleBloomFilter
	});
</script>

<Story name="BloomFilter" />
