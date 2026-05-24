import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.setItem('essenza_newsletter_shown', 'true'));
await page.reload({ waitUntil: 'networkidle' });
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
// BrandStory sits just after the hero
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.1, behavior: 'instant' }));
await page.waitForTimeout(1200);
await page.screenshot({ path: 'verify-brand-redesign.png' });
console.log('done');
await browser.close();
