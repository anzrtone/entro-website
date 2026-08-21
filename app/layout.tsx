import type { Metadata } from "next";
import { Manrope, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "entro.site — aesthetic identity engine",
  description:
    "Claim your unique handle, select a retro world engine (OS simulators, handheld virtual pets, gamer HUDs), and build your micro-cosmetic bio page.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full dark antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--bg-app)] font-mono text-[var(--text-main)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)]">
        {children}
      </body>
    </html>
  );
}