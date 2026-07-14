<script>
	import { createEventDispatcher, tick } from 'svelte';

	/**
	 * Reusable fullscreen slideshow. Same component for Atlas photos and
	 * Quest Log screenshots — only the `items` differ.
	 * item shape: { src, date?, time?, location?, caption?, alt? }
	 */
	/** @type {Array<{src:string,date?:string,time?:string,location?:string,caption?:string,alt?:string}>} */
	export let items = [];
	export let index = 0;
	export let open = false;

	const dispatch = createEventDispatcher();

	let showInfo = false;
	/** @type {HTMLDivElement} */
	let dialogEl;
	/** @type {number | null} */
	let touchStartX = null;

	$: current = items[index] ?? null;
	$: hasMeta = current && (current.date || current.time || current.location || current.caption);

	// Reset the info panel each time a new lightbox opens, and move focus in.
	$: if (open) onOpen();

	async function onOpen() {
		showInfo = false;
		await tick();
		dialogEl?.focus();
	}

	function close() {
		dispatch('close');
	}

	function next() {
		if (!items.length) return;
		index = (index + 1) % items.length;
		showInfo = false;
	}

	function prev() {
		if (!items.length) return;
		index = (index - 1 + items.length) % items.length;
		showInfo = false;
	}

	/** @param {KeyboardEvent} event */
	function onKeydown(event) {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				close();
				break;
			case 'ArrowRight':
				event.preventDefault();
				next();
				break;
			case 'ArrowLeft':
				event.preventDefault();
				prev();
				break;
			case 'i':
			case 'I':
				if (hasMeta) showInfo = !showInfo;
				break;
		}
	}

	/** @param {TouchEvent} event */
	function onTouchStart(event) {
		touchStartX = event.changedTouches[0].clientX;
	}

	/** @param {TouchEvent} event */
	function onTouchEnd(event) {
		if (touchStartX === null) return;
		const dx = event.changedTouches[0].clientX - touchStartX;
		if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
		touchStartX = null;
	}
</script>

<svelte:body class:no-scroll={open} />

{#if open && current}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		class="overlay"
		role="dialog"
		aria-modal="true"
		aria-label="Photo viewer"
		tabindex="-1"
		bind:this={dialogEl}
		on:keydown={onKeydown}
		on:click|self={close}
		on:touchstart={onTouchStart}
		on:touchend={onTouchEnd}
	>
		<button class="icon-btn close" on:click={close} aria-label="Close viewer">✕</button>

		{#if items.length > 1}
			<button class="icon-btn nav prev" on:click={prev} aria-label="Previous photo">‹</button>
			<button class="icon-btn nav next" on:click={next} aria-label="Next photo">›</button>
		{/if}

		<figure class="stage">
			<img src={current.src} alt={current.alt ?? current.location ?? current.caption ?? 'Photo'} />

			{#if hasMeta}
				<button
					class="icon-btn info"
					on:click={() => (showInfo = !showInfo)}
					aria-pressed={showInfo}
					aria-label="Toggle photo info"
				>
					i
				</button>

				{#if showInfo}
					<figcaption class="info-panel">
						{#if current.location}<span class="line loc">{current.location}</span>{/if}
						{#if current.date || current.time}
							<span class="line meta">
								{#if current.date}{current.date}{/if}{#if current.date && current.time} · {/if}{#if current.time}{current.time}{/if}
							</span>
						{/if}
						{#if current.caption}<span class="line cap">{current.caption}</span>{/if}
					</figcaption>
				{/if}
			{/if}
		</figure>

		{#if items.length > 1}
			<div class="counter" aria-hidden="true">{index + 1} / {items.length}</div>
		{/if}
	</div>
{/if}

<style>
	:global(body.no-scroll) {
		overflow: hidden;
	}

	.overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		padding: clamp(1rem, 4vw, 3rem);
		background: rgba(6, 8, 18, 0.92);
		backdrop-filter: blur(6px);
	}

	.stage {
		position: relative;
		max-width: min(1000px, 92vw);
		max-height: 88vh;
		display: flex;
	}
	.stage img {
		max-width: 100%;
		max-height: 88vh;
		object-fit: contain;
		border-radius: 10px;
		box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
	}

	.icon-btn {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 999px;
		background: rgba(27, 32, 68, 0.85);
		border: 1px solid var(--line);
		color: var(--text);
		font-size: 1.25rem;
		line-height: 1;
		transition: background 0.2s ease, transform 0.2s ease;
	}
	.icon-btn:hover {
		background: var(--panel-2);
		transform: scale(1.05);
	}

	.close {
		position: absolute;
		top: clamp(0.75rem, 3vw, 1.5rem);
		right: clamp(0.75rem, 3vw, 1.5rem);
		z-index: 2;
	}

	.nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		width: 48px;
		height: 48px;
		font-size: 1.8rem;
	}
	.nav:hover {
		transform: translateY(-50%) scale(1.05);
	}
	.prev {
		left: clamp(0.5rem, 3vw, 1.5rem);
	}
	.next {
		right: clamp(0.5rem, 3vw, 1.5rem);
	}

	.info {
		position: absolute;
		bottom: 0.75rem;
		right: 0.75rem;
		width: 38px;
		height: 38px;
		font-family: var(--pixel);
		font-style: italic;
		font-size: 1rem;
	}

	.info-panel {
		position: absolute;
		left: 0.75rem;
		bottom: 0.75rem;
		right: 4rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		background: rgba(18, 22, 43, 0.92);
		border: 1px solid var(--line);
		border-radius: 10px;
		text-align: left;
		animation: fade-up 0.22s ease;
	}
	.line {
		font-family: var(--mono);
		font-size: 0.78rem;
	}
	.line.loc {
		color: var(--gold);
		font-size: 0.9rem;
	}
	.line.meta {
		color: var(--muted);
	}
	.line.cap {
		font-family: var(--sans);
		color: var(--text);
		font-size: 0.82rem;
	}

	.counter {
		position: absolute;
		bottom: clamp(0.75rem, 3vw, 1.5rem);
		left: 50%;
		transform: translateX(-50%);
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--muted);
		letter-spacing: 0.1em;
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.info-panel {
			animation: none;
		}
	}
</style>
