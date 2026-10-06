import { chromium } from "playwright";
import { join } from "path";

const BASE = "https://triageguard-ai-6npvo6evsn1.qoder.website";
const OUT = join(import.meta.dirname, "..", "screenshots");

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const pages = [
  { name: "dashboard", hash: "" },
  { name: "submit", hash: "#submit" },
  { name: "review-critical", hash: "#review/INC-2026-002" },
  { name: "audit", hash: "#audit" },
];

const themes = ["light", "dark"];

async function run() {
  const browser = await chromium.launch();

  for (const theme of themes) {
    for (const view of [
      { label: "desktop", vp: DESKTOP },
      { label: "mobile", vp: MOBILE },
    ]) {
      for (const pg of pages) {
        // Fresh context + page per screenshot for reliable SPA state
        const context = await browser.newContext({ viewport: view.vp });
        const page = await context.newPage();

        await page.addInitScript((t) => {
          localStorage.setItem("tg-theme", t);
        }, theme);

        const url = `${BASE}/${pg.hash}`;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForTimeout(600);

        const filename = `triageguard-${view.label}-${pg.name}-${theme}.png`;
        await page.screenshot({
          path: join(OUT, filename),
          fullPage: true,
        });
        console.log(`  saved ${filename}`);

        await context.close();
      }
    }
  }

  await browser.close();
  console.log("\nAll screenshots saved to ./screenshots/");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
