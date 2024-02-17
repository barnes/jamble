<script lang="ts">
	import { categories } from '$lib/categories';
	import { storeGame } from '$lib/db';
	import { dev } from '$app/environment';
	import GameEnd from '$lib/GameEnd.svelte';
	import results from '$lib/stores/results';
	import CompletedWords from '$lib/CompletedWords.svelte';
	export const prerender = true;
	export const ssr = false;

	// console.log($results);

	results.subscribe((value) => {
		console.log(typeof value);
		console.log(Object.keys(value));
		Object.keys(value).forEach((key) => {
			console.log(key);
			console.log(value[key]);
		});
	});

	const updateResults = (time) => {};

	let todaysCategory = categories[Math.floor(Math.random() * categories.length)];

	const shuffleWord = (word: string) => {
		const shuffled = word
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('');
		if (shuffled === word) {
			return shuffleWord(word);
		} else {
			return shuffled;
		}
	};

	const getWords = (category) => {
		const shuffledWords = category.words.map((word) => shuffleWord(word));
		return { todaysCategory: category, shuffledWords };
	};

	let todaysWords = getWords(todaysCategory);

	let record = !dev;

	console.log(record);

	// const todaysWords = [getRandom(0), getRandom(1), getRandom(2), getRandom(3)];
	// const shuffledWords = todaysWords.map((word) => shuffleWord(word));
	let green = '#4c8577';
	let red = '#FF5A5F';
	let yellow = '#edcf8e';

	let gameState = $state({
		timer: 0,
		timerWidth: '100%',
		timerColor: green,
		state: 'start', //start, playing, end
		currentShuffle: todaysWords['shuffledWords'][0],
		currentWord: todaysWords.todaysCategory.words[0],
		category: todaysWords.todaysCategory.name,
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
				gameState.correctCount++;
				gameState.correctWords.push(gameState.currentWord);
				gameState.currentShuffle =
					todaysWords['shuffledWords'][
						todaysWords['shuffledWords'].indexOf(gameState.currentShuffle) + 1
					];
				gameState.currentWord =
					todaysWords.todaysCategory.words[
						todaysWords['shuffledWords'].indexOf(gameState.currentShuffle)
					];
				if (gameState.currentShuffle === undefined) {
					clearInterval(timer);
					gameState.completeGame = true;
					gameState.lastWord = gameState.currentWord;
					let timeToComplete = Math.floor((30000 - gameState.timer) / 1000);
					if (record) {
						storeGame(
							gameState.category,
							gameState.correctCount,
							todaysWords.todaysCategory.words.length,
							todaysWords.todaysCategory.words,
							gameState.correctWords,
							gameState.completeGame,
							timeToComplete
						);
					}
					results.update((value) => {
						return {
							gamesPlayed: value.gamesPlayed + 1,
							numberCorrect: value.numberCorrect.push(gameState.correctCount),
							numberComplete: value.numberComplete + 1,
							timePlayed: value.timePlayed + timeToComplete
						};
					});
					gameState.state = 'end';
					todaysWords = getWords(categories[Math.floor(Math.random() * categories.length)]);
					gameState.currentShuffle = todaysWords['shuffledWords'][0];
					gameState.currentWord = todaysWords.todaysCategory.words[0];
					gameState.category = todaysWords.todaysCategory.name;
				}
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
						gameState.category,
						gameState.correctCount,
						todaysWords.todaysCategory.words.length,
						todaysWords.todaysCategory.words,
						gameState.correctWords,
						gameState.completeGame,
						timeToComplete
					);
				}
				results.update((value) => {
					return {
						gamesPlayed: value.gamesPlayed + 1,
						numberCorrect: value.numberCorrect.push(gameState.correctCount),
						timePlayed: value.timePlayed + 30
					};
				});
				todaysWords = getWords(categories[Math.floor(Math.random() * categories.length)]);
				gameState.currentShuffle = todaysWords['shuffledWords'][0];
				gameState.currentWord = todaysWords.todaysCategory.words[0];
				gameState.category = todaysWords.todaysCategory.name;
				gameState.state = 'end';
			}
		}, 150);
	};
</script>

<div class="game">
	{#if gameState.state == 'start'}
		<article>
			<p>
				You've got 30 seconds to un-scramble as many words as possible. Your score is the number of
				words you clear. Get a 'perfect' game by unscrambling all 8 words!
			</p>
			<p>
				<em
					>This game is in very, very early stages of development. Send feedback to ryan@barnes.lol</em
				>
			</p>
		</article>
	{/if}

	<div class="game-container">
		{#if gameState.state == 'start'}
			<div class="button">
				<button on:click={startGame}>Play!</button>
			</div>
		{:else if gameState.state == 'playing'}
			<div style={timerStyles}>{Math.floor(gameState.timer / 1000)}</div>
			<div class="category">
				The Category: {gameState.category}
			</div>
			<div class="word">{gameState.currentShuffle}</div>
			<input id="gameInput" type="text" bind:value={gameState.guess} autofocus />
			<CompletedWords correctWords={gameState.correctWords} correctCount={gameState.correctCount} />
		{:else if gameState.state == 'end'}
			<GameEnd
				correctCount={gameState.correctCount}
				correctWords={gameState.correctWords}
				lastWord={gameState.lastWord}
			/>
			<div class="button">
				<button on:click={startGame}>Play Again!</button>
			</div>
		{/if}
	</div>
</div>

<style>
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
