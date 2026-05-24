import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
// Disable localStorage trigger by pre-seeding it
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.setItem('essenza_newsletter_shown', 'true'));
await page.reload({ waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
await page.waitForTimeout(1200);
// Close any modal just in case
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
await page.screenshot({ path: 'verify-footer-redesign.png' });
console.log('done');
await browser.close();
