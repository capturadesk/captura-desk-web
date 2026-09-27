export const repository = "https://github.com/capturadesk/captura-desk";
export const pages = {
  home: {
    path: "",
    title: "Captura Desk - Turn screen activity into documentation",
    description:
      "Record screen activity on Windows, create documentation with your own AI provider, and share an editable guide or a single HTML file.",
  },
  "getting-started": {
    path: "getting-started",
    title: "Getting started - Captura Desk",
    description:
      "Run Captura Desk, record your first workflow, connect an AI provider, and share your document.",
  },
  download: {
    path: "download",
    title: "Download & availability - Captura Desk",
    description:
      "Captura Desk is in development for Windows. Find source setup instructions and check release availability.",
  },
  changelog: {
    path: "changelog",
    title: "Changelog - Captura Desk",
    description:
      "Follow development of Captura Desk, from screen recording to AI documents, Markdown editing, and single-file sharing.",
  },
  privacy: {
    path: "privacy",
    title: "Privacy & data - Captura Desk",
    description:
      "Understand where Captura Desk stores recordings and what is sent when you choose AI generation.",
  },
  support: {
    path: "support",
    title: "Help & support - Captura Desk",
    description:
      "Troubleshoot recording, AI generation, and sharing, or report an issue on GitHub.",
  },
  "not-found": {
    path: "404",
    title: "Page not found - Captura Desk",
    description: "Find your way back to Captura Desk.",
  },
} as const;
export type Page = keyof typeof pages;
export function pageFromPath(path: string): Page {
  const slug =
    path
      .replace(/\/index\.html$/, "")
      .replace(/\/$/, "")
      .split("/")
      .pop() || "";
  return (
    (Object.keys(pages) as Page[]).find((key) => pages[key].path === slug) || "not-found"
  );
}
export function relativeRoot(page: Page) {
  return page === "home" || page === "not-found" ? "./" : "../";
}
