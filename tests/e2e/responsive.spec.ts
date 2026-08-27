import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 700 },
  { width: 360, height: 760 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 820, height: 1024 },
  { width: 821, height: 1024 },
  { width: 834, height: 1112 },
  { width: 1024, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 }
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
    await expect(page.locator('.site-header .brand-logo img')).toBeVisible();
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

test('responsive: mobile gallery is explicit and gap before prices stays intentional', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  for (const width of [320, 360, 390, 430, 768, 820]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const grid = page.locator('.gallery-grid');
    const featured = page.locator('.gallery-item--mobile-featured');
    const items = page.locator('.gallery-item');
    await expect(items).toHaveCount(5);

    const gridBox = await grid.boundingBox();
    const featuredBox = await featured.boundingBox();
    expect(gridBox, `gallery grid at ${width}px`).not.toBeNull();
    expect(featuredBox, `featured gallery image at ${width}px`).not.toBeNull();

    if (gridBox && featuredBox) {
      expect(Math.abs(featuredBox.width - gridBox.width), `featured width at ${width}px`).toBeLessThanOrEqual(2);
      expect(featuredBox.height, `featured height at ${width}px`).toBeGreaterThan(120);
    }

    const boxes = await Promise.all(Array.from({ length: 5 }, (_, index) => items.nth(index).boundingBox()));
    const validBoxes = boxes.filter((box): box is NonNullable<typeof box> => box !== null);
    expect(validBoxes).toHaveLength(5);
    expect(Math.min(...validBoxes.map((box) => box.height)), `gallery item height at ${width}px`).toBeGreaterThan(80);

    const lastImageBottom = Math.max(...validBoxes.map((box) => box.y + box.height));
    const pricesContainer = await page.locator('.prices-section .container').boundingBox();
    expect(pricesContainer, `prices container at ${width}px`).not.toBeNull();
    if (pricesContainer) {
      const sectionGap = pricesContainer.y - lastImageBottom;
      expect(sectionGap, `gallery-to-prices gap at ${width}px`).toBeGreaterThanOrEqual(60);
      expect(sectionGap, `gallery-to-prices gap at ${width}px`).toBeLessThanOrEqual(90);
    }
  }
});
