import { browser } from '$app/environment';

type NavigatorWithUAData = Navigator & { userAgentData?: { mobile: boolean } };

/** Best-effort phone/tablet check. Always `false` on the server. */
export function isMobileDevice(): boolean {
	// Not `typeof navigator`: Node 21+ defines a global navigator too.
	if (!browser) return false;
	const nav = navigator as NavigatorWithUAData;
	if (nav.userAgentData?.mobile) return true;
	if (/Android|iPhone|iPad|iPod|Mobile|Silk|Kindle/i.test(nav.userAgent)) return true;
	// iPadOS reports itself as a Mac.
	return nav.platform === 'MacIntel' && nav.maxTouchPoints > 1;
}
