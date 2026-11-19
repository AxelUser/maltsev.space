import type { ByteRow } from './types';

/** JS bitwise operators return signed 32-bit numbers; this maps them back to `uint`. */
export const u32 = (x: number): number => x >>> 0;

/** `a − b` as a column calculation; the result wraps around like `uint` subtraction. */
export const sub = (a: number, b: number): ByteRow[] => [
	{ value: u32(a) },
	{ op: '−', value: u32(b) },
	{ value: u32(a - b), result: true }
];

/** `¬a` (C# `~a`). */
export const not = (a: number): ByteRow[] => [
	{ op: '¬', value: u32(a) },
	{ value: u32(~a), result: true }
];

/** `a & b`. */
export const and = (a: number, b: number): ByteRow[] => [
	{ value: u32(a) },
	{ op: '&', value: u32(b) },
	{ value: u32(a & b), result: true }
];

/** `a ^ b`. */
export const xor = (a: number, b: number): ByteRow[] => [
	{ value: u32(a) },
	{ op: '⊕', value: u32(b) },
	{ value: u32(a ^ b), result: true }
];

/** `0x4462002E` style: lower-case prefix, upper-case digits, always 8 digits. */
export const hex32 = (x: number): string =>
	'0x' + u32(x).toString(16).toUpperCase().padStart(8, '0');
