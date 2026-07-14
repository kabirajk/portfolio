import { readable, writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * The id of the single Quest Log card currently allowed to play its video.
 * `null` means nothing is playing. Setting this to another id (or null) is what
 * tells every other card to unmount its iframe, so only one plays at a time.
 * @type {import('svelte/store').Writable<string | null>}
 */
export const activeCardId = writable(null);

/**
 * Live reflection of the user's `prefers-reduced-motion` setting.
 * Autoplay, foil shimmer and stack fan-out all gate on this.
 */
export const prefersReducedMotion = readable(false, (set) => {
	if (!browser) return;
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	set(mq.matches);
	const onChange = () => set(mq.matches);
	mq.addEventListener('change', onChange);
	return () => mq.removeEventListener('change', onChange);
});
