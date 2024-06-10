import { getMostRecentPuzzle } from "./db"

export const getPuzzle = async (force: boolean) => {
    // Get the most recent puzzle and compare the created date to today's date.
    const todaysPuzzle = await getMostRecentPuzzle();

    const todaysPuzzleDate = new Date(todaysPuzzle.results[0].response.result.rows[0][1].value);
    const today = new Date();

    // compare the day, month and year of the created date to today's date.


    console.log(todaysPuzzleDate);
    console.log(today);

    console.log(force);


    if(todaysPuzzleDate.getDate() === today.getDate() && todaysPuzzleDate.getMonth() === today.getMonth() && todaysPuzzleDate.getFullYear() === today.getFullYear() && !force){
        console.log('Puzzle already present');
        return todaysPuzzle;
    } else if(force){
        // Get a new puzzle
        console.log('Need a new puzzle! Forced.')
        const response = await fetch('/puzzle');
        const data = await response.json();
        const newPuzzle = await getMostRecentPuzzle();
        return newPuzzle;
    } else {
        console.log('Need a new puzzle!')
        const response = await fetch('/puzzle');
        const data = await response.json();
        const newPuzzle = await getMostRecentPuzzle();
        return newPuzzle;
    }

    // // If the created date is not today, generate a new puzzle.
    // if (todaysPuzzle.created !== today) {
    //     const response = await fetch('/puzzle/+server');
    //     const data = await response.json();
    //     return data;
    // }

}