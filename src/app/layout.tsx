import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { MotionFlag } from "@/components/motion/MotionFlag";
import { buildRootMetadata } from "@/lib/seo";
import { SITE_LANGUAGE, THEME_COLOR } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={SITE_LANGUAGE}
      className={`dark ${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <MotionFlag />
      </head>
      <body>{children}</body>
    </html>
  );
}
