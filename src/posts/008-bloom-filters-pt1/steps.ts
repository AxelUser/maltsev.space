import { bits, toneAt, type Step } from '$lib/components/visualization/array-steps';

// m = 16, k = 3. apple → 3, 8, 14; grape → 1, 7, 11; banana → 3, 5, 14; cherry → 3, 7, 11.
const afterApple = bits(16, [3, 8, 14]);
const afterGrape = bits(16, [1, 3, 7, 8, 11, 14]);

export const insertAndQuery: Step[] = [
	{
		caption:
			'Insert <code>"apple"</code>. Its three hashes point at 3, 8 and 14, and those bits become 1.',
		state: {
			label: 'after apple',
			cells: afterApple,
			marks: { 3: 'h1', 8: 'h2', 14: 'h3' },
			tone: toneAt([3, 8, 14], 'changed')
		}
	},
	{
		caption: 'Insert <code>"grape"</code>, which hashes to 1, 7 and 11.',
		state: {
			label: 'after apple, grape',
			cells: afterGrape,
			marks: { 1: 'h1', 7: 'h2', 11: 'h3' }
		}
	},
	{
		caption:
			'Query <code>"banana"</code>, which hashes to 3, 5 and 14. Bit 5 is 0, so banana is <strong>definitely not</strong> in the set.',
		state: {
			label: 'after apple, grape',
			cells: afterGrape,
			marks: { 3: '✓', 5: '✗', 14: '✓' }
		}
	},
	{
		caption:
			'Query <code>"cherry"</code>, which hashes to 3, 7 and 11. All three bits are 1, so the filter says <strong>maybe</strong>. But cherry was never inserted: bit 3 was set by apple, bits 7 and 11 by grape. That is a <strong>false positive</strong>.',
		state: {
			label: 'after apple, grape',
			cells: afterGrape,
			marks: { 3: '✓', 7: '✓', 11: '✓' },
			owners: { 3: 'apple', 7: 'grape', 11: 'grape' }
		}
	}
];
