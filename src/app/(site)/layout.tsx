import { AnalyticsListener } from "@/components/analytics/AnalyticsListener";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SplashScreen />
      <SkipLink />
      <Header />
      {children}
      <Footer />
      <SmoothScroll />
      <AnalyticsListener />
    </>
  );
}
