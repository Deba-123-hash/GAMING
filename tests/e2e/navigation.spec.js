import { expect, test } from '@playwright/test';

test.describe('RIVALRY 90 Core Navigation & 3D Hub', () => {
  test('home page renders RIVALRY 90 title and 3D canvas shell', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /RIVALRY 90/i })).toBeVisible();
    await expect(page.getByText('Installed Technology Stack')).toBeVisible();
  });

  test('3D Development Hub search and external links work', async ({ page }) => {
    await page.goto('/resources/3d');
    await expect(
      page.getByRole('heading', { name: /RIVALRY 90 – 3D DEVELOPMENT HUB/i })
    ).toBeVisible();
    await page.getByLabel('Search 3D resources').fill('Poly Haven');
    await expect(page.getByRole('heading', { name: 'Poly Haven' })).toBeVisible();
  });
});
