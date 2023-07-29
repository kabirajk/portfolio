<script>
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import Navbar from './Navbar.svelte';
  	import Icons from './Icons.svelte';
</script>

<header>
	<Icons/>
	<Navbar/>

</header>

<style>
	header {
		margin: 10px 0 0px 0;
		position: fixed;
		width: 100vw;
	}
</style>
