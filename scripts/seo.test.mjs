import { test } from "node:test";
import assert from "node:assert/strict";
import { siteConfig, pageMetadata, sitemap, robots } from "./seo.mjs";
const home = {
  path: "",
  title: "Captura Desk",
  description: "A Windows documentation app.",
};
const support = {
  path: "support",
  title: "Help & support",
  description: "Help for <Windows> users.",
};
const pages = {
  home,
  support,
  "not-found": { path: "404", title: "Not found", description: "Return home." },
};
test("production URLs are absolute and exclude 404 from discovery", () => {
  const config = siteConfig({});
  const html = pageMetadata(config, "support", support, home);
  assert.ok(html.includes('rel="canonical" href="https://capturadesk.com/support/"'));
  assert.ok(html.includes('content="Help &amp; support"'));
  assert.ok(html.includes('content="Help for &lt;Windows&gt; users."'));
  assert.ok(
    sitemap(config, pages).includes("<loc>https://capturadesk.com/support/</loc>"),
  );
  assert.ok(!sitemap(config, pages).includes("404"));
  assert.ok(robots(config).includes("Sitemap: https://capturadesk.com/sitemap.xml"));
  const missing = pageMetadata(config, "not-found", pages["not-found"], home);
  assert.ok(missing.includes("noindex, follow"));
  assert.ok(!missing.includes('rel="canonical"'));
});
test("alternate host and base path are consistent across metadata and discovery", () => {
  const config = siteConfig({
    SITE_URL: "https://example.org",
    SITE_BASE_PATH: "/captura/",
  });
  const html = pageMetadata(config, "support", support, home);
  assert.ok(html.includes('href="https://example.org/captura/support/"'));
  assert.ok(
    html.includes('content="https://example.org/captura/images/social-card.png"'),
  );
  assert.ok(sitemap(config, pages).includes("https://example.org/captura/"));
  assert.ok(robots(config).includes("https://example.org/captura/sitemap.xml"));
  assert.ok(!html.includes("capturadesk.com"));
});
test("staging stays crawlable to allow reading noindex and has no advertised sitemap", () => {
  const config = siteConfig({ SITE_INDEXABLE: "false" });
  for (const [key, page] of Object.entries(pages))
    assert.ok(pageMetadata(config, key, page, home).includes("noindex, follow"));
  assert.equal(robots(config), "User-agent: *\nAllow: /\n");
});
test("invalid deployment settings fail instead of emitting misleading URLs", () => {
  for (const SITE_URL of [
    "http://example.org",
    "https://user:secret@example.org",
    "https://example.org/path/",
    "https://example.org?x=1",
    "https://example.org#x",
  ])
    assert.throws(() => siteConfig({ SITE_URL }));
  for (const SITE_BASE_PATH of ["bad", "//example.org/", "/../", "/./", "/a/../../"])
    assert.throws(() => siteConfig({ SITE_BASE_PATH }));
  assert.throws(() => siteConfig({ SITE_INDEXABLE: "no" }));
});
test("JSON-LD describes the app honestly and cannot close its script element", () => {
  const hostile = { ...home, description: '</script><script>alert("x")</script>' };
  const html = pageMetadata(siteConfig({}), "home", hostile, hostile);
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  assert.ok(json);
  assert.ok(!json.includes("<"));
  const graph = JSON.parse(json)["@graph"];
  const app = graph.find((item) => item["@type"] === "SoftwareApplication");
  assert.equal(app.description, hostile.description);
  assert.equal(app.operatingSystem, "Windows");
  for (const key of ["offers", "aggregateRating", "review", "downloadUrl"])
    assert.ok(!(key in app));
});
