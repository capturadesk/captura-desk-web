import { test, expect } from "@playwright/test";
const routes = [
  "/",
  "/getting-started/",
  "/download/",
  "/changelog/",
  "/privacy/",
  "/support/",
];
test("built pages expose production metadata without JavaScript", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const route of routes) {
      await page.goto("http://127.0.0.1:4173" + route);
      const canonical = "https://capturadesk.com" + route;
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonical,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "index, follow, max-image-preview:large",
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        "https://capturadesk.com/images/social-card.png",
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
      const data = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent())!,
      );
      expect(data["@context"]).toBe("https://schema.org");
      expect(
        data["@graph"].find(
          (item: Record<string, unknown>) => item["@type"] === "WebPage",
        ).url,
      ).toBe(canonical);
      if (route === "/") {
        expect(
          data["@graph"].find(
            (item: Record<string, unknown>) => item["@type"] === "WebSite",
          ).name,
        ).toBe("Captura Desk");
        expect(
          data["@graph"].find(
            (item: Record<string, unknown>) => item["@type"] === "SoftwareApplication",
          ).operatingSystem,
        ).toBe("Windows");
      }
    }
    await page.goto("http://127.0.0.1:4173/404.html");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBe(true);
    const xml = await sitemapResponse.text();
    const urls = await page.evaluate((xml) => {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      if (doc.querySelector("parsererror")) throw new Error("Invalid sitemap XML");
      return [...doc.querySelectorAll("loc")].map((node) => node.textContent);
    }, xml);
    expect(urls).toEqual(routes.map((route) => "https://capturadesk.com" + route));
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain("Sitemap: https://capturadesk.com/sitemap.xml");
    const image = await request.get("/images/social-card.png");
    expect(image.headers()["content-type"]).toContain("image/png");
    const bytes = await image.body();
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
  } finally {
    await context.close();
  }
});
