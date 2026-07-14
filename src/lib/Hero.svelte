<script>
	// --- Card content (edit here — nothing is hardcoded in the markup below) ---
	const card = {
		name: 'Kabiraj K',
		portrait: '/profile.png',
		hp: 88,
		type: 'DEV / GAMER',
		typeIcon: '🎮',
		stage: 'Player Profile',
		occupation: 'Full-Time Developer',
		hobbies: ['Gaming', 'Anime', 'Badminton'],
		stack: ['Svelte', 'TypeScript', 'Node.js', 'Python'],
		stats: [
			{ label: 'CLASS', value: 'Developer' },
			{ label: 'MAIN', value: 'Gamer' },
			{ label: 'REGION', value: 'Tamilnadu' }
		],
		flavor: '“Boku no namae Kabiraj — I build by day and grind by night.”',
		set: 'PP · 001/151'
	};
</script>

<section class="hero snap-section" aria-label="Player profile card">
	<article class="card" class:foil={true}>
		<div class="foil-layer" aria-hidden="true"></div>

		<div class="inner">
			<!-- Top strip: stage + HP + type -->
			<header class="top">
				<span class="stage">{card.stage}</span>
				<div class="hp">
					<span class="hp-label">HP</span>
					<span class="hp-value">{card.hp}</span>
					<span class="type-icon" aria-hidden="true">{card.typeIcon}</span>
				</div>
			</header>

			<!-- Portrait with overlapping name banner -->
			<div class="art">
				<img src={card.portrait} alt="Portrait of {card.name}" loading="eager" />
				<div class="name-banner">
					<h1>{card.name}</h1>
					<span class="type">{card.type}</span>
				</div>
			</div>

			<!-- Occupation -->
			<div class="field">
				<span class="field-label">Occupation</span>
				<span class="field-value">{card.occupation}</span>
			</div>

			<!-- Hobbies -->
			<div class="field">
				<span class="field-label">Hobbies</span>
				<ul class="pills">
					{#each card.hobbies as hobby}
						<li class="tag gamer">{hobby}</li>
					{/each}
				</ul>
			</div>

			<!-- Tech stack -->
			<div class="field">
				<span class="field-label">Tech Stack</span>
				<ul class="pills">
					{#each card.stack as tech}
						<li class="tag dev">{tech}</li>
					{/each}
				</ul>
			</div>

			<!-- Bottom stat line -->
			<dl class="stats">
				{#each card.stats as stat}
					<div class="stat">
						<dt>{stat.label}</dt>
						<dd>{stat.value}</dd>
					</div>
				{/each}
			</dl>

			<footer class="foot">
				<p class="flavor">{card.flavor}</p>
				<span class="set">{card.set}</span>
			</footer>
		</div>
	</article>

	<div class="scroll-cue" aria-hidden="true">
		<span>SCROLL</span>
		<span class="arrow">▾</span>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(2.5rem, 8vw, 6rem) 1rem clamp(2rem, 6vw, 4rem);
	}

	.scroll-cue {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.25em;
		color: var(--muted);
	}
	.scroll-cue .arrow {
		font-size: 0.9rem;
		color: var(--gold);
	}
	@media (prefers-reduced-motion: no-preference) {
		.scroll-cue .arrow {
			animation: bob 1.6s ease-in-out infinite;
		}
	}
	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(4px);
		}
	}

	/* Foil gradient border */
	.card {
		position: relative;
		width: min(460px, 92vw);
		border-radius: calc(var(--radius) + 6px);
		padding: 6px;
		background: linear-gradient(135deg, var(--gold), var(--teal), var(--gold), var(--panel-2));
		background-size: 300% 300%;
		background-position: 0% 50%;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.45),
			0 0 0 1px var(--line);
		transition: transform 0.35s ease, box-shadow 0.35s ease, background-position 0.6s ease;
	}

	.foil-layer {
		position: absolute;
		inset: 0;
		border-radius: calc(var(--radius) + 6px);
		background: linear-gradient(
			115deg,
			transparent 30%,
			rgba(255, 255, 255, 0.18) 45%,
			rgba(79, 209, 174, 0.15) 50%,
			rgba(232, 184, 75, 0.15) 55%,
			transparent 70%
		);
		background-size: 250% 250%;
		background-position: 0% 0%;
		mix-blend-mode: screen;
		opacity: 0.6;
		pointer-events: none;
		transition: background-position 0.6s ease;
	}

	@media (prefers-reduced-motion: no-preference) {
		.card:hover,
		.card:focus-within {
			transform: translateY(-6px);
			background-position: 100% 50%;
			box-shadow:
				0 28px 80px rgba(0, 0, 0, 0.55),
				0 0 0 1px color-mix(in srgb, var(--gold) 40%, transparent);
		}
		.card:hover .foil-layer,
		.card:focus-within .foil-layer {
			background-position: 100% 100%;
			opacity: 0.95;
		}
	}

	.inner {
		position: relative;
		border-radius: var(--radius);
		background: var(--panel);
		padding: 0.85rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.stage {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.hp {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
	}
	.hp-label {
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--muted);
	}
	.hp-value {
		font-family: var(--pixel);
		font-size: 1.4rem;
		color: var(--gold);
	}
	.type-icon {
		font-size: 1.1rem;
		margin-left: 0.15rem;
	}

	.art {
		position: relative;
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid var(--line);
		aspect-ratio: 5 / 4;
		background: var(--panel-2);
	}
	.art img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.name-banner {
		position: absolute;
		left: 0.5rem;
		right: 0.5rem;
		bottom: -0.6rem;
		background: linear-gradient(180deg, var(--panel-2), var(--panel));
		border: 1px solid color-mix(in srgb, var(--gold) 40%, var(--line));
		border-radius: 10px;
		padding: 0.5rem 0.75rem;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
	}
	.name-banner h1 {
		font-size: 1.5rem;
		color: var(--text);
	}
	.name-banner .type {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.15em;
		color: var(--teal);
		white-space: nowrap;
	}

	/* Occupation / hobbies / tech stack fields */
	.field {
		border-top: 1px solid var(--line);
		padding-top: 0.7rem;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}
	.field:first-of-type {
		margin-top: 0.4rem;
	}
	.field-label {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.field-value {
		font-family: var(--pixel);
		font-size: 1rem;
		color: var(--text);
	}
	.pills {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		border-top: 1px solid var(--line);
		padding-top: 0.7rem;
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.stat dt {
		font-family: var(--mono);
		font-size: 0.58rem;
		letter-spacing: 0.12em;
		color: var(--muted);
	}
	.stat dd {
		font-family: var(--mono);
		font-size: 0.72rem;
		color: var(--text);
	}

	.foot {
		border-top: 1px solid var(--line);
		padding-top: 0.65rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.flavor {
		font-family: var(--sans);
		font-style: italic;
		font-size: 0.78rem;
		color: var(--muted);
	}
	.set {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		color: var(--muted);
		align-self: flex-end;
	}
</style>
