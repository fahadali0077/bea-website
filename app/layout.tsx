import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";

import { StoreProvider } from "@/store/provider";
import { fraunces, inter } from "@/lib/fonts";

import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-sans",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Bea Website",
  description: "Together, today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${inter.variable} ${fraunces.variable} ${serifFont.variable}`}
    >
      <head>
        <link
          rel="preload"
          href="/fonts/CanelaText-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/CanelaText-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}