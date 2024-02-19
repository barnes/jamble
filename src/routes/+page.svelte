<script lang="ts">
	import { categories } from '$lib/categories';
	import { puzzles } from '$lib/puzzles';
	import { storeGame } from '$lib/db';
	import { browser, dev } from '$app/environment';
	import GameEnd from '$lib/GameEnd.svelte';
	import CompletedWords from '$lib/CompletedWords.svelte';
	export const prerender = true;
	export const ssr = false;

	const updateLocalStorage = (key, value) => {
		if (browser) {
			window.localStorage.setItem(`scram-${key}`, `${value[key]}`);
		}
	};

	const updateResults = (complete: boolean, timePlayed: number, lastPuzzle: string, lastCorrect: number, lastWords: string, lastWord: string) => {
		if (browser) {
			const currentGamesPlayed = parseInt(window.localStorage.getItem('scram-gamesPlayed') || '0');
			const currentNumberComplete = parseInt(
				window.localStorage.getItem('scram-numberComplete') || '0'
			);
			const currentTimePlayed = parseInt(window.localStorage.getItem('scram-timePlayed') || '0');

			window.localStorage.setItem('scram-gamesPlayed', (currentGamesPlayed + 1).toString());
			if (complete)
				window.localStorage.setItem('scram-numberComplete', (currentNumberComplete + 1).toString());
			window.localStorage.setItem('scram-timePlayed', (currentTimePlayed + timePlayed).toString());
			window.localStorage.setItem('scram-lastPuzzle', lastPuzzle);
			window.localStorage.setItem('scram-lastCorrect', lastCorrect.toString());
			window.localStorage.setItem('scram-lastWords', lastWords);	
			window.localStorage.setItem('scram-lastWord', lastWord);
		}
	};
	
	let lastPuzzle = $state('');
	let lastCorrect = $state(0);
	let lastWords = $state([]);
	let lastWord = $state('');
	if (browser) {
		lastPuzzle = window.localStorage.getItem('scram-lastPuzzle') || '';
		lastCorrect = parseInt(window.localStorage.getItem('scram-lastCorrect') || '0');
		lastWord = window.localStorage.getItem('scram-lastWord') || '';
		lastWords = (window.localStorage.getItem('scram-lastWords')|| '').split(', ');
	}



	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1; // month is zero-based
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const todaysDate = mm + '.' + dd + '.' + yyyy;

	let record = !dev;
	let green = '#4c8577';
	let red = '#FF5A5F';
	let yellow = '#edcf8e';

	const todaysPuzzle = puzzles[todaysDate];

	let gameState = $state({
		timer: 0,
		timerWidth: '100%',
		timerColor: green,
		state: 'start', //start, playing, end
		currentWordCount: 0,
		currentShuffle: todaysPuzzle[0][1],
		currentWord: todaysPuzzle[0][0],
		guess: '',
		correctCount: 0,
		correctWords: [],
		completeGame: false,
		lastWord: ''
	});

	const timerStyles = $derived(
		`color: black; transition: width 1s; border-radius: 2rem; background-color: ${gameState.timerColor}; font-size: 2rem; margin: 1rem auto; display:flex; justify-content: center; width:${gameState.timerWidth}`
	);

	const startGame = () => {
		gameState.state = 'playing';
		gameState.timer = 30000;
		// gameState.guess = '';
		gameState.correctCount = 0;
		gameState.correctWords = [];
		gameState.lastWord = '';
		const timer = setInterval(() => {
			if (gameState.currentWord === gameState.guess.toLowerCase().replaceAll(' ', '')) {
				gameState.guess = '';
				gameState.currentWordCount++;
				gameState.correctCount++;
				gameState.correctWords.push(gameState.currentWord);
				if (todaysPuzzle[gameState.currentWordCount] === undefined) {
					clearInterval(timer);
					gameState.completeGame = true;
					gameState.lastWord = gameState.currentWord;
					let timeToComplete = Math.floor((30000 - gameState.timer) / 1000);
					if (record) {
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
					updateResults(true, timeToComplete, todaysDate, gameState.correctCount, gameState.correctWords.join(', '), gameState.lastWord);
					gameState.state = 'end';
				}
				gameState.currentShuffle = todaysPuzzle[gameState.currentWordCount][1];
				gameState.currentWord = todaysPuzzle[gameState.currentWordCount][0];
			}
			gameState.timerWidth = `${(gameState.timer / 30000) * 100}%`;
			gameState.timer -= 150;
			if (gameState.timer < 15000 && gameState.timer > 10000) {
				gameState.timerColor = yellow;
			} else if (gameState.timer < 10000) {
				gameState.timerColor = red;
			}
			if (gameState.timer <= 0) {
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
				updateResults(false, 30, todaysDate, gameState.correctCount, gameState.correctWords.join(', '), gameState.lastWord);
				gameState.state = 'end';
			}
		}, 150);
	};
</script>

<div class="game">
	{#if gameState.state == 'start' && lastPuzzle != todaysDate}
		<article>
			<p>
				You've got 30 seconds to un-scramble as many words as possible. Your score is the number of
				words you clear. Get a 'perfect' game by unscrambling all 6 words!
			</p>
			<p>
				<em
					>This game is in very, very early stages of development. Send feedback to ryan@barnes.lol</em
				>
			</p>
		</article>
	{/if}

	<div class="game-container">
		{#if gameState.state == 'start' && lastPuzzle != todaysDate}
			<div class="button">
				<button on:click={startGame}>Play!</button>
			</div>
		{:else if gameState.state == 'playing'}
			<div style={timerStyles}>{Math.floor(gameState.timer / 1000)}</div>
			<div class="word">{gameState.currentShuffle}</div>
			<input id="gameInput" type="text" bind:value={gameState.guess} autofocus />
			<CompletedWords correctWords={gameState.correctWords} correctCount={gameState.correctCount} />
		{:else if gameState.state == 'end'}
			<h3>Thanks for playing. Come back tomorrow for another puzzle!</h3>
			<GameEnd
				correctCount={gameState.correctCount}
				correctWords={gameState.correctWords}
				lastWord={gameState.lastWord}
			/>
		{:else if lastPuzzle == todaysDate}
			<h3>Thanks for playing. Come back tomorrow for another puzzle!</h3>
			<GameEnd
				correctCount={lastCorrect}
				correctWords={lastWords}
				lastWord={lastWord}
			/>
		{/if}
	</div>
</div>

<style>
	h3{
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
