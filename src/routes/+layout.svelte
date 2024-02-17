<script lang="ts">
	import '@picocss/pico';
	import '../global.css';
	import type { PageData } from './$types';
	export const prerender = true;
	export const ssr = false;

	export let data: PageData;


	
	
	


</script>
<header>
	<div class="title">
		<h1>SCRAM</h1>
		<span>A word game.</span>
	</div>
</header>
<main>
	<slot />
</main>
<footer>
	<hr />
	<div class="footer-content">
		<p>a game by <a href="https://barnes.lol">ryan barnes</a></p>
		<p>so far {data.count} games have been played</p>
	</div>
</footer>

<style>
	.footer-content {
		display: flex;
		justify-content: space-between;
	}
	@media (max-width: 600px) {
		.footer-content {
			flex-direction: column;
		}
	}
	footer{
		width: 100%;
	}
	main {
		height: 100%;
	}
	.title {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		align-items: center;
		align-content: center;
		margin-bottom: 2rem;
	}
</style>
