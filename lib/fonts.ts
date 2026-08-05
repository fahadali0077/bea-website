import { Fraunces, Inter, Lato } from "next/font/google";

export const fontCanelaFamily =
  '"Canela Text", var(--font-fraunces), Georgia, "Times New Roman", serif';

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--font-lato",
  fallback: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
});
