"use client";

/**
 * The last-resort boundary: it catches an error thrown by the root layout
 * itself, where error.tsx cannot help because the layout that would host it
 * is the thing that failed. It must render its own <html> and <body>, and
 * globals.css is not guaranteed to have loaded, so the styles are inline and
 * the page is deliberately plain. In practice this fires almost never; it
 * exists so that when it does, the reader sees a sentence and a link instead
 * of a blank page.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0a0b0d",
          color: "#e6e7ea",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: 560 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#7c9cff", margin: 0 }}>
            Something broke
          </p>
          <h1 style={{ fontSize: 28, margin: "12px 0 0", lineHeight: 1.2 }}>
            AIFitnessAPI could not render this page
          </h1>
          <p style={{ color: "#a0a4ad", margin: "12px 0 0" }}>
            Reloading usually fixes it. If it keeps happening, the homepage
            still works.
          </p>
          {error.digest && (
            <p style={{ color: "#a0a4ad", fontSize: 12, margin: "8px 0 0" }}>
              Error id: <code>{error.digest}</code>
            </p>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: "#3b5bdb",
                color: "#fff",
                border: 0,
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                color: "#e6e7ea",
                border: "1px solid #2a2d33",
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
