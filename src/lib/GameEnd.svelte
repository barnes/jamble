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

<div class="results">
	<div class="card">
		<h2>Correct:</h2>
		<article>
			<span class="word">{correctCount}</span>
		</article>
	</div>
	<div class="card">
		<h2>Correct Words:</h2>

		<article>
			<div class="word-list">
				{#if correctWords.length === 0}
					<span class="word">0</span>
				{:else}
					{#each correctWords as word}
						<span class="word">{word}</span>
					{/each}
				{/if}
			</div>
		</article>
	</div>
	<div class="card">
		{#if correctCount === 8}
			<h2>Well done! You got all the words!</h2>
		{:else}
			<h2>Last Word:</h2>
		{/if}
		<article>
			{#if correctCount === 8}{:else}
				<span class="word">{lastWord}</span>
			{/if}
		</article>
	</div>
</div>

<style>
	.word {
		margin: 0.5rem;
		padding: 0.5rem;
		border: 1px solid var(--pico-primary);
		border-radius: 5px;
	}
	.word-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.results {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-wrap: wrap;
		height: 20rem;
		margin-bottom: 2rem;
	}
	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 30%;
		height: 100%;
		margin: 1rem;
		padding: 1rem;
	}
	article {
		width: 100%;
		height: 15rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
	h2 {
		margin: 0;
	}
</style>
