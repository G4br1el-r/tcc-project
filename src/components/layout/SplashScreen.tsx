import Image from "next/image";
import { bootSplash, SPLASH_CONFIG, SPLASH_EXIT_MS } from "@/lib/splash";
import { cssVars } from "@/lib/style";

const LOGO_SIZE = 208;
const BOOT_SCRIPT = `(${bootSplash.toString()})(${JSON.stringify(SPLASH_CONFIG)})`;

export function SplashScreen() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      <div
        className="splash"
        aria-hidden="true"
        style={cssVars({ "--splash-exit": `${SPLASH_EXIT_MS}ms` })}
      >
        <div className="splash__mark">
          <span className="splash__logo-mask">
            <Image
              src="/logo.webp"
              alt=""
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className="splash__logo"
              preload
            />
          </span>
          <span className="splash__progress" />
        </div>
      </div>
    </>
  );
}
