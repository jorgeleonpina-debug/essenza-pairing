import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
// Dismiss newsletter modal
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
// Scroll to tienda section
await page.evaluate(() => {
  document.querySelector('[data-section="tienda"]').scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(1500);
await page.screenshot({ path: 'verify-tienda-top.png' });
// Scroll down to see all cards
await page.evaluate(() => window.scrollBy(0, 400));
await page.waitForTimeout(800);
await page.screenshot({ path: 'verify-tienda-cards.png' });
console.log('done');
await browser.close();
