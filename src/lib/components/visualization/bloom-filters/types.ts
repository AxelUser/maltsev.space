export type BloomFilterOperation = 'insert' | 'check';

export type AnimationStep =
	| { type: 'hash1'; value: number }
	| { type: 'hash2'; value: number }
	| { type: 'binary'; value: string }
	| { type: 'setBit'; index: number; wasSet: boolean };

export interface CheckResult {
	isMember: boolean;
	animationSteps: AnimationStep[];
}

export const DEFAULT_SIZE = 16;
export const DEFAULT_NUM_HASH_FUNCTIONS = 4;
