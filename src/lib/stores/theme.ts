import { browser } from '$app/environment';
import { writable } from 'svelte/store';

/** `system` = Auto: follow the OS. The pre-paint script in app.html reads the same key. */
export type Theme = 'light' | 'system' | 'dark';

const STORAGE_KEY = 'theme';

function readSaved(): Theme {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved === 'light' || saved === 'dark' ? saved : 'system';
	} catch {
		return 'system';
	}
}

export const theme = writable<Theme>(browser ? readSaved() : 'system');

export function applyTheme(value: Theme) {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// Storage blocked: the choice just won't persist
	}

	if (value === 'system') {
		document.documentElement.removeAttribute('color-scheme');
	} else {
		document.documentElement.setAttribute('color-scheme', value);
	}
}

theme.subscribe(applyTheme);
