import { type AnimationStep } from './types';
import { getHashPositions, hash1, hash2 } from './utils';

export class SimpleBloomFilter {
	private bitArray: boolean[];
	private readonly size: number;
	private readonly numHashFunctions: number;

	constructor(size: number, numHashFunctions: number) {
		this.size = size;
		this.numHashFunctions = numHashFunctions;
		this.bitArray = new Array(size).fill(false);
	}

	generateInsertSteps(str: string): AnimationStep[] {
		const steps: AnimationStep[] = [];
		const h1 = hash1(str, this.size);
		const h2 = hash2(str, this.size);

		// Step 1: Show first hash
		steps.push({ type: 'hash1', value: h1 });

		// Step 2: Show second hash
		steps.push({ type: 'hash2', value: h2 });

		// Step 3: Show binary representation
		const positions = getHashPositions(str, this.size, this.numHashFunctions);
		const binaryArray = new Array(this.size).fill('0');
		positions.forEach((pos) => (binaryArray[pos] = '1'));
		steps.push({ type: 'binary', value: binaryArray.join('') });

		// Step 4+: Set each bit
		positions.forEach((pos) => {
			const wasSet = this.bitArray[pos];
			steps.push({ type: 'setBit', index: pos, wasSet });
		});

		return steps;
	}

	generateCheckSteps(str: string): AnimationStep[] {
		const steps: AnimationStep[] = [];
		const h1 = hash1(str, this.size);
		const h2 = hash2(str, this.size);

		// Step 1: Show first hash
		steps.push({ type: 'hash1', value: h1 });

		// Step 2: Show second hash
		steps.push({ type: 'hash2', value: h2 });

		// Step 3: Show binary representation
		const positions = getHashPositions(str, this.size, this.numHashFunctions);
		const binaryArray = new Array(this.size).fill('0');
		positions.forEach((pos) => (binaryArray[pos] = '1'));
		steps.push({ type: 'binary', value: binaryArray.join('') });

		// Step 4+: Check each bit
		positions.forEach((pos) => {
			steps.push({ type: 'setBit', index: pos, wasSet: this.bitArray[pos] });
		});

		return steps;
	}

	insert(str: string): void {
		const positions = getHashPositions(str, this.size, this.numHashFunctions);
		positions.forEach((pos) => {
			this.bitArray[pos] = true;
		});
	}

	check(str: string): boolean {
		const positions = getHashPositions(str, this.size, this.numHashFunctions);
		return positions.every((pos) => this.bitArray[pos]);
	}

	getBitArray(): boolean[] {
		return [...this.bitArray];
	}

	reset(): void {
		this.bitArray.fill(false);
	}

	getHashValues(str: string): { h1: number; h2: number } {
		return {
			h1: hash1(str, this.size),
			h2: hash2(str, this.size)
		};
	}

	getBinaryRepresentation(str: string): string {
		const positions = getHashPositions(str, this.size, this.numHashFunctions);
		const binaryArray = new Array(this.size).fill('0');
		positions.forEach((pos) => (binaryArray[pos] = '1'));
		return binaryArray.join('');
	}

	getSize(): number {
		return this.size;
	}
}
