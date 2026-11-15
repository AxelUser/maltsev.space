<script lang="ts">
	import { theme, type Theme } from '$lib/stores/theme';

	const options: { value: Theme; label: string; title: string }[] = [
		{ value: 'light', label: 'Day', title: 'Day theme' },
		{ value: 'system', label: 'Auto', title: 'Follow system theme' },
		{ value: 'dark', label: 'Night', title: 'Night theme' }
	];
</script>

<div class="inline-flex border border-line" role="group" aria-label="Colour scheme">
	{#each options as option, i (option.value)}
		<button
			type="button"
			title={option.title}
			aria-label={option.title}
			aria-pressed={$theme === option.value}
			onclick={() => theme.set(option.value)}
			class={[
				'inline-flex h-[34px] items-center gap-1.5 border-0 px-[7px] font-mono text-[11px] font-medium tracking-[0.1em] uppercase xs:px-[9px] lg:px-[11px]',
				i > 0 && 'border-l border-line',
				$theme === option.value ? 'bg-ink text-canvas' : 'bg-transparent text-ink-3 hover:text-ink'
			]}
		>
			<svg
				class="size-3.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				{#if option.value === 'light'}
					<circle cx="12" cy="12" r="4" />
					<path
						d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
					/>
				{:else if option.value === 'system'}
					<circle cx="12" cy="12" r="9" />
					<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
				{:else}
					<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
				{/if}
			</svg>
			<span class="max-lg:hidden">{option.label}</span>
		</button>
	{/each}
</div>
