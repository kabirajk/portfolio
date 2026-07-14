/**
 * Svelte action: reports how far the node has scrolled through its own height
 * relative to the viewport, as a 0..1 value, via a callback.
 *
 * 0  = node's top just reached the top of the viewport (section entering)
 * 1  = node's bottom just reached the bottom of the viewport (section leaving)
 *
 * Used to drive pinned scrollytelling (a tall section with a sticky child).
 * rAF-throttled; recomputes on scroll and resize.
 *
 * Usage: <section use:scrollProgress={(p) => (progress = p)}>
 *
 * @param {HTMLElement} node
 * @param {(progress: number) => void} cb
 */
export function scrollProgress(node, cb) {
	let raf = 0;
	let vh = viewportH();

	function viewportH() {
		return window.innerHeight || document.documentElement.clientHeight;
	}

	function update() {
		raf = 0;
		const rect = node.getBoundingClientRect();
		const total = rect.height - vh;
		cb(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0);
	}

	function onScroll() {
		if (!raf) raf = requestAnimationFrame(update);
	}
	function onResize() {
		vh = viewportH();
		onScroll();
	}

	// initial read once laid out
	raf = requestAnimationFrame(update);
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onResize, { passive: true });

	return {
		/** @param {(progress: number) => void} next */
		update(next) {
			cb = next;
		},
		destroy() {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			if (raf) cancelAnimationFrame(raf);
		}
	};
}
