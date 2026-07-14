<script>
	import { createEventDispatcher, tick } from 'svelte';
	import Lightbox from './Lightbox.svelte';

	/** @type {import('$data/games.js').Game | null} */
	export let game = null;
	export let open = false;
	/** 'video' | 'screenshots' — which section to scroll to on open */
	export let focusTab = 'video';

	const dispatch = createEventDispatcher();

	/** @type {HTMLDivElement} */
	let modalEl;
	/** @type {HTMLElement} */
	let galleryEl;
	let lightboxOpen = false;
	let lightboxIndex = 0;

	// Screenshots reshaped into Lightbox items (with the game note as caption).
	$: lightboxItems = (game?.screenshots ?? []).map((src, i) => ({
		src,
		caption: game?.note,
		location: `${game?.title} — shot ${i + 1}`,
		alt: `${game?.title} screenshot ${i + 1}`
	}));

	$: if (open) onOpen();

	async function onOpen() {
		await tick();
		modalEl?.focus();
		if (focusTab === 'screenshots' && galleryEl) {
			galleryEl.scrollIntoView({ block: 'nearest' });
		}
	}

	function close() {
		if (lightboxOpen) {
			lightboxOpen = false;
			return;
		}
		dispatch('close');
	}

	/** @param {number} i */
	function openLightbox(i) {
		lightboxIndex = i;
		lightboxOpen = true;
	}

	/** @param {KeyboardEvent} event */
	function onKeydown(event) {
		if (event.key === 'Escape' && !lightboxOpen) {
			event.preventDefault();
			close();
		}
	}
</script>

<svelte:body class:no-scroll={open} />

{#if open && game}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		class="overlay"
		role="dialog"
		aria-modal="true"
		aria-label={game.title}
		tabindex="-1"
		bind:this={modalEl}
		on:keydown={onKeydown}
		on:click|self={close}
	>
		<div class="modal">
			<button class="close" on:click={close} aria-label="Close">✕</button>

			<div class="video-wrap">
				<!-- Unmuted, with controls — this is the deliberate "expanded" view -->
				<iframe
					title="{game.title} trailer"
					src="https://www.youtube-nocookie.com/embed/{game.youtubeId}?autoplay=1&rel=0&modestbranding=1"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>

			<div class="body">
				<header class="head">
					<h3>{game.title}</h3>
					<span class="year">{game.year}</span>
				</header>

				<ul class="tags">
					{#each game.tags as tag}
						<li class="tag gamer">{tag}</li>
					{/each}
				</ul>

				<p class="note">{game.note}</p>

				<h4 class="gallery-title" bind:this={galleryEl}>Screenshots</h4>
				<div class="gallery">
					{#each game.screenshots as src, i}
						<button class="shot" on:click={() => openLightbox(i)} aria-label="Open screenshot {i + 1}">
							<img {src} alt="{game.title} screenshot {i + 1}" loading="lazy" />
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<Lightbox items={lightboxItems} bind:index={lightboxIndex} bind:open={lightboxOpen} on:close={() => (lightboxOpen = false)} />
{/if}

<style>
	:global(body.no-scroll) {
		overflow: hidden;
	}

	.overlay {
		position: fixed;
		inset: 0;
		z-index: 90;
		display: grid;
		place-items: center;
		padding: clamp(1rem, 4vw, 2.5rem);
		background: rgba(6, 8, 18, 0.9);
		backdrop-filter: blur(6px);
	}

	.modal {
		position: relative;
		width: min(880px, 100%);
		max-height: 90vh;
		overflow-y: auto;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
	}

	.close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 3;
		width: 40px;
		height: 40px;
		border-radius: 999px;
		background: rgba(18, 22, 43, 0.85);
		border: 1px solid var(--line);
		color: var(--text);
		font-size: 1.1rem;
	}
	.close:hover {
		background: var(--panel-2);
	}

	.video-wrap {
		position: relative;
		aspect-ratio: 16 / 9;
		background: #000;
		border-radius: var(--radius) var(--radius) 0 0;
		overflow: hidden;
	}
	.video-wrap iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.body {
		padding: clamp(1rem, 3vw, 1.75rem);
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.head h3 {
		font-size: clamp(1.25rem, 3vw, 1.75rem);
		color: var(--text);
	}
	.year {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--muted);
	}

	.tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.note {
		font-family: var(--sans);
		color: var(--muted);
		max-width: 60ch;
	}

	.gallery-title {
		font-family: var(--mono);
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--muted);
		margin-top: 0.5rem;
	}
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.6rem;
	}
	.shot {
		padding: 0;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--line);
		aspect-ratio: 16 / 9;
		background: var(--panel-2);
	}
	.shot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}
	@media (prefers-reduced-motion: no-preference) {
		.shot:hover img {
			transform: scale(1.06);
		}
	}
</style>
