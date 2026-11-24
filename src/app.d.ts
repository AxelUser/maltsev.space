import type { PostContext } from '$lib/analytics';

declare global {
	namespace App {
		interface PageData {
			analytics?: PostContext;
		}
	}
}

export {};
