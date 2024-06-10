// import { browser } from '$app/environment';
import { storeGame } from './db';

export interface GameState {
	timer: number;
	timerWidth: string;
	timerColor: string;
	state: string;
	currentWordCount: number;
	currentShuffle: string;
	currentWord: string;
	guess: string;
	correctCount: number;
	correctWords: string[];
	completeGame: boolean;
	lastWord: string;
}

// export const updateLocalStorage = (key: string, value: string) => {
// 	if (browser) {
// 		window.localStorage.setItem(`scram-${key}`, `${value[key]}`);
// 	}
// };

export const updateLocalResults = (
	complete: boolean,
	timePlayed: number,
	lastPuzzle: string,
	lastCorrect: number,
	lastWords: string,
	lastWord: string
) => {
	const currentGamesPlayed = parseInt(window.localStorage.getItem('scram-gamesPlayed') || '0');
	const currentNumberComplete = parseInt(
		window.localStorage.getItem('scram-numberComplete') || '0'
	);
	const currentTimePlayed = parseInt(window.localStorage.getItem('scram-timePlayed') || '0');

	window.localStorage.setItem('scram-gamesPlayed', (currentGamesPlayed + 1).toString());
	if (complete) {
		window.localStorage.setItem('scram-numberComplete', (currentNumberComplete + 1).toString());
	} else {
		window.localStorage.setItem('scram-numberComplete', currentNumberComplete.toString());
	}
	window.localStorage.setItem('scram-timePlayed', (currentTimePlayed + timePlayed).toString());
	window.localStorage.setItem('scram-lastPuzzle', lastPuzzle);
	window.localStorage.setItem('scram-lastCorrect', lastCorrect.toString());
	window.localStorage.setItem('scram-lastWords', lastWords);
	window.localStorage.setItem('scram-lastWord', lastWord);
	console.log(window.localStorage)
};

export const getToday = () => {
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1; // month is zero-based
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	return mm + '.' + dd + '.' + yyyy;
};

export const initGame = (gameState: GameState): GameState => {
	gameState.state = 'playing';
	gameState.timer = 30000;
	gameState.correctCount = 0;
	gameState.correctWords = [];
	gameState.lastWord = '';

	return gameState;
};

export const correctGuess = (
	gameState: GameState,
	todaysPuzzle: string[],
	timer: NodeJS.Timeout,
	record: boolean,
	todaysDate: string
): GameState => {
	gameState.guess = '';
	gameState.currentWordCount++;
	gameState.correctCount++;
	gameState.correctWords.push(gameState.currentWord);
	if (todaysPuzzle[gameState.currentWordCount*2] === undefined) {
		clearInterval(timer);
		gameState.completeGame = true;
		gameState.lastWord = gameState.currentWord;
		const timeToComplete = Math.floor((30000 - gameState.timer) / 1000);
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
	}
	console.log(gameState.currentWordCount);
	gameState.currentShuffle = todaysPuzzle[(gameState.currentWordCount*2)+1];
	gameState.currentWord = todaysPuzzle[gameState.currentWordCount*2];
	return gameState;
};

export const gameTick = (gameState: GameState): GameState => {
	let red = '#FF5A5F';
	let yellow = '#edcf8e';
	let green = '#4c8577';
	gameState.timerWidth = `${(gameState.timer / 30000) * 100}%`;
	gameState.timer -= 150;
	if (gameState.timer < 15000 && gameState.timer > 10000) {
		gameState.timerColor = yellow;
	} else if (gameState.timer < 10000) {
		gameState.timerColor = red;
	}
	console.log('tick', gameState)
	return gameState;
};

export const gameOver = (
	gameState: GameState,
	timer: NodeJS.Timeout,
	record: boolean,
	todaysDate: string,
	todaysPuzzle: string[][]
): GameState => {
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
	return gameState;
};
