import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grupo 35 de Guias y Scouts",
  description:
    "Base tecnica del sitio web para el proyecto TCU del Grupo 35 de Guias y Scouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
