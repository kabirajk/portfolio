<script>
	import Hero from '$lib/Hero.svelte';
	import QuestLog from '$lib/QuestLog.svelte';
	import Atlas from '$lib/Atlas.svelte';
	import Handles from '$lib/Handles.svelte';
</script>

<svelte:head>
	<title>Kabiraj K — Player Profile</title>
	<meta name="description" content="A personal site as a game profile: trading card, quest log, travel atlas, and handles." />
</svelte:head>

<main>
	<Hero />
	<QuestLog />
	<Atlas />
	<Handles />
</main>
