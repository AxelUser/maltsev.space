import type { PostContext } from '#lib/analytics/index.ts';

declare global {
	namespace App {
		interface PageData {
			analytics?: PostContext;
		}
	}
}

export {};
