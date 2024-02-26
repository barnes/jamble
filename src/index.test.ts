import { describe, it, expect } from 'vitest';
import { puzzles } from '$lib/puzzles';
import { getToday, initGame, correctGuess, type GameState } from './lib/logic';

describe('initGame test', () => {
	const gameStateStart = {
		state: 'not started',
		timer: 0,
		correctCount: 0,
		correctWords: [],
		lastWord: ''
	};
	const gameStatePlaying = {
		state: 'playing',
		timer: 30000,
		correctCount: 0,
		correctWords: [],
		lastWord: ''
	};
	it('initializes the game state', () => {
		expect(initGame(gameStateStart)).toEqual(gameStatePlaying);
	});
});

describe('Validate all puzzles', () => {
	Object.keys(puzzles).forEach((date) => {
		it(`validates ${date}`, () => {
			puzzles[date].forEach((puzzle) => {
				console.log(puzzle);
				expect(puzzle[0].length).toBe(puzzle[1].length);
				let wordLetters = puzzle[0].split('').sort();
				let scrambledLetters = puzzle[1].split('').sort();
				console.log(wordLetters, scrambledLetters)
				expect(wordLetters.toString() === scrambledLetters.toString()).toBe(true);
			});
		});
	});
});

// describe('correctGuess test', () => {
// 	const testPuzzle = [
// 		['ant', 'tan'],
// 		['bear', 'bare'],
// 		['could', 'locud'],
// 		['dragon', 'ngardo'],
// 		['friends', 'rdfinesi']
// 	];
// 	const gameStateInitWordsLeft: GameState = {
// 		state: 'playing',
// 		timer: 15000,
// 		correctCount: 0,
// 		correctWords: [],
// 		lastWord: '',
// 		currentWordCount: 0,
// 		currentShuffle: '',
// 		currentWord: '',
// 		guess: '',
// 		completeGame: false,
// 	};
// 	const timer = setInterval(() => {
// 		console.log('timer for vitest');
// 	},500);
// 	const record = false;
// 	const todaysDate = '02.24.2024';
// });

describe('getToday test', () => {
	it('gets the current date', () => {
		const today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // month is zero-based
		if (mm < 10) {
			mm = '0' + mm
		};
		let dd = today.getDate();

		expect(getToday()).toBe(`${mm}.${dd}.${yyyy}`);
	});
});
