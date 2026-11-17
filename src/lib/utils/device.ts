type NavigatorWithUAData = Navigator & { userAgentData?: { mobile: boolean } };

/**
 * Best-effort "is this a phone or tablet" check, for skipping battery-hungry work.
 * Client-only; returns `false` during server rendering.
 */
export function isMobileDevice(): boolean {
	if (typeof navigator === 'undefined') return false;
	const nav = navigator as NavigatorWithUAData;
	if (nav.userAgentData?.mobile) return true;
	if (/Android|iPhone|iPad|iPod|Mobile|Silk|Kindle/i.test(nav.userAgent)) return true;
	// iPadOS reports itself as a Mac; touch support gives it away.
	return nav.platform === 'MacIntel' && nav.maxTouchPoints > 1;
}
