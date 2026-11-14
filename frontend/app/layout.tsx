import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "yasta | Control financiero para tu negocio",
    template: "%s | yasta"
  },
  description:
    "Registra ventas y egresos, controla tus cobros y entiende la salud de tu negocio en un solo lugar.",
  applicationName: "yasta",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "yasta",
    title: "yasta | Tus cuentas claras para avanzar",
    description: "Control financiero simple para negocios peruanos. Empieza gratis."
  },
  twitter: {
    card: "summary",
    title: "yasta | Tus cuentas claras para avanzar",
    description: "Control financiero simple para negocios peruanos."
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#001f3f"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
