import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Theme = 'dark' | 'light' | 'system';

const userTheme = browser ? (localStorage.getItem('theme') as Theme) || 'system' : 'system';

export const theme = writable<Theme>(userTheme);

export function applyTheme(newTheme: Theme) {
	if (!browser) return;

	localStorage.setItem('theme', newTheme);

	if (newTheme === 'system') {
		document.documentElement.removeAttribute('color-scheme');
	} else {
		document.documentElement.setAttribute('color-scheme', newTheme);
	}
}

theme.subscribe((value) => {
	applyTheme(value);
});
