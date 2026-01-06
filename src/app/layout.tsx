import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { BubblesBackground } from "@/components/ui/bubbles-background";
import { PageTransition } from "@/components/layout/page-transition";
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
              "radial-gradient(circle at 18% 18%, rgba(47,183,255,0.12), transparent 32%), radial-gradient(circle at 84% 8%, rgba(65,224,196,0.16), transparent 36%), radial-gradient(circle at 50% 78%, rgba(18,110,235,0.14), transparent 40%), #f6fbff",
            filter: "blur(2px)",
          }}
        />
        <div className="edge-flash edge-left" aria-hidden />
        <div className="edge-flash edge-right" aria-hidden />
        <BubblesBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <PageTransition>
            <main className="flex-1 pb-16 pt-[92px] sm:pt-[104px]">
              <div className="page-shell">{children}</div>
            </main>
          </PageTransition>
        </div>
      </body>
    </html>
  );
}
