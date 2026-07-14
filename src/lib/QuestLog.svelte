<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { games } from '$data/games.js';
	import { prefersReducedMotion } from './stores.js';
	import { scrollProgress } from './scrollProgress.js';
	import GameCard from './GameCard.svelte';
	import GameModal from './GameModal.svelte';

	// --- Modal (shared by both the scrolly rack and the reduced-motion fallback) ---
	/** @type {import('$data/games.js').Game | null} */
	let modalGame = null;
	let modalOpen = false;
	let modalTab = 'video';

	/** @param {CustomEvent<{game: import('$data/games.js').Game, focusTab: string}>} event */
	function openModal(event) {
		modalGame = event.detail.game;
		modalTab = event.detail.focusTab;
		modalOpen = true;
	}
	/** @param {import('$data/games.js').Game} game */
	function openGame(game) {
		modalGame = game;
		modalTab = 'video';
		modalOpen = true;
	}

	// --- Scrollytelling state ---
	/** @type {HTMLElement} */
	let rackEl;
	let progress = 0; // 0..1 through the tall pinned section (from scrollProgress action)
	let step = 284; // px per rack card (measured)
	let startOffset = 0; // px to centre the active card in its column

	const STEPS = games.length + 1; // 1 loader step + one per game
	const loaderFrac = 1 / STEPS;

	$: loading = progress < loaderFrac;
	$: loadPct = Math.min(100, Math.round((progress / loaderFrac) * 100));
	$: gameT = Math.max(0, Math.min(1, (progress - loaderFrac) / (1 - loaderFrac)));
	$: activeIndex = Math.min(games.length - 1, Math.round(gameT * (games.length - 1)));
	$: docked = progress >= loaderFrac * 0.8;
	$: rackX = startOffset - gameT * (games.length - 1) * step;

	function measure() {
		const first = rackEl?.querySelector('.rack-card');
		if (first instanceof HTMLElement && rackEl?.parentElement) {
			const gap = parseFloat(getComputedStyle(rackEl).columnGap || '24') || 24;
			step = first.offsetWidth + gap;
			startOffset = (rackEl.parentElement.clientWidth - first.offsetWidth) / 2;
		}
	}

	onMount(async () => {
		await tick();
		measure();
		window.addEventListener('resize', measure, { passive: true });
	});
	onDestroy(() => {
		if (typeof window !== 'undefined') window.removeEventListener('resize', measure);
	});
</script>

{#if $prefersReducedMotion}
	<!-- Reduced-motion fallback: the plain snap-scroll rack, no pinning or autoplay -->
	<section class="section snap-section" id="quest-log" aria-labelledby="quest-log-title">
		<div class="section-head">
			<span class="eyebrow">Now Playing</span>
			<h2 id="quest-log-title">Quest Log</h2>
		</div>
		<p class="lede">Click a card for the trailer, full gallery, and notes.</p>
		<div class="row" role="list">
			{#each games as game (game.id)}
				<div role="listitem" class="row-item">
					<GameCard {game} on:open={openModal} />
				</div>
			{/each}
		</div>
	</section>
{:else}
	<!-- Scroll-driven pinned showcase -->
	<section
		class="quest"
		id="quest-log"
		aria-labelledby="quest-log-title"
		use:scrollProgress={(p) => (progress = p)}
		style="height: calc({STEPS} * 100vh);"
	>
		<!-- snap anchor per step so each game settles into place -->
		{#each Array(STEPS) as _, i}
			<div class="snap-anchor" style="top: calc({i} * 100vh);" aria-hidden="true"></div>
		{/each}

		<div class="pin">
			<!-- Header: large & centred during load, docks to the corner after -->
			<h2 id="quest-log-title" class="title-big" class:hidden={docked}>Quest Log</h2>
			<div class="corner" class:show={docked} aria-hidden={!docked}>
				<span class="eyebrow">Now Playing</span>
				<span class="corner-title">Quest Log</span>
			</div>

			{#if loading}
				<div class="loader" out:fade={{ duration: 250 }}>
					<span class="load-label">Initializing Quest Log</span>
					<div class="load-bar"><div class="load-fill" style="width: {loadPct}%;"></div></div>
					<span class="load-pct">{loadPct}%</span>
					<span class="load-hint">keep scrolling ▾</span>
				</div>
			{/if}

			<div class="stage" class:live={!loading} aria-hidden={loading}>
				<!-- Filmstrip rack -->
				<div class="rack-wrap">
					<div class="rack" bind:this={rackEl} style="transform: translateX({rackX}px);">
						{#each games as game, i (game.id)}
							<button
								class="rack-card"
								class:active={i === activeIndex}
								tabindex={loading ? -1 : 0}
								on:click={() => openGame(game)}
								aria-label="{game.title} — open details"
							>
								<img src={game.cover} alt="{game.title} cover" loading="lazy" />
								<span class="rc-year">{game.year}</span>
								<span class="rc-title">{game.title}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Spotlight for the active game -->
				<aside class="spotlight">
					{#key activeIndex}
						<div class="spot-inner" in:fade={{ duration: 300 }}>
							<div class="spot-media">
								<img src={games[activeIndex].cover} alt="{games[activeIndex].title} cover" />
								<span class="spot-index">{String(activeIndex + 1).padStart(2, '0')} / {String(games.length).padStart(2, '0')}</span>
							</div>
							<div class="spot-body">
								<div class="spot-head">
									<h3>{games[activeIndex].title}</h3>
									<span class="spot-year">{games[activeIndex].year}</span>
								</div>
								<ul class="spot-tags">
									{#each games[activeIndex].tags as tag}
										<li class="tag gamer">{tag}</li>
									{/each}
								</ul>
								<p class="spot-note">{games[activeIndex].note}</p>
								<button class="spot-open" on:click={() => openGame(games[activeIndex])} tabindex={loading ? -1 : 0}>
									▶ Open trailer & gallery
								</button>
							</div>
						</div>
					{/key}

					<div class="dots" aria-hidden="true">
						{#each games as _, i}
							<span class="dot" class:on={i === activeIndex}></span>
						{/each}
					</div>
				</aside>
			</div>
		</div>
	</section>
{/if}

<GameModal game={modalGame} focusTab={modalTab} bind:open={modalOpen} on:close={() => (modalOpen = false)} />

<style>
	/* ---------- Reduced-motion fallback rack ---------- */
	.lede {
		font-family: var(--sans);
		color: var(--muted);
		margin-bottom: 1.5rem;
		max-width: 55ch;
	}
	.row {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		padding: 0.5rem 0.25rem 1.5rem;
	}
	.row-item {
		display: flex;
	}

	/* ---------- Scrollytelling ---------- */
	.quest {
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

	/* Header states */
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
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.corner-title {
		font-family: var(--pixel);
		font-size: clamp(1.25rem, 3vw, 1.9rem);
		color: var(--gold);
	}

	/* Loader */
	.loader {
		position: absolute;
		top: 58%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		width: min(420px, 80vw);
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
		color: var(--gold);
	}
	.load-hint {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.15em;
		color: var(--muted);
	}

	/* Stage: rack + spotlight */
	.stage {
		width: 100%;
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		align-items: center;
		gap: clamp(1rem, 4vw, 3rem);
		opacity: 0;
		transition: opacity 0.5s ease;
	}
	.stage.live {
		opacity: 1;
	}

	.rack-wrap {
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
	}
	.rack {
		display: flex;
		gap: 1.5rem;
		will-change: transform;
	}
	.rack-card {
		position: relative;
		flex: 0 0 clamp(150px, 20vw, 220px);
		aspect-ratio: 3 / 4;
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--line);
		padding: 0;
		filter: grayscale(0.5) brightness(0.6);
		transform: scale(0.86);
		transition: transform 0.35s ease, filter 0.35s ease, border-color 0.35s ease;
	}
	.rack-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.rack-card.active {
		filter: none;
		transform: scale(1);
		border-color: color-mix(in srgb, var(--gold) 60%, var(--line));
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.5);
	}
	.rc-year {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.1rem 0.45rem;
		border-radius: 6px;
		background: rgba(6, 8, 18, 0.7);
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--text);
	}
	.rc-title {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1.5rem 0.6rem 0.5rem;
		background: linear-gradient(180deg, transparent, rgba(6, 8, 18, 0.9));
		font-family: var(--pixel);
		font-size: 0.9rem;
		color: var(--text);
		text-align: left;
	}

	/* Spotlight */
	.spotlight {
		position: relative;
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.spot-inner {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
	}
	.spot-media {
		position: relative;
		aspect-ratio: 16 / 9;
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--line);
		box-shadow: 0 20px 55px rgba(0, 0, 0, 0.5);
	}
	.spot-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.spot-index {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		font-family: var(--mono);
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		color: var(--gold);
		background: rgba(6, 8, 18, 0.65);
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
	}
	.spot-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.spot-head h3 {
		font-size: clamp(1.35rem, 3.2vw, 2rem);
		color: var(--text);
	}
	.spot-year {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--muted);
	}
	.spot-tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.spot-note {
		font-family: var(--sans);
		color: var(--muted);
		max-width: 46ch;
	}
	.spot-open {
		align-self: flex-start;
		margin-top: 0.25rem;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--gold) 55%, transparent);
		color: var(--gold);
		font-family: var(--mono);
		font-size: 0.8rem;
		transition: background 0.2s ease;
	}
	.spot-open:hover {
		background: color-mix(in srgb, var(--gold) 12%, transparent);
	}

	.dots {
		position: absolute;
		bottom: -1.5rem;
		left: 0;
		display: flex;
		gap: 0.4rem;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: var(--panel-2);
		transition: background 0.3s ease, transform 0.3s ease;
	}
	.dot.on {
		background: var(--gold);
		transform: scale(1.25);
	}

	@media (max-width: 760px) {
		.stage {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}
		.rack-wrap {
			display: none; /* on small screens the spotlight alone tells the story */
		}
		.spotlight {
			min-height: auto;
		}
		.spot-inner {
			position: static;
		}
		.dots {
			position: static;
			margin-top: 1rem;
			justify-content: center;
		}
	}
</style>
