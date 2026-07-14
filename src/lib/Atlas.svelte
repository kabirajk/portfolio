<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { travel } from '$data/travel.js';
	import { activeCardId, prefersReducedMotion } from './stores.js';
	import { scrollProgress } from './scrollProgress.js';
	import { reveal } from './reveal.js';
	import PhotoStack from './PhotoStack.svelte';
	import Lightbox from './Lightbox.svelte';

	/** @type {import('$data/travel.js').Photo[]} */
	let lightboxItems = [];
	let lightboxIndex = 0;
	let lightboxOpen = false;

	/** @param {CustomEvent<{stop: import('$data/travel.js').Stop}>} event */
	function openStack(event) {
		activeCardId.set(null); // one thing at a time
		lightboxItems = event.detail.stop.photos;
		lightboxIndex = 0;
		lightboxOpen = true;
	}

	// --- Scrollytelling ---
	let progress = 0;
	const STEPS = travel.length + 1; // earth loader + one per stop
	const loaderFrac = 1 / STEPS;

	$: loading = progress < loaderFrac;
	$: loadPct = Math.min(100, Math.round((progress / loaderFrac) * 100));
	$: stopT = Math.max(0, Math.min(1, (progress - loaderFrac) / (1 - loaderFrac)));
	$: activeIndex = Math.min(travel.length - 1, Math.round(stopT * (travel.length - 1)));
	$: activeYear = travel[activeIndex].year;
	$: docked = progress >= loaderFrac * 0.8;
	// converge: shrink + sink toward centre-base as the section leaves (into Handles)
	$: exitT = Math.max(0, Math.min(1, (progress - 0.85) / 0.15));

	// keep the fallback path's video store tidy when Atlas comes into view
	/** @type {HTMLElement} */
	let sectionEl;
	/** @type {IntersectionObserver | undefined} */
	let observer;
	onMount(() => {
		if ('IntersectionObserver' in window && sectionEl) {
			observer = new IntersectionObserver(
				(entries) => entries.forEach((e) => e.isIntersecting && activeCardId.set(null)),
				{ threshold: 0.4 }
			);
			observer.observe(sectionEl);
		}
	});
	onDestroy(() => observer?.disconnect());
</script>

{#if $prefersReducedMotion}
	<!-- Reduced-motion fallback: the plain grid of stacks -->
	<section class="section snap-section" id="atlas" aria-labelledby="atlas-title" bind:this={sectionEl}>
		<div class="section-head" use:reveal>
			<span class="eyebrow">Save Files</span>
			<h2 id="atlas-title">Atlas</h2>
		</div>
		<p class="lede" use:reveal>Places I've spawned into. Click a stack to flip through the roll.</p>
		<div class="grid" use:reveal={{ threshold: 0.1 }}>
			{#each travel as stop (stop.year + stop.place)}
				<PhotoStack {stop} on:open={openStack} />
			{/each}
		</div>
	</section>
{:else}
	<section
		class="atlas-scroll"
		id="atlas"
		aria-labelledby="atlas-title"
		bind:this={sectionEl}
		use:scrollProgress={(p) => (progress = p)}
		style="height: calc({STEPS} * 100vh);"
	>
		{#each Array(STEPS) as _, i}
			<div class="snap-anchor" style="top: calc({i} * 100vh);" aria-hidden="true"></div>
		{/each}

		<div class="pin">
			<!-- Header: big + centred on load, docks to corner with the live year -->
			<h2 id="atlas-title" class="title-big" class:hidden={docked}>Atlas</h2>
			<div class="corner" class:show={docked} aria-hidden={!docked}>
				<span class="eyebrow">Save Files · {activeYear}</span>
				<span class="corner-title">Atlas</span>
			</div>

			{#if loading}
				<div class="loader" out:fade={{ duration: 250 }}>
					<span class="globe" aria-hidden="true">🌍</span>
					<span class="load-label">Mapping the Atlas</span>
					<div class="load-bar"><div class="load-fill" style="width: {loadPct}%;"></div></div>
					<span class="load-pct">{loadPct}%</span>
					<span class="load-hint">keep scrolling ▾</span>
				</div>
			{/if}

			<div
				class="stage"
				class:live={!loading}
				aria-hidden={loading}
				style="transform: scale({1 - 0.25 * exitT}) translateY({exitT * 6}vh); opacity: {1 - exitT};"
			>
				<!-- Vertical timeline rail -->
				<ol class="rail">
					{#each travel as stop, i}
						<li class:on={i === activeIndex} class:past={i < activeIndex}>
							<span class="dot" aria-hidden="true"></span>
							<span class="ry">{stop.year}</span>
							<span class="rp">{stop.place}</span>
						</li>
					{/each}
				</ol>

				<!-- Spotlight for the active stop -->
				<div class="spot">
					{#key activeIndex}
						<div class="spot-inner" in:fade={{ duration: 300 }}>
							<PhotoStack stop={travel[activeIndex]} on:open={openStack} />
						</div>
					{/key}
				</div>
			</div>
		</div>
	</section>
{/if}

<Lightbox items={lightboxItems} bind:index={lightboxIndex} bind:open={lightboxOpen} on:close={() => (lightboxOpen = false)} />

<style>
	/* ---------- Reduced-motion fallback ---------- */
	#atlas.section {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.lede {
		font-family: var(--sans);
		color: var(--muted);
		margin-bottom: 2rem;
		max-width: 55ch;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: clamp(1.5rem, 4vw, 2.5rem);
	}

	/* ---------- Scrollytelling ---------- */
	.atlas-scroll {
		position: relative;
	}
	.snap-anchor {
		position: absolute;
		left: 0;
		width: 1px;
		height: 100vh;
	}
	@media (prefers-reduced-motion: no-preference) {
		.snap-anchor {
			scroll-snap-align: start;
		}
	}

	.pin {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: clamp(1.5rem, 5vw, 4rem);
	}

	.title-big {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: clamp(2.5rem, 9vw, 6rem);
		color: var(--text);
		text-shadow: 0 0 40px rgba(79, 209, 174, 0.25);
		transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
		pointer-events: none;
	}
	.title-big.hidden {
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.7);
	}
	.corner {
		position: absolute;
		top: clamp(1.25rem, 4vw, 2.5rem);
		left: clamp(1.25rem, 4vw, 2.5rem);
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		opacity: 0;
		transform: translateY(-8px);
		transition: opacity 0.4s ease, transform 0.4s ease;
	}
	.corner.show {
		opacity: 1;
		transform: none;
	}
	.corner .eyebrow {
		font-family: var(--mono);
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.corner-title {
		font-family: var(--pixel);
		font-size: clamp(1.25rem, 3vw, 1.9rem);
		color: var(--teal);
	}

	/* Earth loader — opaque full-cover overlay so the stage never bleeds through */
	.loader {
		position: absolute;
		inset: 0;
		z-index: 5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		background: var(--bg);
	}
	.globe {
		font-size: 2.4rem;
		animation: spin 4s linear infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.globe {
			animation: none;
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.load-label {
		font-family: var(--mono);
		font-size: 0.75rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.load-bar {
		width: 100%;
		height: 10px;
		border-radius: 999px;
		background: var(--panel-2);
		border: 1px solid var(--line);
		overflow: hidden;
	}
	.load-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--teal), var(--gold));
		transition: width 0.1s linear;
	}
	.load-pct {
		font-family: var(--pixel);
		font-size: 1.4rem;
		color: var(--teal);
	}
	.load-hint {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.15em;
		color: var(--muted);
	}

	/* Stage */
	.stage {
		width: 100%;
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(160px, 0.6fr) minmax(0, 1fr);
		align-items: center;
		gap: clamp(1.5rem, 5vw, 4rem);
		opacity: 0;
		transition: opacity 0.5s ease;
		transform-origin: center bottom;
	}
	.stage.live {
		opacity: 1;
	}

	/* Vertical rail */
	.rail {
		list-style: none;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: clamp(1rem, 3vh, 2rem);
		padding-left: 1.25rem;
	}
	.rail::before {
		content: '';
		position: absolute;
		left: 3px;
		top: 0.4rem;
		bottom: 0.4rem;
		width: 2px;
		background: var(--line);
	}
	.rail li {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 0.75rem;
		align-items: baseline;
		opacity: 0.45;
		transition: opacity 0.35s ease, transform 0.35s ease;
	}
	.rail li.on {
		opacity: 1;
		transform: translateX(4px);
	}
	.rail .dot {
		position: absolute;
		left: -1.25rem;
		top: 0.35rem;
		width: 10px;
		height: 10px;
		border-radius: 999px;
		background: var(--panel-2);
		border: 2px solid var(--line);
		transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
	}
	.rail li.past .dot {
		background: var(--teal);
		border-color: var(--teal);
	}
	.rail li.on .dot {
		background: var(--gold);
		border-color: var(--gold);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--gold) 22%, transparent);
	}
	.rail .ry {
		grid-column: 1 / -1;
		font-family: var(--mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		color: var(--gold);
	}
	.rail .rp {
		grid-column: 1 / -1;
		font-family: var(--pixel);
		font-size: clamp(0.95rem, 1.8vw, 1.2rem);
		color: var(--text);
	}

	/* Spotlight */
	.spot {
		position: relative;
		min-height: 62vh;
	}
	.spot-inner {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.spot-inner :global(.stop) {
		width: min(300px, 70%);
	}

	@media (max-width: 760px) {
		.stage {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		.rail {
			flex-direction: row;
			flex-wrap: wrap;
			padding-left: 0;
		}
		.rail::before {
			display: none;
		}
		.rail .dot {
			display: none;
		}
		.rail li {
			display: block;
		}
		.spot {
			min-height: auto;
		}
		.spot-inner {
			position: static;
		}
	}
</style>
