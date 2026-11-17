import { writable } from 'svelte/store';

/** Reader's choice to show animated covers; lasts until the page is reloaded. */
export const liveCoverEnabled = writable<boolean>(true);
