// djb2 hash
export function hash1(str: string, m: number): number {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0; // `>>> 0` keeps it an unsigned 32-bit integer
	}
	return hash % m;
}

// sdbm hash
export function hash2(str: string, m: number): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash) >>> 0;
	}

	let result = hash % m;

	// The step must be non-zero, otherwise every probe lands on the same slot
	if (result === 0) {
		result = 1;
	}

	// With an even m, an even step can only reach half of the slots
	if (m % 2 === 0 && result % 2 === 0) {
		result = result === m - 1 ? 1 : result + 1;
	}

	return result;
}

// Unlike `%`, never returns a negative result
function mod(n: number, m: number): number {
	return ((n % m) + m) % m;
}

// Double hashing: position_i = h1 + i * h2 (mod m)
export function getHashPositions(str: string, m: number, k: number): number[] {
	if (!str || m <= 0 || k <= 0) {
		return [];
	}

	const h1 = hash1(str, m);
	const h2 = hash2(str, m);

	const positions: number[] = [];
	for (let i = 0; i < k; i++) {
		const pos = mod(h1 + i * h2, m);
		positions.push(pos);
	}

	return positions.sort((a, b) => a - b);
}
