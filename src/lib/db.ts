import { PUBLIC_TURSO_URL, PUBLIC_TURSO_AUTH_TOKEN } from '$env/static/public';
const url = PUBLIC_TURSO_URL; 

const createDbQuery = `CREATE TABLE games (
         ID INTEGER PRIMARY KEY AUTOINCREMENT, 
         createdAt TEXT DEFAULT CURRENT_TIMESTAMP, 
         category TEXT, correctCount INTEGER, 
         totalWords INTEGER, 
         words JSON, 
         correctWords JSON, 
         completeGame BOOLEAN, 
         timeToComplete INTEGER
         )`;
		 
    
const storeGameQuery = `INSERT INTO games (category, correctCount, totalWords, words, correctWords, completeGame, timeToComplete) VALUES (?, ?, ?, ?, ?, ?, ?)`;

export const storeGame = (
	category: string,
	correctCount: number,
	totalWords: number,
	words: string[],
	correctWords: string[],
	completeGame: boolean,
	timeToComplete: number
) => {
	fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${PUBLIC_TURSO_AUTH_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			requests: [{ type: 'execute', stmt: { sql: `INSERT INTO games (category, correctCount, totalWords, words, correctWords, completeGame, timeToComplete) VALUES ("${category}", ${correctCount}, ${totalWords}, '{${words}}', '{${correctWords}}', ${completeGame}, ${timeToComplete});` } }, { type: 'close' }]
		})
	})
		.then((res) => res.json())
		.then((data) => console.log(data))
		.catch((err) => console.log(err));
};

export const getRunCount = async () => {
	const data = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${PUBLIC_TURSO_AUTH_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			requests: [{ type: 'execute', stmt: { sql: 'SELECT count(*) FROM games' } }, { type: 'close' }]
		})
	});
	return data.json();
}

const storePuzzleQuery = `INSERT INTO puzzles (puzzle) VALUES (?)`;

export const storeTest = async (puzzle: string) => {

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${PUBLIC_TURSO_AUTH_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			requests: [{ type: 'execute', stmt: { sql: `INSERT INTO puzzles (puzzle) VALUES ("${puzzle}");` } }, { type: 'close' }]
		})
	});
	const response = await res.json();
	console.log(response);
	return response;
}

export const getMostRecentPuzzle = async () => {
	const data = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${PUBLIC_TURSO_AUTH_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			requests: [{ type: 'execute', stmt: { sql: 'SELECT * FROM puzzles ORDER BY ID DESC LIMIT 1' } }, { type: 'close' }]
		})
	});
	return data.json();
}

