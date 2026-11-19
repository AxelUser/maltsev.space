import type { Step } from '$lib/components/visualization/array-steps';
import {
	and,
	hex32,
	not,
	sub,
	u32,
	xor,
	type ByteLanesState
} from '$lib/components/visualization/byte-lanes';

// HasZero(v) = ((v - 0x01010101) & ~v & 0x80808080) != 0, on the XOR result from later in the post.
const v = 0x4462002e;
const minusOnes = u32(v - 0x01010101);
const marked = u32(minusOnes & ~v);

export const hasZeroSteps: Step<ByteLanesState>[] = [
	{
		caption:
			'Start with <code>v = 0x4462002E</code>. The byte at bits 15..8 is <code>0x00</code>: that is the zero byte we want to detect.',
		state: { rows: [{ value: v }], tone: { 1: 'ok' }, notes: { 1: 'zero byte' } }
	},
	{
		caption:
			'Subtract <code>0x01010101</code>. The zero byte wraps around to <code>0xFF</code>. This is one 32-bit subtraction, so the borrow crosses the byte boundary: <code>0x62</code> on its left becomes <code>0x60</code>.',
		state: {
			rows: sub(v, 0x01010101),
			tone: { 1: 'changed' },
			notes: { 1: 'wraps to FF', 2: 'lends the borrow' }
		}
	},
	{
		caption:
			'Invert the original <code>v</code>. Every bit flips, so the zero byte becomes <code>0xFF</code> here too.',
		state: { rows: not(v), tone: { 1: 'changed' } }
	},
	{
		caption:
			'AND the two results. Only the byte at bits 15..8 keeps its top bit set, because only there both sides had it: this bit is the marker for a zero byte.',
		state: { rows: and(minusOnes, u32(~v)), tone: { 1: 'ok' }, msb: true, notes: { 1: 'top bit is 1' } }
	},
	{
		caption: `<code>&amp; 0x80808080</code> keeps only the top bit of each byte. The result <code>${hex32(marked & 0x80808080)}</code> is not zero, so <code>HasZero</code> returns <code>true</code>.`,
		state: { rows: and(marked, 0x80808080), tone: { 1: 'ok' }, msb: true, notes: { 1: 'zero byte found' } }
	}
];

/** Searching for 0x56 in the bucket 0x12345678. */
export const xorExample: ByteLanesState = {
	rows: xor(0x12345678, 0x56565656),
	tone: { 1: 'ok' },
	notes: { 1: '56 ⊕ 56 is 00' }
};

/** Searching for 0xBB in a bucket that already holds an empty slot. */
export const existingZeroOther: ByteLanesState = {
	rows: xor(0xaa00ccdd, 0xbbbbbbbb),
	tone: { 2: 'changed' },
	notes: { 2: '00 becomes BB' }
};

/** Searching for 0x00, an empty slot, in the same bucket. */
export const existingZeroEmpty: ByteLanesState = {
	rows: xor(0xaa00ccdd, 0x00000000),
	tone: { 2: 'ok' },
	notes: { 2: 'stays 00' }
};
