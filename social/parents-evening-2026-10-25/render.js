// Render slides.html to JPGs: 1080x1350 for Instagram/Facebook, 1080x1920 for TikTok.
// Run from anywhere: node social/parents-evening-2026-10-25/render.js
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const here = __dirname;
const out = path.join(here, '..', '..', 'img', 'social');
const name = 'parents-evening-2026-10-25';

(async () => {
  const browser = await chromium.launch();
  for (const [suffix, query, height] of [['', '', 1350], ['-tiktok', '?tall', 1920]]) {
    const page = await browser.newPage({ viewport: { width: 1080, height } });
    await page.goto(pathToFileURL(path.join(here, 'slides.html')).href + query);
    await page.waitForLoadState('networkidle');
    const frames = await page.$$('.frame');
    for (let i = 0; i < frames.length; i++) {
      const file = path.join(out, `${name}-${i + 1}${suffix}.jpg`);
      await frames[i].screenshot({ path: file, type: 'jpeg', quality: 90 });
      console.log(path.relative(path.join(here, '..', '..'), file));
    }
  }
  await browser.close();
})();
