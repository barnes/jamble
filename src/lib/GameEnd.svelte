<script lang="ts">
	let {
		correctCount,
		correctWords,
		lastWord
	}: {
		correctCount: number;
		correctWords: string[];
		lastWord: string;
	} = $props();
</script>

<div class="grid">
	<div class="card">
		<h2>Total Correct:</h2>
		<article>
			<span class="word large">{correctCount}</span>
            :
			<span class="word large">8</span>
		</article>
	</div>
	<div class="card">
		<h2>Correct Words:</h2>
		<article>
			<div class="word-list">
				{#if correctWords.length === 0}
					<span>0</span>
				{:else}
					{#each correctWords as word}
						<span class="word">{word}</span>
					{/each}
				{/if}
			</div>
		</article>
	</div>
	{#if correctCount != 8}
		<div class="card">
			<h2>Last Word:</h2>
			<article>
				<span class="word large">{lastWord}</span>
			</article>
		</div>
	{/if}
</div>

<style>
    .grid {
    }
    .card {
        margin-bottom: 2rem;
    }
	.word-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
        justify-content: center;
        align-items: center;
	}
	.word {
		padding: 0.5rem;
		margin: 0.5rem;
		border: 1px solid var(--pico-primary);
        border-radius: 0.25rem;
        background-color: var(--pico-primary-focus)
	}
	article {
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
    h2 {
        margin: 0;
        font-size: 1rem;
        
    }
</style>
