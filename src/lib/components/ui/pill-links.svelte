<script lang="ts">
	interface Props {
		links: { label: string; url: string }[];
		size?: 'sm' | 'md';
	}

	const { links, size = 'md' }: Props = $props();

	const isExternal = (url: string) => url.startsWith('http');
</script>

<ul class={['m-0 flex list-none flex-wrap p-0', size === 'sm' ? 'gap-1.5' : 'gap-2.5']}>
	{#each links as link (link.url)}
		<li>
			<a
				href={link.url}
				target={isExternal(link.url) ? '_blank' : undefined}
				rel={isExternal(link.url) ? 'noopener noreferrer' : undefined}
				class={[
					'block border border-line-2 font-mono font-medium no-underline transition-colors hover:bg-ink hover:text-canvas',
					size === 'sm' ? 'px-2.5 py-1 text-[12.5px]' : 'px-3.5 py-2 text-[13px]'
				]}
			>
				{link.label}
			</a>
		</li>
	{/each}
</ul>
