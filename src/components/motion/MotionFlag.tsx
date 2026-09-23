import { MEDIA, MOTION_ATTRIBUTE, MOTION_ON } from "@/lib/motion";

const FLAG_SCRIPT = `if(window.matchMedia(${JSON.stringify(MEDIA.anyMotion)}).matches){document.documentElement.dataset.${MOTION_ATTRIBUTE}=${JSON.stringify(MOTION_ON)}}`;

export function MotionFlag() {
  return <script dangerouslySetInnerHTML={{ __html: FLAG_SCRIPT }} />;
}
