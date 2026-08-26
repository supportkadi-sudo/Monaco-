import { expect, test } from '@playwright/test';

test('desktop: public site, booking and admin status flow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /MONACO\s*AQUAPARK/i })).toBeVisible();
  await expect(page.locator('#prices')).toContainText('130 000');

  await page.locator('.gallery-item').first().click();
  await expect(page.locator('.lightbox')).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть' }).click();

  await page.locator('#booking').scrollIntoViewIfNeeded();
  await page.getByLabel('Имя').fill('E2E Гость');
  await page.getByLabel('Телефон').fill('+998 90 123 45 67');
  await page.getByLabel(/Telegram/).fill('https://t.me/e2e_monaco_guest');
  await page.getByLabel('Дата посещения').fill('2099-01-10');
  await page.getByLabel('Комментарий').fill('Автоматическая проверка заявки');
  await page.getByRole('button', { name: 'Оставить заявку' }).click();
  await expect(page.getByRole('heading', { name: 'Заявка принята' })).toBeVisible();

  await page.screenshot({ path: 'artifacts/desktop-1440.png', fullPage: true });

  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL || 'admin@monaco.test');
  await page.getByLabel('Пароль').fill(process.env.ADMIN_PASSWORD || 'TestPassword123!');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page).toHaveURL(/\/admin$/);

  const row = page.locator('tr').filter({ hasText: 'E2E Гость' }).first();
  await expect(row).toBeVisible();
  await expect(row).toContainText('@e2e_monaco_guest');
  await row.getByRole('button', { name: 'Подтвердить' }).click();
  await expect(row.getByText('Подтверждена')).toBeVisible();
});

test('mobile: composition and fixed CTA', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /MONACO\s*AQUAPARK/i })).toBeVisible();
  await expect(page.locator('.mobile-cta')).toBeVisible();
  await expect(page.locator('.mobile-cta').getByText('Позвонить')).toBeVisible();
  await expect(page.locator('.mobile-cta').getByText('Забронировать')).toBeVisible();
  await page.screenshot({ path: 'artifacts/mobile-390.png', fullPage: true });
});
