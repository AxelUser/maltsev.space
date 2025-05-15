<script lang="ts">
	import { theme, type Theme } from '$lib/stores/theme';
	import { Sun, Moon, Laptop } from '@lucide/svelte';

	const setTheme = (newTheme: Theme) => {
		theme.set(newTheme);
	};
</script>

<div class="theme-switch">
	<button
		class="theme-button"
		class:active={$theme === 'light'}
		onclick={() => setTheme('light')}
		title="Light theme"
		aria-label="Light theme"
	>
		<Sun size={16} />
	</button>
	<button
		class="theme-button"
		class:active={$theme === 'dark'}
		onclick={() => setTheme('dark')}
		title="Dark theme"
		aria-label="Dark theme"
	>
		<Moon size={16} />
	</button>
	<button
		class="theme-button"
		class:active={$theme === 'system'}
		onclick={() => setTheme('system')}
		title="System theme"
		aria-label="System theme"
	>
		<Laptop size={16} />
	</button>
</div>

<style>
	.theme-switch {
		display: flex;
		gap: var(--gap-small);
		background-color: var(--surface-2);
		padding: 4px;
		border-radius: var(--radius-sm);
	}

	.theme-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border: none;
		background: transparent;
		color: var(--text-2);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			background-color var(--transition-fast),
			color var(--transition-fast);
	}

	.theme-button:hover {
		background-color: color-mix(in srgb, var(--brand) 15%, transparent);
		color: var(--text-1);
	}

	.theme-button.active {
		background-color: color-mix(in srgb, var(--brand) 30%, transparent);
		color: var(--text-1);
	}
</style>
