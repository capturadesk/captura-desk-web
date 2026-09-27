export function siteConfig(env = process.env) {
  const origin = new URL(env.SITE_URL || "https://capturadesk.com");
  if (
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new Error(
      "SITE_URL must be an HTTPS origin such as https://capturadesk.com; use SITE_BASE_PATH for subdirectories.",
    );
  const basePath = env.SITE_BASE_PATH || "/";
  if (
    !/^\/(?:[a-zA-Z0-9._~-]+\/)*$/.test(basePath) ||
    basePath.split("/").some((part) => part === "." || part === "..")
  )
    throw new Error(
      "SITE_BASE_PATH must be / or a directory path such as /captura-desk/.",
    );
  if (env.SITE_INDEXABLE && !["true", "false"].includes(env.SITE_INDEXABLE))
    throw new Error("SITE_INDEXABLE must be true or false.");
  return {
    url: new URL(basePath, origin).href,
    basePath,
    indexable: env.SITE_INDEXABLE !== "false",
  };
}
export const escapeHtml = (text) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );
export const pageUrl = (config, page) =>
  new URL(page.path ? page.path + "/" : "", config.url).href;
export function pageMetadata(config, key, page, home) {
  const missing = key === "not-found";
  const url = pageUrl(config, page);
  const image = new URL("images/social-card.png", config.url).href;
  const imageAlt =
    "Captura Desk: turn your workflow into clear documentation. Windows desktop app with your own AI provider.";
  const meta = (name, content, property = false) =>
    "<meta " +
    (property ? "property" : "name") +
    '="' +
    name +
    '" content="' +
    escapeHtml(content) +
    '"/>';
  const tags = [
    meta("description", page.description),
    meta(
      "robots",
      missing || !config.indexable
        ? "noindex, follow"
        : "index, follow, max-image-preview:large",
    ),
    meta("og:site_name", "Captura Desk", true),
    meta("og:title", page.title, true),
    meta("og:description", page.description, true),
    meta("og:type", "website", true),
    meta("og:locale", "en_US", true),
    meta("og:image", image, true),
    meta("og:image:type", "image/png", true),
    meta("og:image:width", "1200", true),
    meta("og:image:height", "630", true),
    meta("og:image:alt", imageAlt, true),
    meta("twitter:card", "summary_large_image"),
    meta("twitter:title", page.title),
    meta("twitter:description", page.description),
    meta("twitter:image", image),
    meta("twitter:image:alt", imageAlt),
  ];
  if (missing) return tags.join("\n");
  tags.push(
    '<link rel="canonical" href="' + escapeHtml(url) + '"/>',
    meta("og:url", url, true),
  );
  const graph = [
    {
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: page.title,
      description: page.description,
      inLanguage: "en",
      isPartOf: { "@id": config.url + "#website" },
      about: { "@id": config.url + "#application" },
    },
  ];
  if (key === "home")
    graph.push(
      {
        "@type": "WebSite",
        "@id": config.url + "#website",
        url: config.url,
        name: "Captura Desk",
        description: home.description,
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": config.url + "#application",
        name: "Captura Desk",
        url: config.url,
        description: home.description,
        operatingSystem: "Windows",
        applicationCategory: "BusinessApplication",
        image: new URL("images/icon.png", config.url).href,
        screenshot: new URL("images/workspace.jpg", config.url).href,
      },
    );
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replaceAll("<", "\\u003c");
  tags.push('<script type="application/ld+json">' + json + "</script>");
  return tags.join("\n");
}
export function sitemap(config, pages) {
  const entries = Object.entries(pages)
    .filter(([key]) => key !== "not-found")
    .map(
      ([, page]) => "  <url><loc>" + escapeHtml(pageUrl(config, page)) + "</loc></url>",
    );
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join("\n") +
    "\n</urlset>\n"
  );
}
export function robots(config) {
  return (
    "User-agent: *\nAllow: /\n" +
    (config.indexable
      ? "\nSitemap: " + new URL("sitemap.xml", config.url).href + "\n"
      : "")
  );
}

export function analyticsMetadata(env = process.env) {
  const id = (env.GA_MEASUREMENT_ID ?? "G-0G3QY0L6CZ").trim();
  if (id && !/^G-[A-Z0-9]+$/.test(id))
    throw new Error("GA_MEASUREMENT_ID must be a GA4 Measurement ID starting with G-.");
  return id && env.SITE_INDEXABLE !== "false"
    ? '<meta name="ga-measurement-id" content="' + id + '"/>'
    : "";
}
