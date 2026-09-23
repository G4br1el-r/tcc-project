import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { AnalyticsListener } from "@/components/analytics/AnalyticsListener";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { MotionFlag } from "@/components/motion/MotionFlag";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
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
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <MotionFlag />
      </head>
      <body>
        <SplashScreen />
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        {children}
        <Footer />
        <SmoothScroll />
        <AnalyticsListener />
      </body>
    </html>
  );
}
