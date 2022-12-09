import { test, expect } from '@playwright/test';

test('homepage has title and links to intro page', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Welcome to Astro./);

  // create a locator
  const getStarted = page.getByRole('link', { name: 'Documentation' });

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', 'https://docs.astro.build/');

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*build/);
});
