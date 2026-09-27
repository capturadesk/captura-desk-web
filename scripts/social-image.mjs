import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import path from "node:path";
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(pathToFileURL(path.resolve("scripts/social-card.html")).href);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });
  await page.screenshot({ path: "public/images/social-card.png" });
  console.log("Generated public/images/social-card.png (1200 x 630).");
} finally {
  await browser.close();
}
