<script>
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { activeCardId, prefersReducedMotion } from './stores.js';

	/** @type {import('$data/games.js').Game} */
	export let game;

	const dispatch = createEventDispatcher();

	/** @type {HTMLElement} */
	let cardEl;
	let canHover = false;
	/** @type {IntersectionObserver | undefined} */
	let observer;

	// This card may play only when it's the active one AND motion is allowed.
	$: playing = $activeCardId === game.id && !$prefersReducedMotion;

	function activate() {
		if ($prefersReducedMotion) return;
		activeCardId.set(game.id);
	}

	function deactivate() {
		// Only clear if we're the one currently playing (avoid clobbering another card).
		activeCardId.update((id) => (id === game.id ? null : id));
	}

	function open(focusTab = 'video') {
		deactivate(); // unmount our preview before the modal's own video takes over
		dispatch('open', { game, focusTab });
	}

	/** @param {KeyboardEvent} event */
	function onKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			open('video');
		}
	}

	onMount(() => {
		canHover =
			typeof window !== 'undefined' &&
			window.matchMedia('(hover: hover) and (pointer: fine)').matches;

		// Touch / no-hover devices: autoplay the card nearest the viewport centre.
		if (!canHover && !$prefersReducedMotion && 'IntersectionObserver' in window) {
			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting && entry.intersectionRatio >= 0.6) activate();
						else deactivate();
					}
				},
				{ threshold: [0, 0.6, 1], rootMargin: '-20% 0px -20% 0px' }
			);
			observer.observe(cardEl);
		}
	});

	onDestroy(() => observer?.disconnect());
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="card"
	bind:this={cardEl}
	tabindex="0"
	role="button"
	aria-label="{game.title} — open details"
	on:click={() => open('video')}
	on:keydown={onKeydown}
	on:mouseenter={() => canHover && activate()}
	on:mouseleave={() => canHover && deactivate()}
	on:focus={() => canHover && activate()}
	on:blur={() => canHover && deactivate()}
>
	<div class="media">
		{#if playing}
			<iframe
				title="{game.title} preview"
				src="https://www.youtube-nocookie.com/embed/{game.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist={game.youtubeId}&rel=0&modestbranding=1&playsinline=1"
				allow="autoplay; encrypted-media"
				tabindex="-1"
				aria-hidden="true"
			></iframe>
		{:else}
			<img class="cover" src={game.cover} alt="{game.title} cover" loading="lazy" />
			{#if $prefersReducedMotion}
				<span class="play-badge" aria-hidden="true">▶ Play</span>
			{/if}
		{/if}
		<span class="year-chip">{game.year}</span>
	</div>

	<div class="meta">
		<h3 class="title">{game.title}</h3>
		<ul class="tags">
			{#each game.tags as tag}
				<li class="tag gamer">{tag}</li>
			{/each}
		</ul>
	</div>

	<!-- Screenshot strip — click opens the modal on the gallery, Steam-style -->
	<div class="strip" role="group" aria-label="{game.title} screenshots">
		{#each game.screenshots.slice(0, 4) as src, i}
			<button
				class="strip-thumb"
				on:click|stopPropagation={() => open('screenshots')}
				aria-label="View {game.title} screenshot {i + 1}"
			>
				<img {src} alt="{game.title} screenshot {i + 1}" loading="lazy" />
			</button>
		{/each}
	</div>
</div>

<style>
	.card {
		scroll-snap-align: start;
		flex: 0 0 clamp(280px, 78vw, 360px);
		display: flex;
		flex-direction: column;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
	}
	@media (prefers-reduced-motion: no-preference) {
		.card:hover,
		.card:focus-visible {
			transform: translateY(-6px);
			border-color: color-mix(in srgb, var(--gold) 45%, var(--line));
			box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
		}
	}

	.media {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--panel-2);
	}
	.media iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		pointer-events: none; /* clicks fall through to the card → opens modal */
	}
	.cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.play-badge {
		position: absolute;
		inset: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;
		padding: 0.4rem 0.9rem;
		background: rgba(18, 22, 43, 0.85);
		border: 1px solid var(--gold);
		border-radius: 999px;
		color: var(--gold);
		font-family: var(--mono);
		font-size: 0.8rem;
	}

	.year-chip {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		padding: 0.15rem 0.5rem;
		background: rgba(6, 8, 18, 0.7);
		border-radius: 6px;
		font-family: var(--mono);
		font-size: 0.7rem;
		color: var(--text);
	}

	.meta {
		padding: 0.85rem 0.9rem 0.6rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.title {
		font-size: 1.15rem;
		color: var(--text);
	}
	.tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.strip {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		gap: 0.4rem;
		padding: 0 0.9rem 0.9rem;
	}
	.strip-thumb {
		padding: 0;
		border-radius: 6px;
		overflow: hidden;
		border: 1px solid var(--line);
		aspect-ratio: 16 / 9;
		background: var(--panel-2);
	}
	.strip-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.25s ease;
	}
	@media (prefers-reduced-motion: no-preference) {
		.strip-thumb:hover img {
			transform: scale(1.1);
		}
	}
</style>
