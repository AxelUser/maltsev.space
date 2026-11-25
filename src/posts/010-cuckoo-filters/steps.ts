import type { Step } from '#lib/components/visualization/array-steps/index.ts';

// Classic cuckoo hashing, 8 buckets of one slot.
// lime → 1 or 5; kiwi → 1 or 6; plum → 6 or 3.
export const cuckooKickout: Step[] = [
	{
		caption:
			'Insert <code>lime</code>. Its two candidate buckets are 1 and 5, and both are already taken.',
		state: {
			label: 'before the insert',
			cells: ['date', 'kiwi', '', '', 'fig', 'pear', 'plum', ''],
			marks: { 1: 'h1', 5: 'h2' },
			tone: { 1: 'bad', 5: 'bad' },
			arcs: []
		}
	},
	{
		caption:
			'Pick one of them, bucket 1. <code>lime</code> moves in and kicks out the current occupant, <code>kiwi</code>.',
		state: {
			label: 'lime placed',
			cells: ['date', 'lime', '', '', 'fig', 'pear', 'plum', ''],
			marks: { 1: 'lime' },
			notes: { 1: 'kiwi kicked out' },
			arcs: []
		}
	},
	{
		caption:
			'<code>kiwi</code> goes to its other bucket, 6. That one is full too, so <code>kiwi</code> takes it and kicks out <code>plum</code>.',
		state: {
			label: 'kiwi relocated',
			cells: ['date', 'lime', '', '', 'fig', 'pear', 'kiwi', ''],
			marks: { 6: 'kiwi' },
			notes: { 6: 'plum kicked out' },
			arcs: [{ from: 1, to: 6 }]
		}
	},
	{
		caption:
			'<code>plum</code> goes to its other bucket, 3, which is empty. The chain ends and every key has a home. If it kept hitting full buckets, the insert would give up after a fixed number of kicks, and the table would have to be resized.',
		state: {
			label: 'plum relocated',
			cells: ['date', 'lime', '', 'plum', 'fig', 'pear', 'kiwi', ''],
			marks: { 3: 'plum' },
			notes: { 3: 'was empty' },
			arcs: [{ from: 6, to: 3 }]
		}
	}
];
