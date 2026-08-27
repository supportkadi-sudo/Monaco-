import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 700 },
  { width: 360, height: 760 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 }
] as const;

test('responsive: no horizontal overflow across target widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));

    expect(metrics.scrollWidth, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(metrics.clientWidth + 1);
    await expect(page.getByRole('heading', { name: /MONACO\s*AQUAPARK/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Забронировать' }).first()).toBeVisible();
  }
});

test('responsive: mobile hero copy keeps controlled lines', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  for (const width of [320, 360, 375, 390, 412, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');

    const emotion = page.locator('.hero-emotion');
    await expect(emotion).toBeVisible();
    const lines = emotion.locator('span');
    await expect(lines).toHaveCount(3);
    await expect(lines.nth(0)).toHaveText('Отдых,');
    await expect(lines.nth(1)).toHaveText('к которому хочется');
    await expect(lines.nth(2)).toHaveText('вернуться');

    const bounds = await emotion.boundingBox();
    expect(bounds, `hero copy bounds at ${width}px`).not.toBeNull();
    if (bounds) expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
  }
});
