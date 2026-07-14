// Atlas content. Each stop renders as a fanned stack of photos; clicking opens
// the Lightbox slideshow. Give each stop 2–4 photos for the best "spilled photos" look.
// Swap `src` for your own image URLs (or import from $lib/images).
//
// Shape:
//   {
//     year, place, note,
//     photos: [{ src, date, time, location }]
//   }

const pic = (/** @type {string} */ seed) => `https://picsum.photos/seed/${seed}/900/1200`;

/**
 * @typedef {Object} Photo
 * @property {string} src
 * @property {string} date
 * @property {string} time
 * @property {string} location
 */

/**
 * @typedef {Object} Stop
 * @property {string} year
 * @property {string} place
 * @property {string} note
 * @property {Photo[]} photos
 */

/** @type {Stop[]} */
export const travel = [
	{
		year: '2024',
		place: 'Kyoto, Japan',
		note: 'Chasing shrines at 6am to beat the crowds. Worth every lost hour of sleep.',
		photos: [
			{ src: pic('kyoto-1'), date: 'Apr 03, 2024', time: '06:12', location: 'Fushimi Inari Taisha' },
			{ src: pic('kyoto-2'), date: 'Apr 03, 2024', time: '11:40', location: 'Arashiyama Bamboo Grove' },
			{ src: pic('kyoto-3'), date: 'Apr 04, 2024', time: '18:25', location: 'Gion District' }
		]
	},
	{
		year: '2023',
		place: 'Reykjavík, Iceland',
		note: 'Drove the Ring Road with no plan and a very confused rental car.',
		photos: [
			{ src: pic('iceland-1'), date: 'Sep 21, 2023', time: '22:47', location: 'Þingvellir National Park' },
			{ src: pic('iceland-2'), date: 'Sep 22, 2023', time: '14:03', location: 'Seljalandsfoss' },
			{ src: pic('iceland-3'), date: 'Sep 23, 2023', time: '09:15', location: 'Jökulsárlón Glacier Lagoon' },
			{ src: pic('iceland-4'), date: 'Sep 24, 2023', time: '20:31', location: 'Vík í Mýrdal' }
		]
	},
	{
		year: '2022',
		place: 'Lisbon, Portugal',
		note: 'Too many pastéis de nata, zero regrets, all the tiles photographed.',
		photos: [
			{ src: pic('lisbon-1'), date: 'Jun 10, 2022', time: '17:52', location: 'Alfama' },
			{ src: pic('lisbon-2'), date: 'Jun 11, 2022', time: '12:20', location: 'Belém Tower' }
		]
	},
	{
		year: '2019',
		place: 'Pokhara, Nepal',
		note: 'Woke up to the Annapurnas over the lake. Still my phone wallpaper.',
		photos: [
			{ src: pic('pokhara-1'), date: 'Nov 05, 2019', time: '05:58', location: 'Phewa Lake' },
			{ src: pic('pokhara-2'), date: 'Nov 06, 2019', time: '07:14', location: 'Sarangkot Viewpoint' },
			{ src: pic('pokhara-3'), date: 'Nov 07, 2019', time: '16:40', location: 'World Peace Pagoda' }
		]
	}
];
