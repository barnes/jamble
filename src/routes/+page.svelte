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
  let green = '#4c8577';
  let red = '#FF5A5F';
  let yellow = '#edcf8e';

	let gameState = $state({
		timer: 0,
    timerWidth: '100%',
    timerColor: green,
		state: 'start', //start, playing, end 
		currentShuffle: todaysWords['shuffledWords'][0],
    currentWord: todaysWords['todaysWords'][0],
		guess: '',
    correctCount: 0,
    correctWords: [],
    completeGame: false
	});

  console.log(gameState);

  

  const timerStyles = $derived(`color: black; transition: width 1s; border-radius: 2rem; background-color: ${gameState.timerColor}; font-size: 2rem; margin: 1rem auto; display:flex; justify-content: center; width:${gameState.timerWidth}`);
	const startGame = () => {
		gameState.state = 'playing';
		gameState.timer = 30000;
     gameState.correctCount = 0;
    gameState.correctWords = [];
		const timer = setInterval(() => {
			if (gameState.currentWord === gameState.guess.toLowerCase().replaceAll(' ','')) {
        gameState.correctCount++;
        gameState.correctWords.push(gameState.currentWord);
				gameState.currentShuffle = todaysWords['shuffledWords'][todaysWords['shuffledWords'].indexOf(gameState.currentShuffle) + 1];
        gameState.currentWord = todaysWords['todaysWords'][todaysWords['todaysWords'].indexOf(gameState.currentWord) + 1];
				gameState.guess = ''
        if(gameState.currentShuffle === undefined) {
          clearInterval(timer);
          gameState.completeGame = true;
          gameState.state = 'end';
        }
			}
      gameState.timerWidth = `${(gameState.timer / 30000) * 100}%`;
			gameState.timer -= 150;
      if(gameState.timer < 15000 && gameState.timer > 10000) {
        gameState.timerColor = yellow;
      } else if (gameState.timer < 10000) {
        gameState.timerColor = red;
      }
			if (gameState.timer <= 0) {
				clearInterval(timer);
				gameState.state = 'end';
			}
      }, 150);
	};


</script>

<div class="title">
  <h1>SCRAM</h1>
  <span>A word game.</span>
</div>

{#if gameState.state == 'start' || gameState.state == 'end'}
<article>
<p>
	You've got 30 seconds to un-scramble as many words as possible. Your score is the number of words you clear. Get a 'perfect' game by unscrambling all 8 words! 
</p>
<em>This game is in very, very early stages of development. Send feedback to ryan@barnes.lol</em>
</article>
{/if}

{#if gameState.state == 'start'}
 <div class="button">
   <button on:click={startGame}>Play!</button>
 </div>
{:else if gameState.state == 'playing'}
<div style={timerStyles}>{Math.floor(gameState.timer/1000)}</div>

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
  .timer {
    font-size: 2rem;
    margin: 1rem 0;
    display:flex;
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
</style>