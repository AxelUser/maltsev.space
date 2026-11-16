/** `true` → "AI Generated Image"; a tool name → "AI Generated Image · <tool>"; falsy → null. */
export function aiLabel(ai: boolean | string | undefined | null): string | null {
	if (!ai) return null;
	const tool = typeof ai === 'string' ? ai.trim() : '';
	return tool && tool !== 'true' ? `AI Generated Image · ${tool}` : 'AI Generated Image';
}
