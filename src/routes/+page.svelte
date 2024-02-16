<script lang="ts">
	import { categories } from '$lib/categories';
	import { storeGame } from '$lib/db';


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

	let record = true;

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
		gameState.correctCount = 0;
		gameState.correctWords = [];
		gameState.lastWord = '';
		console.log(gameState);
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
					if (record) {
						let timeToComplete = Math.floor((30000 - gameState.timer) / 1000);
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
					gameState.state = 'end';
					todaysWords = getWords(categories[Math.floor(Math.random() * categories.length)]);
					gameState.currentShuffle = todaysWords['shuffledWords'][0];
					gameState.currentWord = todaysWords.todaysCategory.words[0];
					gameState.category = todaysWords.todaysCategory.name
					console.log(todaysWords);
					console.log(gameState);
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
				console.log(categories[Math.floor(Math.random() * categories.length)]);
				todaysWords = getWords(categories[Math.floor(Math.random() * categories.length)]);
				gameState.currentShuffle = todaysWords['shuffledWords'][0];
				gameState.currentWord = todaysWords.todaysCategory.words[0];
				gameState.category = todaysWords.todaysCategory.name
				gameState.state = 'end';
				console.log(todaysWords);
				console.log(gameState);
			}
		}, 150);
	};
</script>

<div class="game">
	<div class="title">
		<h1>SCRAM</h1>
		<span>A word game.</span>
	</div>

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
				The Category:
				{gameState.category}
			</div>
			<div class="word">{gameState.currentShuffle}</div>
			<input id="gameInput" type="text" bind:value={gameState.guess} autofocus />
		{:else if gameState.state == 'end'}
			<h2>Game over!</h2>
			<ul>
				<li>You got {gameState.correctCount} words correct!</li>
				<li>Correct words: {gameState.correctWords.join(', ')}</li>
				{#if gameState.correctCount === 8}
					<li>Well done! You got all the words!</li>
				{:else}
					<li>The last word you did not get was {gameState.lastWord}</li>
				{/if}
			</ul>
			<div class="button">
				<button on:click={startGame}>Play Again!</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.record-setting {
		display: flex;
		flex-direction: column;
	}

	.word {
		font-size: 4rem;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
	}
	.button {
		margin: 1rem 0;
		display: flex;
		justify-content: center;
	}
	.timer {
		font-size: 2rem;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
	}
	.title {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		align-items: center;
		align-content: center;
		margin-bottom: 2rem;
	}
	.title h1 {
		margin: 0;
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
</style>
