<script lang="ts">
	import { theme, type Theme } from '$lib/stores/theme';
	import { Sun, Moon, Laptop } from '@lucide/svelte';

	const buttonClass =
		'flex size-[30px] items-center justify-center bg-transparent text-fg-2 transition-colors hover:bg-brand/15 hover:text-fg-1';

	const setTheme = (newTheme: Theme) => {
		theme.set(newTheme);
	};
</script>

<div class="flex gap-2 bg-surface-2 p-1">
	<button
		class={[buttonClass, $theme === 'light' && 'bg-brand/30 text-fg-1 hover:bg-brand/30']}
		onclick={() => setTheme('light')}
		title="Light theme"
		aria-label="Light theme"
	>
		<Sun size={16} />
	</button>
	<button
		class={[buttonClass, $theme === 'dark' && 'bg-brand/30 text-fg-1 hover:bg-brand/30']}
		onclick={() => setTheme('dark')}
		title="Dark theme"
		aria-label="Dark theme"
	>
		<Moon size={16} />
	</button>
	<button
		class={[buttonClass, $theme === 'system' && 'bg-brand/30 text-fg-1 hover:bg-brand/30']}
		onclick={() => setTheme('system')}
		title="System theme"
		aria-label="System theme"
	>
		<Laptop size={16} />
	</button>
</div>
