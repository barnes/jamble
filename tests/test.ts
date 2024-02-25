import { expect, test } from '@playwright/test';
test('Validate game cannot be played if lastPuzzle is set in local storage.', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(()=>{
		const today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1; // month is zero-based
		let dd = today.getDate();
	
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
	
		const todaysDate = mm + '.' + dd + '.' + yyyy;
		localStorage.setItem('scram-lastPuzzle', todaysDate);
	})
	await page.goto('/');
	expect(await page.getByTestId('completeGrid')).toBe('visible');
	});
