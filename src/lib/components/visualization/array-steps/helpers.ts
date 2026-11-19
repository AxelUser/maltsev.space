import type { Tone } from './types';

/** `m` zero cells with 1 at each of `positions`, e.g. `bits(16, [3, 8, 14])`. */
export const bits = (m: number, positions: number[]): number[] =>
	Array.from({ length: m }, (_, i) => (positions.includes(i) ? 1 : 0));

/** `m` counters, zero except the given `{ position: value }` entries. */
export const counters = (m: number, values: Record<number, number>): number[] =>
	Array.from({ length: m }, (_, i) => values[i] ?? 0);

/** The same `text` mark over each of `positions`, e.g. `marksAt([1, 4, 7], '+1')`. */
export const marksAt = (positions: number[], text: string): Record<number, string> =>
	Object.fromEntries(positions.map((p) => [p, text]));

/** The same tone for each of `positions`. */
export const toneAt = (positions: number[], tone: Tone): Record<number, Tone> =>
	Object.fromEntries(positions.map((p) => [p, tone]));
