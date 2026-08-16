import { routing } from "@/i18n/routing";

export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          gap: 12,
          padding: 24,
          background: "var(--cream)",
          color: "var(--ink)",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <main>
          <h1 style={{ margin: 0, fontSize: 28 }}>404</h1>
          <p style={{ margin: "10px 0 18px", color: "var(--text)" }}>
            No encontramos esa página.
          </p>
          <a href={`/${routing.defaultLocale}`} style={{ color: "var(--purple)" }}>
            Volver al inicio
          </a>
        </main>
      </body>
    </html>
  );
}
