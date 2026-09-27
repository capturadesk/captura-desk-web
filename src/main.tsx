import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { pageFromPath, type Page } from "./site";
import "./styles.css";
const root = document.getElementById("root")!;
const page = (root.dataset.page as Page | undefined) || pageFromPath(location.pathname);
const app = (
  <React.StrictMode>
    <App page={page} />
  </React.StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
