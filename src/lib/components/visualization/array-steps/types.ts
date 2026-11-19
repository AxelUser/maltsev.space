/**
 * Visual role of a cell. When not set explicitly it is derived:
 * a ✓/✗ mark gives `ok`/`bad`, a value that differs from the previous step gives `changed`,
 * a non-zero value gives `set`, anything else is plain.
 */
export type Tone = 'set' | 'changed' | 'ok' | 'bad' | 'muted';

/** One state of a bit / counter array, drawn as one row of cells. */
export interface ArrayState {
	/** Row label shown above the array. */
	label: string;
	/** Bits, counters or short words; `''` draws an empty cell. */
	cells: (number | string)[];
	/** Text with a ↓ above a cell. */
	marks?: Record<number, string>;
	/** Small text under a cell's index, e.g. who set that bit. */
	owners?: Record<number, string>;
	/** A ↑ under a cell with a short note. */
	notes?: Record<number, string>;
	/** Explicit tone per cell; overrides the derived one. */
	tone?: Record<number, Tone>;
	/** Curved arrows above the array for a value moving between cells; pair with a mark on `to`. */
	arcs?: { from: number; to: number }[];
}

/** One step of a Stepper story. */
export interface Step<S = ArrayState> {
	/** One or two sentences explaining the step. Trusted author HTML (`<code>`, `<strong>`). */
	caption: string;
	state: S;
}
