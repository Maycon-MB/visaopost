import { test, expect } from '@playwright/test';

async function login(page: any, email?: string, password?: string): Promise<boolean> {
  const e = email ?? process.env.E2E_EMAIL;
  const p = password ?? process.env.E2E_PASSWORD;
  if (!e || !p) return false;
  await page.goto('/login');
  await page.fill('input[type="email"]', e);
  await page.fill('input[type="password"]', p);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**');
  return true;
}

test.describe('Landing page', () => {
  test('carrega com h1 e link entrar', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveTitle(/error/i);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: /entrar no painel/i })).toBeVisible();
  });

  test('tem CTA de demo', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveTitle(/error/i);
    await expect(page.locator('a[href="/aprovar/demo"]')).toBeVisible();
  });

  test('mobile viewport — hamburger existe', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page).not.toHaveTitle(/error/i);
    const hamburger = page.locator('.hamburger, button[aria-label*="menu" i]');
    await expect(hamburger.first()).toBeVisible();
  });
});

test.describe('Página pública de demo', () => {
  test('carrega sem redirecionar para login', async ({ page }) => {
    await page.goto('/aprovar/demo');
    await expect(page).not.toHaveTitle(/error/i);
    await expect(page).not.toHaveURL(/\/login/);
  });
});

test.describe('Login', () => {
  test('form existe', async ({ page }) => {
    await page.goto('/login');
    await expect(page).not.toHaveTitle(/error/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('login inválido não navega para /admin', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'invalido@teste.com');
    await page.fill('input[type="password"]', 'senhaerrada123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
    await expect(page).not.toHaveURL(/\/admin/);
  });
});

test.describe('Rotas protegidas', () => {
  test('GET /admin sem auth redireciona para login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).not.toHaveTitle(/error/i);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Dashboard autenticado', () => {
  test('carrega após login', async ({ page }) => {
    test.skip(!process.env.E2E_EMAIL, 'E2E_EMAIL não configurado');
    const ok = await login(page);
    if (!ok) return;
    await expect(page).not.toHaveTitle(/error/i);
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1, .dash-hello').first()).toBeVisible();
  });

  test('navegação sidebar — Aprovações muda URL', async ({ page }) => {
    test.skip(!process.env.E2E_EMAIL, 'E2E_EMAIL não configurado');
    const ok = await login(page);
    if (!ok) return;
    await page.locator('.nav-link', { hasText: /aprova/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/aprovacoes/);
    await expect(page).not.toHaveTitle(/error/i);
  });

  test('data-theme ou botão de toggle de tema existe', async ({ page }) => {
    test.skip(!process.env.E2E_EMAIL, 'E2E_EMAIL não configurado');
    const ok = await login(page);
    if (!ok) return;
    await page.goto('/admin/settings');
    await expect(page).not.toHaveTitle(/error/i);
    const htmlTheme = await page.locator('html[data-theme]').count();
    const toggleBtn = await page.locator('button[aria-label*="tema" i], .theme-toggle').count();
    expect(htmlTheme + toggleBtn).toBeGreaterThan(0);
  });

  test('cards de métrica visíveis no dashboard', async ({ page }) => {
    test.skip(!process.env.E2E_EMAIL, 'E2E_EMAIL não configurado');
    const ok = await login(page);
    if (!ok) return;
    await expect(page.locator('.metric').first()).toBeVisible();
  });
});
