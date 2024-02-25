import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Play!' }).click();
  console.log(await page.locator('#scrambled').textContent());
  const guess = scambled.split('').reverse().join('');
  await page.locator('#gameInput').fill(guess);
});