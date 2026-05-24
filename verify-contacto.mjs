import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
// Dismiss newsletter modal if present
const closeBtn = page.locator('button').filter({ hasText: /×|✕|close/i }).first();
try { await closeBtn.click({ timeout: 2000 }); } catch {}
// Also try pressing Escape
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
await page.evaluate(() => {
  document.querySelector('[data-section="contacto"]').scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(1500);
await page.screenshot({ path: 'verify-contacto-section.png' });
console.log('screenshot saved');
await browser.close();
