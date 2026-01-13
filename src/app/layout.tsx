import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BubblesBackground } from "@/components/ui/bubbles-background";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://h2genium.ru"),
  title: "HYDROGENIUM NADH+ - водородные решения",
  description:
    "Водородные ингаляторы, капсулы и решения HYDROGENIUM NADH+ для программ оздоровления и поддержки клеточного баланса.",
  icons: {
    icon: "/brand/logo-blue.svg",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div
          className="fixed inset-0 -z-30 opacity-100"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 18% 18%, rgba(47,183,255,0.2), transparent 38%), radial-gradient(circle at 84% 8%, rgba(65,224,196,0.18), transparent 40%), radial-gradient(circle at 50% 78%, rgba(18,110,235,0.16), transparent 44%), #050b16",
            filter: "blur(4px)",
          }}
        />
        <div className="edge-flash edge-left" aria-hidden />
        <div className="edge-flash edge-right" aria-hidden />
        <BubblesBackground />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
