<script lang="ts">
	import { onMount } from 'svelte';
	let {
		correctCount,
		correctWords,
		lastWord,
		todaysPuzzle,
	}: {
		correctCount: number;
		correctWords: string[];
		lastWord: string;
		todaysPuzzle: string[];
	} = $props();

	import copy from 'copy-to-clipboard';
	import { browser } from '$app/environment';
	import { getPuzzle } from '$lib/getPuzzle';
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1; // month is zero-based
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const formatted = mm + '.' + dd + '.' + yyyy;

	let shareString = `SCRAM ${formatted}: `;

	for (let i = 0; i < 5; i++) {
		if (i < correctCount) {
			shareString = shareString + `✅`;
		} else {
			shareString = shareString + `❌`;
		}
	}

	let results = {
		gamesPlayed: 0,
		numberComplete: 0,
		timePlayed: 0
	};

	let localStorage = {
		gamesPlayed: 0,
		lastCorrect: 5,
		lastPuzzle: '',
		lastWord: 'test',
		lastWords: ['test', 'test'],
		numberComplete: 0,
		timePlayed: 0
	}

	onMount(async () => {
		const getPuzzleResponse = await getPuzzle(false);
		todaysPuzzle = getPuzzleResponse.results[0].response.result.rows[0][2].value.split(',');
		if (browser) {
			localStorage.gamesPlayed = parseInt(window.localStorage.getItem('scram-gamesPlayed') || '0');
			localStorage.lastCorrect = parseInt(window.localStorage.getItem('scram-lastCorrect') || '0');
			localStorage.lastPuzzle = window.localStorage.getItem('scram-lastPuzzle') || '';
			localStorage.lastWord = window.localStorage.getItem('scram-lastWord') || '';
			localStorage.lastWords = (window.localStorage.getItem('scram-lastWords') || '').split(',');
			localStorage.numberComplete = parseInt(window.localStorage.getItem('scram-numberComplete') || '0');
			localStorage.timePlayed = parseInt(window.localStorage.getItem('scram-timePlayed') || '0');
		}


		document.querySelector('.copy')?.addEventListener('click', () => {
			copy(shareString);
		});
	});

	// if(browser){
	// 	results.gamesPlayed = parseInt(window.localStorage.getItem('scram-gamesPlayed') || '0');
	// 	results.numberComplete = parseInt(window.localStorage.getItem('scram-numberComplete') || '0');
	// 	results.timePlayed = parseInt(window.localStorage.getItem('scram-timePlayed') || '0');
	
	// }

	
</script>
<h1>Using Props</h1>
<div data-testid="completeGrid" class="grid top">
	<div class="card">
		<h2>Total Correct:</h2>
		<article>
			<span data-testid="correct-count" class="word large">{correctCount}</span>
			:
			<span data-testid="total-count" class="word large">{todaysPuzzle.length/2}</span>
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
</div>
<div class="grid">
	{#if correctCount != 6}
		<div class="card">
			<h2>Last Word:</h2>
			<article>
				<span class="word large">{lastWord}</span>
			</article>
		</div>
	{/if}
	<div class="card">
		<h2>Your History:</h2>
		<article class="history">
			<p class="history-item">Games Played: <span class="word">{results.gamesPlayed}</span></p>
			<p class="history-item">Games Complete:<span class="word">{results.numberComplete}</span></p>
			<p class="history-item">Time Played:<span class="word">{results.timePlayed}</span></p>
		</article>
	</div>
	<div class="card">
		<h2>Share Your Results</h2>
		<article style="display: flex; flex-direction:column">
			<p>{shareString}</p>
			<button class="copy">Copy to share</button>
		</article>
	</div>
</div>




<style>
	.top {
		margin-bottom: 1rem;
	
	}
	.history-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.history {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: start;
		gap: 0.5rem;
	}
	.card {
		margin-bottom: 9px;
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
		background-color: var(--pico-primary-focus);
	}
	article {
		padding: 0.5rem;
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
