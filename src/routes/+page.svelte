<script lang="ts">
	import { getPuzzle } from '$lib/getPuzzle';
	import {
		correctGuess,
		gameTick,
		getToday,
		initGame,
		updateLocalResults
	} from '$lib/logic';
	import { storeGame } from '$lib/db';
	import { browser, dev } from '$app/environment';
	import GameEnd from '$lib/components/GameEnd.svelte';
	import CompletedWords from '$lib/components/CompletedWords.svelte';
	import { onMount } from 'svelte';
	export const prerender = true;
	export const ssr = false;

	let lastPuzzle = $state('');
	let lastCorrect = $state(0);
	let lastWords = $state([]);
	let lastWord = $state('');
	if (browser) {
		lastPuzzle = window.localStorage.getItem('scram-lastPuzzle') || '';
		lastCorrect = parseInt(window.localStorage.getItem('scram-lastCorrect') || '0');
		lastWord = window.localStorage.getItem('scram-lastWord') || '';
		lastWords = (window.localStorage.getItem('scram-lastWords') || '').split(', ');
	}

	const todaysDate = getToday();

	let record = !dev;
	let green = '#4c8577';

	let todaysPuzzle: string[] = [];

	let gameState: GameState = $state({
		timer: 0,
		timerWidth: '100%',
		timerColor: green,
		state: 'start', //start, playing, end
		currentWordCount: 0,
		currentShuffle: todaysPuzzle[1],
		currentWord: todaysPuzzle[0],
		guess: '',
		correctCount: 0,
		correctWords: [],
		completeGame: false,
		lastWord: ''
	});

	let loading = $state(true);
	onMount(async () => {
		console.log('onMount');
		const getPuzzleResponse = await getPuzzle(false);
		todaysPuzzle = getPuzzleResponse.results[0].response.result.rows[0][2].value.split(',');
		gameState.currentShuffle = todaysPuzzle[1];
		gameState.currentWord = todaysPuzzle[0];
		console.log(todaysPuzzle);
		loading = false;
	});

	const timerStyles = $derived(
		`color: black; transition: width 1s; border-radius: 2rem; background-color: ${gameState.timerColor}; font-size: 2rem; margin: 1rem auto; display:flex; justify-content: center; width:${gameState.timerWidth}`
	);

	const startGame = () => {
		console.log(gameState);
		gameState = initGame(gameState);
		const timer = setInterval(() => {
			if (gameState.currentWord === gameState.guess.toLowerCase().replaceAll(' ', '')) {
				gameState = correctGuess(gameState, todaysPuzzle, timer, record, todaysDate);
			}
			gameState = gameTick(gameState);
			if (gameState.timer <= 0) {
				// gameState = gameOver(gameState, timer, record, todaysDate, todaysPuzzle);
				clearInterval(timer);
				gameState.lastWord = gameState.currentWord;
				if (record) {
					let timeToComplete = 30;
					storeGame(
						'null',
						gameState.correctCount,
						todaysPuzzle.length,
						todaysPuzzle,
						gameState.correctWords,
						gameState.completeGame,
						timeToComplete
					);
				}
				updateLocalResults(
					false,
					30,
					todaysDate,
					gameState.correctCount,
					gameState.correctWords.join(', '),
					gameState.lastWord
				);
				gameState.state = 'end';
				gameState.currentShuffle = '';
				gameState.currentWord = '';
			}
		}, 150);
	};
</script>

<div class="game">
	{#if loading}
		<div class="loading">
			<h1>Loading...</h1>
		</div>
	{:else}
		{#if gameState.state == 'start' && (lastPuzzle != todaysDate || lastPuzzle == '')}
			<article>
				<p>
					You've got 30 seconds to unscramble as many words as possible. Your score is the number of
					words you clear. Get a 'perfect' game by unscrambling all 6 words!
				</p>
				<p>
					<em
						>This game is in very, very early stages of development. Send feedback to
						ryan@barnes.lol</em
					>
				</p>
			</article>
		{/if}

		<div class="game-container">
			{#if gameState.state == 'start' && (lastPuzzle != todaysDate || lastPuzzle == '')}
				<div class="button">
					<button on:click={startGame}>Play!</button>
				</div>
			{:else if gameState.state == 'playing'}
				<div data-testid="timer" style={timerStyles}>{Math.floor(gameState.timer / 1000)}</div>
				<div class="word" data-testid="scrambled-word" id="scambled">
					{gameState.currentShuffle}
				</div>
				<input id="gameInput" type="text" bind:value={gameState.guess} autofocus />
				<CompletedWords
					correctWords={gameState.correctWords}
					correctCount={gameState.correctCount}
				/>
			{:else if gameState.state == 'end'}
				<h3>Thanks for playing. Come back tomorrow for another puzzle! (failed)</h3>
				<GameEnd
					correctCount={gameState.correctCount}
					correctWords={gameState.correctWords}
					lastWord={gameState.lastWord}
					{todaysPuzzle}
				/>
			{:else if lastPuzzle == todaysDate}
				<h3>Thanks for playing. Come back tomorrow for another puzzle!</h3>
				<GameEnd correctCount={lastCorrect} correctWords={lastWords} {lastWord} {todaysPuzzle} />
			{/if}
		</div>
	{/if}
</div>

<style>
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
	}
	h3 {
		margin-top: 1rem;
	}
	@media (max-width: 600px) {
		.game-container {
			width: 100%;
		}
		.word {
			font-size: 3rem;
			margin: 0.5rem 0;
			display: flex;
			justify-content: center;
		}
		.category {
			font-size: 1.5rem;
			margin: 0.5rem 0;
			display: flex;
			justify-content: center;
			border-bottom: 2px dashed var(--pico-primary);
			width: 100%;
			margin: 0 auto;
		}
	}
	@media (min-width: 600px) {
		.word {
			font-size: 4rem;
			margin: 1rem 0;
			display: flex;
			justify-content: center;
		}
		.category {
			font-size: 2rem;
			margin: 1rem 0;
			display: flex;
			justify-content: center;
			border-bottom: 2px dashed var(--pico-primary);
			width: 100%;
			margin: 0 auto;
		}
	}
	.record-setting {
		display: flex;
		flex-direction: column;
	}

	.button {
		margin: 1rem 0;
		display: flex;
		justify-content: center;
	}
	.timer {
		font-size: 2rem;
		margin: 0;
		display: flex;
		justify-content: center;
	}
	.title h1 {
		margin: 0;
	}
</style>
