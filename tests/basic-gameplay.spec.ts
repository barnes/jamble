import { test, expect } from '@playwright/test';
import { getToday } from '../src/lib/logic';
import { puzzles } from '../src/lib/puzzles';

const tryToSolve = async (page, todaysPuzzle, index) => {
  console.log('Trying to solve', index);
	let scrambledWord = await page.getByTestId('scrambled-word').textContent();
  let guess = scramble(scrambledWord);
  for (let i = 0; i < 5; i++){
    guess = scramble(scrambledWord);
    if(guess === todaysPuzzle[index][0]){
    } else {
      await page.locator('input').fill(guess);
      await page.waitForTimeout(500);
    }
  }
  await page.locator('input').fill(todaysPuzzle[index][0]);
  await page.waitForTimeout(500);
  if(index === todaysPuzzle.length - 1){
    console.log('puzzle solved, skipping');
  } else {
    expect(await page.getByTestId('scrambled-word')).toHaveText(todaysPuzzle[index+1][1]);
  }
    
};

const scramble = (word: string): string => {
  return word.split('').sort(function () {
    return 0.5 - Math.random();
  }).join('');
}

test('Solve the puzzle', async ({ page }) => {
  test.slow();
	const today = getToday();
	const todaysPuzzle = puzzles[today];
	await page.goto('/');
	await page.waitForTimeout(1000);
	await page.getByRole('button', { name: 'Play!' }).click();
  for (let i = 0; i < todaysPuzzle.length; i++){
    await tryToSolve(page, todaysPuzzle, i);
  }
  await page.waitForTimeout(1000);
  await expect(page.getByRole('heading', { name: 'Thanks for playing. Come back' })).toBeVisible();
  await expect(page.getByText('✅✅✅✅✅✅')).toBeVisible();
});

test('Fail the puzzle', async ({ page }) => {
  test.slow();
	const today = getToday();
	const todaysPuzzle = puzzles[today];
	await page.goto('/');
	await page.waitForTimeout(1000);
	await page.getByRole('button', { name: 'Play!' }).click();
  for (let i = 0; i < todaysPuzzle.length-2; i++){
    await tryToSolve(page, todaysPuzzle, i);
  }
  const time = await page.getByTestId('timer').textContent();
  console.log('Skipping last two words, waiting for time to expire.');
  await page.waitForTimeout((parseInt(time) * 1000)+2000);
  await expect(page.getByRole('heading', { name: 'Thanks for playing. Come back' })).toBeVisible();
  await expect(page.getByText('✅✅✅✅❌❌')).toBeVisible();
});
