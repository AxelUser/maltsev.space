import type { Component } from 'svelte';
import CSharpIcon from './csharp-icon.svelte';
import GoIcon from './go-icon.svelte';
import KotlinIcon from './kotlin-icon.svelte';
import SvelteIcon from './svelte-icon.svelte';
import TypeScriptIcon from './typescript-icon.svelte';

type IconProps = { size?: string; class?: string };

/** Languages and tools with a logo. `bio.stack` picks which ones are shown and in what order. */
export const stack = {
	csharp: { name: 'C#', icon: CSharpIcon },
	kotlin: { name: 'Kotlin', icon: KotlinIcon },
	typescript: { name: 'TypeScript', icon: TypeScriptIcon },
	go: { name: 'Go', icon: GoIcon },
	svelte: { name: 'Svelte', icon: SvelteIcon }
} satisfies Record<string, { name: string; icon: Component<IconProps> }>;

export type StackKey = keyof typeof stack;
