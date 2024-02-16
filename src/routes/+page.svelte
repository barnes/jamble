<script lang="ts">
	import type { W } from "vitest/dist/reporters-1evA5lom.js";

	const words = {
  "3_letters": ["cat", "dog", "cow", "pig", "fox"],
  "4_letters": ["wolf", "bear", "lion", "goat", "deer"], 
  "5_letters": ["horse", "zebra", "camel", "llama", "sheep"],
  "6_letters": ["donkey", "monkey", "lemur", "bunny", "ferret"],
  "7_letters": ["buffalo", "elephant", "dolphin", "raccoon", "squirrel"]
};

	const getRandom = (set: number) => {
		return words[Object.keys(words)[set]][Math.floor(Math.random() * 5)];
	};

	const shuffleWord = (word: string) => {
		return word
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('');
	};

	const todaysWords = [getRandom(0), getRandom(1), getRandom(2), getRandom(3)];
	const shuffledWords = todaysWords.map((word) => shuffleWord(word));
	console.log(todaysWords);
	console.log(shuffledWords);

	let gameState = $state({
		timer: 0,
		state: 'start', //start, playing, win, loss
		currentShuffle: shuffledWords[0],
    currentWord: todaysWords[0],
		guess: ''
	});

	const startGame = () => {
		gameState.state = 'playing';
		gameState.timer = 30;
		const timer = setInterval(() => {
			if (gameState.currentWord === gameState.guess) {
				gameState.currentShuffle = shuffledWords[shuffledWords.indexOf(gameState.currentShuffle) + 1];
        gameState.currentWord = todaysWords[todaysWords.indexOf(gameState.currentWord) + 1];
        console.log(gameState.currentWord);
        console.log(gameState.currentShuffle);

				gameState.guess = '';
				if (gameState.currentWord === undefined) {
					gameState.state = 'win';
				}
			}
			gameState.timer--;
			if (gameState.timer <= 0) {
				clearInterval(timer);
				gameState.state = 'loss';
			}
		}, 1000);
	};

	console.log(gameState);
</script>

<h1>Jamble</h1>
<p>
	You've got 30 seconds to un-jumble as many words as possible. Guess all 5 of todays words to win.
	Come back tomorrow for a fresh puzzle!
</p>

{#if gameState.state == 'start'}
	<button on:click={startGame}>Play!</button>
{:else if gameState.state == 'playing'}
	{gameState.timer}
	<h2>{gameState.currentShuffle}</h2>
	<input id="gameInput" type="text" bind:value={gameState.guess} autofocus />
{:else if gameState.state == 'win'}
	<h2>You win!</h2>
{:else if gameState.state == 'loss'}
	<h2>You lose!</h2>
{/if}
