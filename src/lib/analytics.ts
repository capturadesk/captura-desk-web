const storageKey = "captura-analytics-consent-v1";
const retention = 90 * 24 * 60 * 60 * 1000;
export type Consent = "accepted" | "declined";
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};
let started = false;
export function measurementId() {
  const id =
    document.querySelector<HTMLMetaElement>('meta[name="ga-measurement-id"]')?.content ||
    "";
  return /^G-[A-Z0-9]+$/.test(id) ? id : "";
}
export function readConsent(): Consent | null {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (
      saved &&
      ["accepted", "declined"].includes(saved.value) &&
      typeof saved.at === "number" &&
      Date.now() >= saved.at &&
      Date.now() - saved.at < retention
    )
      return saved.value;
  } catch {
    /* Unavailable storage means asking again, never assuming consent. */
  }
  return null;
}
function cleanUrl(value: string) {
  try {
    const url = new URL(value);
    return url.origin + url.pathname;
  } catch {
    return "";
  }
}
export function startAnalytics(id: string) {
  if (started || !/^G-[A-Z0-9]+$/.test(id)) return;
  started = true;
  (window as unknown as Record<string, unknown>)["ga-disable-" + id] = false;
  const win = window as AnalyticsWindow;
  win.dataLayer = win.dataLayer || [];
  win.gtag = function (..._args: unknown[]) {
    win.dataLayer!.push(arguments);
  };
  win.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  win.gtag("consent", "update", { analytics_storage: "granted" });
  win.gtag("js", new Date());
  win.gtag("config", id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: retention / 1000,
    cookie_update: false,
    page_location: cleanUrl(location.href),
    page_referrer: cleanUrl(document.referrer),
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  script.id = "captura-google-analytics";
  document.head.append(script);
}
function clearAnalyticsCookies() {
  const domains = location.hostname
    .split(".")
    .map((_, i, parts) => parts.slice(i).join("."));
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    const expired = name + "=; Max-Age=0; Path=/";
    document.cookie = expired;
    for (const domain of domains) document.cookie = expired + "; Domain=" + domain;
  }
}
export function chooseConsent(value: Consent, id: string) {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ value, at: Date.now() }));
  } catch {
    /* Choice still applies to this page when storage is blocked. */
  }
  if (value === "accepted") startAnalytics(id);
  else {
    (window as unknown as Record<string, unknown>)["ga-disable-" + id] = true;
    clearAnalyticsCookies();
    // Reload removes the loaded Google library and its automatic event listeners.
    if (started) location.reload();
  }
}
