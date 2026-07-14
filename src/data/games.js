// Quest Log content. Each game is one card in the horizontally-scrolling showcase.
// Swap `cover`/`screenshots` for your own asset URLs (or import from $lib/images),
// and `youtubeId` for the trailer/preview you want to autoplay on hover.
//
// Shape:
//   {
//     id, title, year, note,
//     tags: string[],
//     youtubeId,                 // 11-char YouTube id used for the muted hover preview + modal
//     cover,                     // static thumbnail shown before the video swaps in
//     screenshots: string[]      // strip below the card + full gallery in the modal
//   }

const shot = (/** @type {string} */ seed) => `https://picsum.photos/seed/${seed}/960/540`;

/**
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} title
 * @property {string} year
 * @property {string} note
 * @property {string[]} tags
 * @property {string} youtubeId
 * @property {string} cover
 * @property {string[]} screenshots
 */

/** @type {Game[]} */
export const games = [
	{
		id: 'elden-ring',
		title: 'Elden Ring',
		year: '2022',
		note: 'The one that ate a full year of evenings. Malenia is still living rent-free.',
		tags: ['Souls-like', 'Open World', 'Co-op'],
		youtubeId: 'E3Huy2cdih0',
		cover: shot('eldenring-cover'),
		screenshots: [shot('eldenring-1'), shot('eldenring-2'), shot('eldenring-3'), shot('eldenring-4')]
	},
	{
		id: 'hades',
		title: 'Hades',
		year: '2020',
		note: 'Perfect run-based loop. Proof that "just one more run" is a valid design pillar.',
		tags: ['Roguelike', 'Action', 'Story'],
		youtubeId: '91t0ha9x0AE',
		cover: shot('hades-cover'),
		screenshots: [shot('hades-1'), shot('hades-2'), shot('hades-3')]
	},
	{
		id: 'red-dead-2',
		title: 'Red Dead Redemption 2',
		year: '2018',
		note: 'Slowest fast-travel in gaming and I would not change a single ride.',
		tags: ['Open World', 'Story', 'Western'],
		youtubeId: 'gmA6MrX81z4',
		cover: shot('rdr2-cover'),
		screenshots: [shot('rdr2-1'), shot('rdr2-2'), shot('rdr2-3'), shot('rdr2-4')]
	},
	{
		id: 'celeste',
		title: 'Celeste',
		year: '2018',
		note: 'A platformer that is secretly about anxiety. Every C-side scar earned.',
		tags: ['Platformer', 'Indie', 'Precision'],
		youtubeId: '70d9irlxiB4',
		cover: shot('celeste-cover'),
		screenshots: [shot('celeste-1'), shot('celeste-2'), shot('celeste-3')]
	},
	{
		id: 'hollow-knight',
		title: 'Hollow Knight',
		year: '2017',
		note: 'Got lost in Hallownest for 40 hours and called it a personality trait.',
		tags: ['Metroidvania', 'Indie', 'Explore'],
		youtubeId: 'UAO2urG23S4',
		cover: shot('hollow-cover'),
		screenshots: [shot('hollow-1'), shot('hollow-2'), shot('hollow-3'), shot('hollow-4')]
	}
];
