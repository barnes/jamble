<script lang="ts">

    import {getPuzzle} from '$lib/getPuzzle';
	import { onMount } from 'svelte';
    onMount(async ()=>{
        console.log('onMount');
        const getPuzzleResponse = await getPuzzle(true);
        console.log(getPuzzleResponse);
    });
</script>

<h1>Forcing puzzle reload.</h1>