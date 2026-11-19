import { bits, counters, marksAt, toneAt, type Step } from '$lib/components/visualization/array-steps';

// Classic filter, m = 10. A → 0, 5, 8; B → 5, 7, 9.
export const naiveDeletion: Step[] = [
	{
		caption:
			'Insert A (0, 5, 8) and then B (5, 7, 9). Bit 5 is already set by A, so it simply stays 1.',
		state: {
			label: 'after A and B',
			cells: bits(10, [0, 5, 7, 8, 9]),
			marks: { 0: 'A', 5: 'A,B', 7: 'B', 8: 'A', 9: 'B' },
			tone: toneAt([0, 5, 7, 8, 9], 'changed')
		}
	},
	{
		caption:
			'"Delete" A by resetting bits 0, 5 and 8 to 0. Bit 5 goes too, although B still needs it.',
		state: {
			label: 'after deleting A',
			cells: bits(10, [7, 9]),
			marks: marksAt([0, 5, 8], '0'),
			tone: { 5: 'bad' },
			notes: { 5: 'B still needed this bit' }
		}
	},
	{
		caption:
			'Query B: bit 5 is 0, so the filter says B is <strong>definitely not</strong> present, although B was never deleted. That is a <strong>false negative</strong>.',
		state: {
			label: 'after deleting A',
			cells: bits(10, [7, 9]),
			marks: { 5: '✗', 7: '✓', 9: '✓' }
		}
	}
];

// Counting filter, m = 10. A → 1, 4, 7; B → 4, 6, 9.
export const countingInsertDelete: Step[] = [
	{
		caption: 'Insert A: counters 1, 4 and 7 go up by one.',
		state: {
			label: 'after A',
			cells: counters(10, { 1: 1, 4: 1, 7: 1 }),
			marks: marksAt([1, 4, 7], '+1'),
			tone: toneAt([1, 4, 7], 'changed')
		}
	},
	{
		caption: 'Insert B: counters 4, 6 and 9 go up. Counter 4 is now 2, because both A and B use it.',
		state: {
			label: 'after A and B',
			cells: counters(10, { 1: 1, 4: 2, 6: 1, 7: 1, 9: 1 }),
			marks: marksAt([4, 6, 9], '+1'),
			notes: { 4: 'shared by A and B' }
		}
	},
	{
		caption: 'Delete A: counters 1, 4 and 7 go down by one. Counter 4 only drops to 1.',
		state: {
			label: 'after deleting A',
			cells: counters(10, { 4: 1, 6: 1, 9: 1 }),
			marks: marksAt([1, 4, 7], '−1'),
			notes: { 4: 'still 1: B survives' }
		}
	},
	{
		caption:
			'Query B: counters 4, 6 and 9 are all above zero, so B is still found. The delete that caused a false negative in the classic filter is safe here.',
		state: {
			label: 'after deleting A',
			cells: counters(10, { 4: 1, 6: 1, 9: 1 }),
			marks: marksAt([4, 6, 9], '✓')
		}
	}
];

// Counting filter, m = 10. A → 1, 5, 7, 9; B (never inserted) → 1, 3, 7, 8.
export const deleteNonExistent: Step[] = [
	{
		caption: 'Insert A: counters 1, 5, 7 and 9 go up by one.',
		state: {
			label: 'after A',
			cells: counters(10, { 1: 1, 5: 1, 7: 1, 9: 1 }),
			marks: marksAt([1, 5, 7, 9], '+1'),
			tone: toneAt([1, 5, 7, 9], 'changed')
		}
	},
	{
		caption:
			'Delete B, which was never inserted. Counters 3 and 8 are already 0, so the underflow guard skips them, but counters 1 and 7 belong to A and go down to 0.',
		state: {
			label: 'after deleting B',
			cells: counters(10, { 5: 1, 9: 1 }),
			marks: { 1: '−1', 3: 'skip', 7: '−1', 8: 'skip' },
			tone: toneAt([1, 7], 'bad')
		}
	},
	{
		caption:
			'Query A: counters 1 and 7 are 0, so the filter says A is <strong>not present</strong>, although A was never deleted. That is a <strong>false negative</strong>.',
		state: {
			label: 'after deleting B',
			cells: counters(10, { 5: 1, 9: 1 }),
			marks: { 1: '✗', 5: '✓', 7: '✗', 9: '✓' }
		}
	}
];
