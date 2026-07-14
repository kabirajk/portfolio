<script>
	import { createEventDispatcher } from 'svelte';

	/** @type {import('$data/travel.js').Stop} */
	export let stop;

	const dispatch = createEventDispatcher();

	// Deterministic "spilled photos" transforms per depth (index 0 = top, straightest).
	const ROT = [-2, 4, -5, 3];
	const TX = [0, 12, -10, 16];
	const TY = [-4, 2, 4, 0];

	function open() {
		dispatch('open', { stop });
	}

	/** @param {KeyboardEvent} event */
	function onKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			open();
		}
	}
</script>

<figure class="stop">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		class="stack"
		role="button"
		tabindex="0"
		aria-label="{stop.place} ({stop.year}) — open {stop.photos.length} photos"
		on:click={open}
		on:keydown={onKeydown}
	>
		{#each stop.photos.slice(0, 4) as photo, i}
			<img
				class="photo"
				src={photo.src}
				alt="{stop.place} — {photo.location}"
				loading="lazy"
				style="--rot:{ROT[i % 4]}deg; --tx:{TX[i % 4]}px; --ty:{TY[i % 4]}px; z-index:{10 - i};"
			/>
		{/each}
		<span class="count" aria-hidden="true">{stop.photos.length} 📷</span>
	</div>

	<figcaption class="caption">
		<span class="year">{stop.year}</span>
		<span class="place">{stop.place}</span>
		<span class="note">{stop.note}</span>
	</figcaption>
</figure>

<style>
	.stop {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.stack {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 5;
		cursor: pointer;
		border-radius: 12px;
	}

	.photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 12px;
		border: 4px solid #f4f1e8;
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
		transform-origin: center center;
		transform: rotate(var(--rot)) translate(var(--tx), var(--ty));
		transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	/* Fan out further as an affordance on hover / keyboard focus */
	@media (prefers-reduced-motion: no-preference) {
		.stack:hover .photo,
		.stack:focus-visible .photo {
			transform: rotate(calc(var(--rot) * 1.7)) translate(calc(var(--tx) * 1.5), var(--ty));
		}
		.stack:hover .photo:first-child,
		.stack:focus-visible .photo:first-child {
			transform: rotate(0deg) translateY(-6px) scale(1.02);
		}
	}

	.count {
		position: absolute;
		bottom: 0.5rem;
		right: 0.5rem;
		z-index: 20;
		padding: 0.2rem 0.5rem;
		background: rgba(6, 8, 18, 0.78);
		border-radius: 6px;
		font-family: var(--mono);
		font-size: 0.68rem;
		color: var(--text);
	}

	.caption {
		position: relative;
		z-index: 30;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.year {
		font-family: var(--mono);
		font-size: 0.72rem;
		letter-spacing: 0.15em;
		color: var(--gold);
	}
	.place {
		font-family: var(--pixel);
		font-size: 1.15rem;
		color: var(--text);
	}
	.note {
		font-family: var(--sans);
		font-size: 0.85rem;
		color: var(--muted);
		line-height: 1.45;
	}
</style>
