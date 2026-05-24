import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.querySelector('[data-section="quienes-somos"]').scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(1500);
await page.screenshot({ path: 'verify-quienes-section.png' });
console.log('screenshot saved');
await browser.close();
