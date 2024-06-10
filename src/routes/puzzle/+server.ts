import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { storeTest } from '$lib/db';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const GET: RequestHandler = async () => {
	const completePuzzle: string[][] = [];
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content:
					'You output puzzles in JSON format. Each puzzle consists of 5 words. The first word is 3 letters long, with each subsequent word increasing by 1 letter. The last word is 7 letters long. For example: cat, fish, mouse, monkey, grackel. Please output the next puzzle.'
			},
			{
				role: 'user',
				content:
					'Please generate a puzzle. Ensure each word if the correct length. Do not feel obligated to keep all words in a theme.'
			}
		],
		model: 'gpt-3.5-turbo-0125',
		response_format: { type: 'json_object' }
	});
	console.log(completion);
	console.log(completion.choices[0].message.content);

 
	const puzzle = JSON.parse(completion.choices[0].message.content || '{}');


	for (const [key, value] of Object.entries(puzzle)){
		const val = value as string;
        let newWord = [val, val];
        while(newWord[0] === newWord[1]){
            newWord = [val, val.split('').sort(function(){return 0.5-Math.random()}).join('')]
        }
        completePuzzle.push(newWord);
	}

    console.log(completePuzzle);

    const res = await storeTest(completePuzzle);
    
	return new Response(JSON.stringify(res), { status: 200 });
};
