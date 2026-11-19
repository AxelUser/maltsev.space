/** Byte lane of a 32-bit value: 3 is the leftmost byte (bits 31..24), 0 the rightmost (bits 7..0). */
export type Lane = 0 | 1 | 2 | 3;

/** Visual role of a lane in the last row; same palette as ArrayView tones. */
export type LaneTone = 'changed' | 'ok' | 'bad' | 'muted';

export type ByteOp = '−' | '¬' | '&' | '⊕';

/** One line of a column calculation, e.g. `− 0x01010101`. */
export interface ByteRow {
	/** Operator drawn left of the value. */
	op?: ByteOp;
	/** Unsigned 32-bit value. */
	value: number;
	/** Draws the rule above this row (the `\hline` of a column calculation). */
	result?: boolean;
}

/** A 32-bit value, or a column calculation, split into four 8-bit lanes. */
export interface ByteLanesState {
	rows: ByteRow[];
	/** Tone per lane, applied to the last row. */
	tone?: Partial<Record<Lane, LaneTone>>;
	/** A ↑ under a lane with a short note. */
	notes?: Partial<Record<Lane, string>>;
	/** Emphasise the most significant bit of every lane in the last row. */
	msb?: boolean;
}
