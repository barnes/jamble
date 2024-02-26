import { browser } from '$app/environment';

export const updateLocalStorage = (key: string, value: string) => {
	if (browser) {
		window.localStorage.setItem(`scram-${key}`, `${value[key]}`);
	}
};

export const updateLocalResults = (
	complete: boolean,
	timePlayed: number,
	lastPuzzle: string,
	lastCorrect: number,
	lastWords: string,
	lastWord: string
) => {
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

export const getTodaysDate = () => {
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1; // month is zero-based
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	return mm + '.' + dd + '.' + yyyy;
};

export const gameInit = (gameState) => {
	const newGameState = gameState;
	newGameState.state = 'playing';
	newGameState.timer = 30000;
	newGameState.correctCount = 0;
	newGameState.correctWords = [];
	newGameState.lastWord = '';

	return newGameState;
};

export const wordCorrect = (gameState) => {
	gameState.guess = '';
	gameState.currentWordCount++;
	gameState.correctCount++;
	gameState.correctWords.push(gameState.currentWord);

	return gameState;
};

export const completeGame = (gameState) => {
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
	updateLocalResults(
		true,
		timeToComplete,
		todaysDate,
		gameState.correctCount,
		gameState.correctWords.join(', '),
		gameState.lastWord
	);
	gameState.state = 'end';
    return gameState;
};
