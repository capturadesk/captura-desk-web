import fs from "node:fs/promises";
import path from "node:path";
import { render, pages } from "../.ssr/entry-server.js";
import { siteConfig, escapeHtml, pageMetadata, sitemap, robots } from "./seo.mjs";
const config = siteConfig();
const template = await fs.readFile("dist/index.html", "utf8");
for (const [key, page] of Object.entries(pages)) {
  const nested = key !== "home" && key !== "not-found";
  let html = template
    .replace(/<title>.*?<\/title>/, () => "<title>" + escapeHtml(page.title) + "</title>")
    .replace("</head>", () => pageMetadata(config, key, page, pages.home) + "\n</head>")
    .replace(
      '<div id="root"></div>',
      () => '<div id="root" data-page="' + key + '">' + render(key) + "</div>",
    );
  if (key === "not-found")
    html = html.replace(
      "<head>",
      '<head><base href="' + escapeHtml(config.basePath) + '"/>',
    );
  if (nested)
    html = html
      .replaceAll('"./assets/', '"../assets/')
      .replaceAll('"./images/', '"../images/');
  const file =
    key === "home"
      ? "dist/index.html"
      : key === "not-found"
        ? "dist/404.html"
        : path.join("dist", page.path, "index.html");
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}
await fs.writeFile("dist/robots.txt", robots(config));
if (config.indexable) await fs.writeFile("dist/sitemap.xml", sitemap(config, pages));
else await fs.rm("dist/sitemap.xml", { force: true });
console.log(
  "Pre-rendered " +
    Object.keys(pages).length +
    " standalone pages for " +
    config.url +
    (config.indexable ? "." : " (noindex)."),
);
