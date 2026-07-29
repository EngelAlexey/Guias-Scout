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
          background: "#faf8f3",
          color: "#2e1a47",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <main>
          <h1 style={{ margin: 0, fontSize: 28 }}>404</h1>
          <p style={{ margin: "10px 0 18px", color: "#5b5169" }}>
            No encontramos esa página.
          </p>
          <a href={`/${routing.defaultLocale}`} style={{ color: "#5b2d8e" }}>
            Volver al inicio
          </a>
        </main>
      </body>
    </html>
  );
}
