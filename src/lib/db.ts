const url = 'https://scram-player-data-barnes.turso.io/v2/pipeline';
const authToken =
	'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgxMTA4OTMsImlkIjoiNzQ1N2FmYTEtY2NmZi0xMWVlLTlhYzAtZjJhZTA4MzhmMjg1In0.FJTlnJ6wc3SViRNjk3MyxYXAQpzPP_q8o36rvUPibOVzrdLtwk9JiUIALf7H1vPR71P42HlXdl0tPtGPk-PUCw';

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
	words: string[][],
	correctWords: string[],
	completeGame: boolean,
	timeToComplete: number
) => {
	fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${authToken}`,
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
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			requests: [{ type: 'execute', stmt: { sql: 'SELECT count(*) FROM games' } }, { type: 'close' }]
		})
	});
	return data.json();
}
