<script lang="ts">
    let{ 
		correctWords,
		correctCount
	}: {
		correctCount: number;
		correctWords: string[];
	} = $props();
</script>

<div class="grid">
    {#each correctWords as word}
        <span class="word">✅ {word}</span>
    {/each}
</div>

<style>
.word {
		padding: 0.5rem;
		margin: 0.10rem;
		border: 1px solid var(--pico-primary);
        border-radius: 0.25rem;
        background-color: var(--pico-primary-focus)
	}
@media (max-width: 600px) {
    .grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}
@media (min-width: 600px) {
    .grid {
        display: flex;
        flex-direction: row;
        flex-wrap:wrap;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }
}
</style>