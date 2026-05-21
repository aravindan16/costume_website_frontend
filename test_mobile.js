import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:5173');
  await page.screenshot({ path: 'mobile_home.png' });
  await browser.close();
})();
