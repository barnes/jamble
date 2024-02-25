// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface GameState {
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
	}
}

export {};
