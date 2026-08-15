import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Noto_Sans_Armenian,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-armenian",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haylog",
  description: "Haylog is a tech blog focused on javascript",
};

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}  ${notoSansArmenian.variable}`}
    >
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_URL &&
          process.env.NEXT_PUBLIC_UMAMI_ID && (
            <script
              defer
              src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
            />
          )}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
