import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "captura-analytics-consent-v1",
      JSON.stringify({ value: "declined", at: Date.now() }),
    ),
  );
});
const routes = [
  "/",
  "/getting-started/",
  "/download/",
  "/changelog/",
  "/privacy/",
  "/support/",
  "/404.html",
];
test("all static pages have content, local assets, and working internal links", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4173")) external.push(request.url());
  });
  const links = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.{30}/,
    );
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
    ).toBe(true);
    for (const link of await page
      .locator("a")
      .evaluateAll((links) => links.map((link) => link.href)))
      if (link.startsWith("http://127.0.0.1:4173")) links.add(link.split("#")[0]);
  }
  for (const link of links) expect((await request.get(link)).status(), link).toBe(200);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test("home interactions and mobile navigation work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Screen summaries" }).click();
  await expect(
    page.getByRole("heading", { name: "Document what the screen tells you." }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Operations", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Show someone where to start." }),
  ).toBeVisible();
  await page.getByText("Can I download it now?", { exact: true }).click();
  await expect(
    page.getByText("run the development version from source", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Operations", exact: true }).click();
  await page.screenshot({
    path: "test-results/home-desktop.jpg",
    fullPage: true,
    type: "jpeg",
    quality: 85,
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByLabel("Navigation menu").click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Getting started" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your first useful document." }),
  ).toBeVisible();
  for (const route of routes) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-mobile.jpg",
    fullPage: true,
    type: "jpeg",
    quality: 85,
  });
});
test("copy setup and truthful availability", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/download/");
  await page.getByRole("button", { name: "Copy commands" }).click();
  await expect(page.getByRole("status")).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "npm start",
  );
  await expect(page.getByText("Installer coming soon", { exact: true })).toBeVisible();
  await expect(page.locator("a[download]")).toHaveCount(0);
});
test("content is prerendered and readable with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const route of routes) {
      await page.goto("http://127.0.0.1:4173" + route);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main")).not.toBeEmpty();
    }
    await page.goto("http://127.0.0.1:4173/");
    await page.getByText("Can I download it now?", { exact: true }).click();
    await expect(
      page.getByText("run the development version from source", { exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
  const html = await fs.readFile("dist/getting-started/index.html", "utf8");
  expect(html).toContain("Your first useful document.");
  expect(html).toContain("../assets/");
});

test("custom 404 works when served at a nested missing URL", async ({ page }) => {
  const html = await fs.readFile("dist/404.html", "utf8");
  await page.route("**/missing/deep/page", (route) =>
    route.fulfill({ status: 404, contentType: "text/html", body: html }),
  );
  await page.goto("/missing/deep/page");
  await expect(
    page.getByRole("heading", { name: "This page is not here." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to Captura Desk" })).toHaveJSProperty(
    "href",
    "http://127.0.0.1:4173/",
  );
  expect(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
  ).toBe(true);
});
