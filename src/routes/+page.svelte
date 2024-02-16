<script lang="ts">
	import type { W } from "vitest/dist/reporters-1evA5lom.js";
  import { words } from '$lib/words'

	const getRandom = (set: number) => {
    const keys = Object.keys(words);

		return words[keys[set]][Math.floor(Math.random() * words[keys[set]].length)];
	};

	const shuffleWord = (word: string) => {
		const shuffled = word
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('');
    if(shuffled === word ) {
      return shuffleWord(word)
    } else{
      return shuffled
    };
	};

  const getWords = () => {
    const todaysWords = [getRandom(0), getRandom(1), getRandom(2), getRandom(3), getRandom(4), getRandom(5), getRandom(6), getRandom(7)];
    const shuffledWords = todaysWords.map((word) => shuffleWord(word));
    return {todaysWords, shuffledWords}
  
  }

  let todaysWords = getWords();

  console.log(todaysWords);

	// const todaysWords = [getRandom(0), getRandom(1), getRandom(2), getRandom(3)];
	// const shuffledWords = todaysWords.map((word) => shuffleWord(word));

	let gameState = $state({
		timer: 0,
		state: 'start', //start, playing, end 
		currentShuffle: todaysWords['shuffledWords'][0],
    currentWord: todaysWords['todaysWords'][0],
		guess: '',
    correctCount: 0,
    correctWords: [],
    completeGame: false
	});

  console.log(gameState);

	const startGame = () => {
		gameState.state = 'playing';
		gameState.timer = 30;
     gameState.correctCount = 0;
    gameState.correctWords = [];
		const timer = setInterval(() => {
			if (gameState.currentWord === gameState.guess) {
        gameState.correctCount++;
        gameState.correctWords.push(gameState.currentWord);
				gameState.currentShuffle = todaysWords['shuffledWords'][todaysWords['shuffledWords'].indexOf(gameState.currentShuffle) + 1];
        gameState.currentWord = todaysWords['todaysWords'][todaysWords['todaysWords'].indexOf(gameState.currentWord) + 1];
				gameState.guess = '';
        if(gameState.currentShuffle === undefined) {
          clearInterval(timer);
          gameState.completeGame = true;
          gameState.state = 'end';
        }
			}
			gameState.timer--;
			if (gameState.timer <= 0) {
				clearInterval(timer);
				gameState.state = 'end';
			}
		}, 1000);
	};

</script>

<h1>Jamble</h1>
<p>
	You've got 30 seconds to un-jumble as many words as possible. Your score is the number of words you clear. 
</p>

{#if gameState.state == 'start'}
 <div class="button">
   <button on:click={startGame}>Play!</button>
 </div>
{:else if gameState.state == 'playing'}
	{gameState.timer}
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
      <li>The last word you did not get was {gameState.currentWord}</li>
    {/if}
  </ul>
  <div class="button">
    <button on:click={startGame}>Play Again!</button>
  </div>
{/if}

<style>
  .word {
    font-size: 4rem;
    margin: 1rem 0;
    display:flex;
    justify-content: center;
  }
  .button {
    margin: 1rem 0;
    display: flex;
    justify-content: center;
  }
</style>