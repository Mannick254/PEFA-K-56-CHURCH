const puppeteer = require('puppeteer');
const sharp = require('sharp');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/logo', { waitUntil: 'networkidle0' });

  const svg = await page.evaluate(() => {
    const svgElement = document.querySelector('svg');
    return new XMLSerializer().serializeToString(svgElement);
  });

  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .toFile('public/favicon.ico');

  await browser.close();
})();
