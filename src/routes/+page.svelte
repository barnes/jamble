<script lang="ts">
	const words = {
		'4_letter_words': [
			'ghost',
			'wriggle',
			'laugh',
			'steam',
			'blush',
			'smile',
			'shake',
			'roar',
			'dance',
			'shout'
		],
		'5_letter_words': [
			'dream',
			'ocean',
			'cabin',
			'forest',
			'sunset',
			'melody',
			'rainbow',
			'journey',
			'whisper',
			'courage'
		],
		'6_letter_words': [
			'mystery',
			'science',
			'cascade',
			'twilight',
			'festival',
			'treasure',
			'rainbow',
			'journey',
			'whisper',
			'courage'
		],
		'7_letter_words': [
			'crystal',
			'butterfly',
			'starlight',
			'mountain',
			'waterfall',
			'wonderland',
			'adventure',
			'knowledge',
			'gratitude',
			'inspiration'
		]
	};

	const getRandom = (set: number) => {
		return words[Object.keys(words)[set]][Math.floor(Math.random() * 10)];
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
  <!-- <p>{gameState.currentWord}</p> -->
	<input type="text" bind:value={gameState.guess} />
{:else if gameState.state == 'win'}
	<h2>You win!</h2>
{:else if gameState.state == 'loss'}
	<h2>You lose!</h2>
{/if}
