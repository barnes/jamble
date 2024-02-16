<script lang="ts">
	import '@picocss/pico';
	import '../global.css';
</script>

<main class="container">
	<slot />
</main>

<style>
	main {
		padding: 3rem;
		height: 100%;
	}
</style>
