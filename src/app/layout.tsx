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
  title: "HYDROGENIUM — водородные генераторы для профессиональной терапии",
  description: "Профессиональные водородные генераторы для терапии нового уровня. Возвращаем молодость и укрепляем здоровье инновационным способом.",
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
          className="fixed inset-0 -z-30 bg-[url('/backgrounds/fon.png')] bg-cover bg-center blur-[4px] opacity-100"
          aria-hidden
        />
        <div className="edge-flash edge-left" aria-hidden />
        <div className="edge-flash edge-right" aria-hidden />
        <BubblesBackground />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <PageTransition>
            <main className="flex-1 pb-16 pt-4">
              <div className="page-shell">{children}</div>
            </main>
          </PageTransition>
        </div>
      </body>
    </html>
  );
}
