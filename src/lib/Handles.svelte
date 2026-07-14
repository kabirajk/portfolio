<script>
	import { onMount, onDestroy } from 'svelte';
	import { handles } from '$data/handles.js';
	import { prefersReducedMotion } from './stores.js';
	import { reveal } from './reveal.js';

	// Radial geometry (viewBox is 0..100, centre 50,50, ring radius R)
	const R = 38;
	const step = 360 / handles.length;
	const nodes = handles.map((h, i) => {
		const aDeg = i * step; // clockwise from top
		const a = (aDeg * Math.PI) / 180;
		return { ...h, aDeg, x: 50 + R * Math.sin(a), y: 50 - R * Math.cos(a) };
	});

	let assembled = false;
	/** @type {HTMLElement} */
	let sectionEl;
	/** @type {IntersectionObserver | undefined} */
	let observer;

	onMount(() => {
		if ('IntersectionObserver' in window && sectionEl) {
			observer = new IntersectionObserver(
				(entries) => entries.forEach((e) => e.isIntersecting && (assembled = true)),
				{ threshold: 0.35 }
			);
			observer.observe(sectionEl);
		}
	});
	onDestroy(() => observer?.disconnect());
</script>

{#if $prefersReducedMotion}
	<!-- Reduced-motion fallback: plain pill grid -->
	<section class="section handles snap-section" id="handles" aria-labelledby="handles-title">
		<div class="section-head" use:reveal>
			<span class="eyebrow">Party Invite</span>
			<h2 id="handles-title">Handles</h2>
		</div>
		<p class="lede" use:reveal>Add me. Reply time varies with boss fights.</p>
		<ul class="links" use:reveal={{ threshold: 0.1 }}>
			{#each handles as h}
				<li>
					<a class="pill {h.variant ?? ''}" href={h.href} target="_blank" rel="noopener noreferrer">
						<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={h.icon} /></svg>
						<span class="text"><span class="label">{h.label}</span><span class="handle">{h.handle}</span></span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{:else}
	<section class="handles-web snap-section" id="handles" aria-labelledby="handles-title" bind:this={sectionEl}>
		<div class="head">
			<span class="eyebrow">Party Invite</span>
			<h2 id="handles-title">Handles</h2>
			<p class="lede">Add me. Reply time varies with boss fights.</p>
		</div>

		<div class="ring" class:assembled>
			<svg class="web" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
				{#each nodes as n}
					<line x1="50" y1="50" x2={n.x} y2={n.y} />
				{/each}
				<circle cx="50" cy="50" r="2.4" class="hub" />
			</svg>

			<div class="center" aria-hidden="true">
				<img src="/profile.png" alt="" />
			</div>

			{#each nodes as n, i}
				<a
					class="node {n.variant ?? ''}"
					style="--deg: {n.aDeg}deg; transition-delay: {i * 0.09}s;"
					href={n.href}
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="node-ic">
						<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={n.icon} /></svg>
					</span>
					<span class="node-label">{n.label}</span>
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	/* ---------- shared fallback pills ---------- */
	.handles {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-bottom: clamp(4rem, 10vw, 7rem);
	}
	.lede {
		font-family: var(--sans);
		color: var(--muted);
		margin-bottom: 1.75rem;
	}
	.links {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 0.85rem;
	}
	.pill {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 999px;
	}
	.pill .icon {
		width: 22px;
		height: 22px;
		color: var(--muted);
	}
	.pill .text {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
	.pill .label {
		font-family: var(--mono);
		font-size: 0.85rem;
		color: var(--text);
	}
	.pill .handle {
		font-family: var(--mono);
		font-size: 0.7rem;
		color: var(--muted);
	}

	/* ---------- web ring ---------- */
	.handles-web {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: clamp(1.5rem, 5vh, 3rem);
		padding: clamp(2rem, 6vw, 4rem) 1rem;
		text-align: center;
	}
	.head .eyebrow {
		font-family: var(--mono);
		font-size: 0.72rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.head h2 {
		font-size: clamp(1.75rem, 5vw, 2.75rem);
		color: var(--text);
		margin: 0.25rem 0 0.35rem;
	}
	.head .lede {
		font-family: var(--sans);
		color: var(--muted);
		margin: 0;
	}

	.ring {
		--ring: clamp(300px, 70vmin, 520px);
		--radius: calc(var(--ring) * 0.38);
		position: relative;
		width: var(--ring);
		height: var(--ring);
	}

	.web {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.web line {
		stroke: var(--line);
		stroke-width: 0.5;
		opacity: 0;
		transition: opacity 0.7s ease 0.15s;
	}
	.web .hub {
		fill: color-mix(in srgb, var(--gold) 40%, transparent);
	}
	.ring.assembled .web line {
		opacity: 1;
	}

	.center {
		position: absolute;
		top: 50%;
		left: 50%;
		width: clamp(64px, 16vmin, 104px);
		height: clamp(64px, 16vmin, 104px);
		border-radius: 999px;
		overflow: hidden;
		border: 2px solid color-mix(in srgb, var(--gold) 55%, var(--line));
		box-shadow: 0 0 0 6px color-mix(in srgb, var(--gold) 12%, transparent);
		transform: translate(-50%, -50%) scale(0.5);
		opacity: 0;
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease;
	}
	.center img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.ring.assembled .center {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}

	.node {
		position: absolute;
		top: 50%;
		left: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		width: max-content;
		/* start at centre, collapsed */
		transform: translate(-50%, -50%) rotate(var(--deg)) translateY(0) rotate(calc(-1 * var(--deg)));
		opacity: 0;
		transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease;
	}
	.ring.assembled .node {
		transform: translate(-50%, -50%) rotate(var(--deg)) translateY(calc(-1 * var(--radius)))
			rotate(calc(-1 * var(--deg)));
		opacity: 1;
	}
	.node-ic {
		display: grid;
		place-items: center;
		width: clamp(48px, 11vmin, 64px);
		height: clamp(48px, 11vmin, 64px);
		border-radius: 999px;
		background: var(--panel);
		border: 1px solid var(--line);
		color: var(--muted);
		transition: transform 0.25s ease, border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
	}
	.node-ic svg {
		width: 45%;
		height: 45%;
	}
	.node-label {
		font-family: var(--mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		color: var(--muted);
		transition: color 0.25s ease;
	}
	.node:hover .node-ic,
	.node:focus-visible .node-ic {
		transform: translateY(-3px) scale(1.08);
		background: var(--panel-2);
	}
	.node:hover .node-label,
	.node:focus-visible .node-label {
		color: var(--text);
	}
	.node.dev:hover .node-ic,
	.node.dev:focus-visible .node-ic {
		border-color: var(--teal);
		color: var(--teal);
	}
	.node.gamer:hover .node-ic,
	.node.gamer:focus-visible .node-ic {
		border-color: var(--gold);
		color: var(--gold);
	}

	@media (prefers-reduced-motion: reduce) {
		.web line,
		.center,
		.node {
			transition: none;
		}
	}
</style>
