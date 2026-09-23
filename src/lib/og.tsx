import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HERO } from "@/content/landing";
import { SITE_NAME, THEME_COLOR } from "./site";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_ALT = `${SITE_NAME}: ${HERO.titleLines.join(" ")}`;
export const OG_CONTENT_TYPE = "image/png";

const PAPER = "#f4f4f1";
const PAPER_MUTED = "#9b9b95";
const BRASS = "#a9e8d8";
const PADDING = 80;
const TITLE_SIZE = 84;
const TITLE_LINE_HEIGHT = 1;
const LABEL_SIZE = 28;
const MONOGRAM_HEIGHT = 96;
const MONOGRAM_WIDTH = 78;
const RULE_WIDTH = 120;
const RULE_HEIGHT = 2;
const FONT_WEIGHT = 400;

export async function renderOgImage(): Promise<ImageResponse> {
  const [font, monogram] = await Promise.all([
    readFile(
      join(process.cwd(), "src/assets/fonts/bricolage-grotesque-latin.woff"),
    ),
    readFile(join(process.cwd(), "public/brand/monogram.png"), "base64"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: PADDING,
        backgroundColor: THEME_COLOR,
        color: PAPER,
        fontFamily: "Bricolage",
      }}
    >
      <img
        src={`data:image/png;base64,${monogram}`}
        width={MONOGRAM_WIDTH}
        height={MONOGRAM_HEIGHT}
        alt=""
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: RULE_WIDTH,
            height: RULE_HEIGHT,
            background: BRASS,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: TITLE_SIZE,
            lineHeight: TITLE_LINE_HEIGHT,
            letterSpacing: "-0.04em",
            marginTop: LABEL_SIZE,
          }}
        >
          {HERO.titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <span
          style={{
            marginTop: LABEL_SIZE,
            fontSize: LABEL_SIZE,
            color: PAPER_MUTED,
          }}
        >
          {SITE_NAME}
        </span>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Bricolage",
          data: font,
          style: "normal",
          weight: FONT_WEIGHT,
        },
      ],
    },
  );
}
