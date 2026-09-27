import { renderToString } from "react-dom/server";
import { App } from "./App";
import { pages, type Page } from "./site";
export { pages };
export function render(page: Page) {
  return renderToString(<App page={page} />);
}
