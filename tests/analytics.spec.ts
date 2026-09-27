import { test, expect, type Page } from "@playwright/test";
const id = "G-TEST12345";
const key = "captura-analytics-consent-v1";
async function mockAnalytics(page: Page) {
  const requests: string[] = [];
  await page.route(
    /https:\/\/.*(googletagmanager|google-analytics)\.com\//,
    async (route) => {
      requests.push(route.request().url());
      await route.fulfill({
        contentType: "text/javascript",
        body: "/* Analytics mocked: no data leaves the test. */",
      });
    },
  );
  await page.route("http://127.0.0.1:4173/**", async (route) => {
    if (route.request().resourceType() !== "document") return route.continue();
    const response = await route.fetch();
    const html = (await response.text())
      .replace(/<meta name="ga-measurement-id"[^>]*>/g, "")
      .replace("</head>", '<meta name="ga-measurement-id" content="' + id + '"></head>');
    await route.fulfill({ response, body: html });
  });
  return requests;
}
test("no Google requests before consent or after declining; acceptance starts once", async ({
  page,
}) => {
  const requests = await mockAnalytics(page);
  await page.goto("/?private=value#secret");
  await expect(page.getByRole("heading", { name: "Optional analytics" })).toBeVisible();
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Decline analytics" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Cookie settings" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Optional analytics" })).toHaveCount(0);
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => requests.length).toBe(1);
  const commands = await page.evaluate(() =>
    Array.from((window as any).dataLayer, (args: any) => Array.from(args)),
  );
  expect(commands[0]).toEqual([
    "consent",
    "default",
    {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  ]);
  expect(commands[1]).toEqual(["consent", "update", { analytics_storage: "granted" }]);
  const configs = commands.filter((args) => args[0] === "config");
  expect(configs).toHaveLength(1);
  expect(configs[0][1]).toBe(id);
  expect(configs[0][2]).toMatchObject({
    page_location: "http://127.0.0.1:4173/",
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  expect(requests).toHaveLength(1);
  await page.goto("/getting-started/");
  await expect.poll(() => requests.length).toBe(2);
  await expect(page.getByRole("heading", { name: "Optional analytics" })).toHaveCount(0);
});
test("withdrawal removes analytics cookies and stops loading on later pages", async ({
  page,
  context,
}) => {
  const requests = await mockAnalytics(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => requests.length).toBe(1);
  await context.addCookies([
    { name: "_ga", value: "test", url: "http://127.0.0.1:4173/" },
    { name: "_ga_TEST12345", value: "test", url: "http://127.0.0.1:4173/" },
  ]);
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await page.getByRole("button", { name: "Decline analytics" }).click();
  await expect(page.getByRole("button", { name: "Cookie settings" })).toBeVisible();
  await expect
    .poll(
      async () =>
        (await context.cookies()).filter((c) => c.name.startsWith("_ga")).length,
    )
    .toBe(0);
  await page.goto("/support/");
  await expect(page.getByRole("button", { name: "Cookie settings" })).toBeVisible();
  expect(requests).toHaveLength(1);
});
test("expired consent asks again and mobile controls fit", async ({ page }) => {
  const requests = await mockAnalytics(page);
  await page.addInitScript(
    ({ key }) =>
      localStorage.setItem(
        key,
        JSON.stringify({ value: "accepted", at: Date.now() - 91 * 86400000 }),
      ),
    { key },
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Optional analytics" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Allow analytics" })).toBeInViewport();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
  expect(requests).toEqual([]);
  await page.screenshot({ path: "test-results/analytics-mobile.png" });
});
test("storage failures do not break consent controls", async ({ page }) => {
  const requests = await mockAnalytics(page);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Blocked");
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Decline analytics" }).click();
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => requests.length).toBe(1);
  expect(await page.evaluate((id) => (window as any)["ga-disable-" + id], id)).toBe(
    false,
  );
});
test("unconfigured builds have no banner or tracking script", async ({ page }) => {
  await page.route("http://127.0.0.1:4173/", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: (await response.text()).replace(/<meta name="ga-measurement-id"[^>]*>/g, ""),
    });
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Optional analytics" })).toHaveCount(0);
  await expect(page.locator("#captura-google-analytics")).toHaveCount(0);
});

test("production build uses the real ID but waits for consent", async ({ page }) => {
  const external: string[] = [];
  await page.route(/https:\/\//, async (route) => {
    external.push(route.request().url());
    await route.abort();
  });
  await page.goto("/");
  await expect(page.locator('meta[name="ga-measurement-id"]')).toHaveAttribute(
    "content",
    "G-0G3QY0L6CZ",
  );
  await expect(page.getByRole("heading", { name: "Optional analytics" })).toBeVisible();
  await expect(page.locator("#captura-google-analytics")).toHaveCount(0);
  expect(external).toEqual([]);
});
