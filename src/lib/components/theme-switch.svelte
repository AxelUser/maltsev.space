<script lang="ts">
	import { theme, type Theme } from '$lib/stores/theme';
	import { Sun, Moon, Laptop } from '@lucide/svelte';

	const options = [
		{ value: 'light', label: 'Light theme', icon: Sun },
		{ value: 'dark', label: 'Dark theme', icon: Moon },
		{ value: 'system', label: 'System theme', icon: Laptop }
	] satisfies { value: Theme; label: string; icon: typeof Sun }[];
</script>

<div class="flex gap-1 rounded-md bg-surface-2 p-1">
	{#each options as { value, label, icon: Icon } (value)}
		<button
			class={[
				'flex size-8 items-center justify-center rounded-md transition-colors',
				$theme === value
					? 'bg-brand/30 text-fg-1'
					: 'bg-transparent text-fg-2 hover:bg-brand/15 hover:text-fg-1'
			]}
			onclick={() => theme.set(value)}
			title={label}
			aria-label={label}
			aria-pressed={$theme === value}
		>
			<Icon size={16} />
		</button>
	{/each}
</div>
