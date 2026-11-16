/** Display labels and livery colours for front-matter tags. `tags.json` is shared with the OG generator. */
import tags from './tags.json';

export interface TagStyle {
	label: string;
	color: string;
}

const tagMap: Record<string, { label: string; livery: number }> = tags;

export function tagStyle(tag: string): TagStyle {
	const known = tagMap[tag];
	return known
		? { label: known.label, color: `var(--color-livery-${known.livery})` }
		: { label: tag, color: 'var(--color-ink-3)' };
}

const series: Record<string, string> = {
	'Grokking Bloom Filters': 'From the classic filter to counting variants and cuckoo filters.'
};

export function seriesDescription(name: string): string | undefined {
	return series[name];
}
