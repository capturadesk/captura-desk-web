import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  chooseConsent,
  measurementId,
  readConsent,
  startAnalytics,
  type Consent,
} from "../lib/analytics";
export function AnalyticsConsent({ privacyHref }: { privacyHref: string }) {
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<Consent | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const configured = measurementId();
    setId(configured);
    if (!configured) return;
    const saved = readConsent();
    setChoice(saved);
    setOpen(saved === null);
    if (saved === "accepted") startAnalytics(configured);
    const sync = (event: StorageEvent) => {
      if (event.key === "captura-analytics-consent-v1" || event.key === null)
        location.reload();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  if (!id) return null;
  function choose(value: Consent) {
    chooseConsent(value, id);
    setChoice(value);
    setOpen(false);
  }
  return (
    <>
      <button
        className="analytics-settings"
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => heading.current?.focus());
        }}
      >
        Cookie settings
      </button>
      {open && (
        <section className="analytics-banner" aria-labelledby="analytics-heading">
          <div>
            <h2 id="analytics-heading" tabIndex={-1} ref={heading}>
              Optional analytics
            </h2>
            <p>
              Allow Google Analytics to help us understand which pages people visit? It
              uses cookies and sends website usage data to Google. You can decline and
              still use the whole site. <a href={privacyHref}>Privacy details</a>
            </p>
            {choice && (
              <p className="analytics-current">
                Current choice: analytics {choice === "accepted" ? "enabled" : "disabled"}
                .
              </p>
            )}
          </div>
          <div className="analytics-actions">
            <Button variant="outline" onClick={() => choose("declined")}>
              Decline analytics
            </Button>
            <Button variant="outline" onClick={() => choose("accepted")}>
              Allow analytics
            </Button>
            {choice && (
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
