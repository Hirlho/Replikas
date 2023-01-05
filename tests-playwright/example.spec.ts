import { test, expect } from "@playwright/test";

test("Search bar sets value to article URLParameter", async ({ page }) => {
	await page.goto("/?article=Dark%20Vador");

	await page.screenshot({ path: "example.png" });

	// create a locator
	const locator = page.locator('input[type="text"]');
	// get the value of the locator
	const value = await locator.inputValue();
	// assert the value
	expect(value).toBe("Dark Vador");
});
