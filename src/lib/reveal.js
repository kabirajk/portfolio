/**
 * Svelte action: fade + rise an element into view the first time it intersects.
 * Adds the `revealed` class once visible. Respects prefers-reduced-motion by
 * revealing immediately (the .reveal base style also no-ops under reduced motion).
 *
 * Usage: <div use:reveal>…</div>  or  <div use:reveal={{ threshold: 0.3 }}>
 * @param {HTMLElement} node
 * @param {{ threshold?: number }} [opts]
 */
export function reveal(node, opts = {}) {
	node.classList.add('reveal');

	const reduce =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduce || typeof IntersectionObserver === 'undefined') {
		node.classList.add('revealed');
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('revealed');
					observer.unobserve(node);
				}
			}
		},
		{ threshold: opts.threshold ?? 0.2 }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
