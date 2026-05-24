import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.keyboard.press('Escape');
await page.waitForTimeout(600);

// Screenshot at top (0% scroll) — drip should be empty, olives visible
await page.screenshot({ path: 'verify-olive-top.png' });

// Scroll to 40% of page
await page.evaluate(() => {
  const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  window.scrollTo({ top: max * 0.4, behavior: 'instant' });
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'verify-olive-mid.png' });

// Scroll to 90%
await page.evaluate(() => {
  const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  window.scrollTo({ top: max * 0.9, behavior: 'instant' });
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'verify-olive-bottom.png' });

console.log('done');
await browser.close();
