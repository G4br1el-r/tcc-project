import { ChaptersMotion } from "@/components/motion/ChaptersMotion";
import { Faq } from "@/components/sections/Faq";
import { Process } from "@/components/sections/Process";
import { Trust } from "@/components/sections/Trust";
import { FAQ, PROCESS, TRUST } from "@/content/landing";

const RAIL_CHAPTERS = [
  { id: "process", title: PROCESS.title, intro: PROCESS.text },
  { id: "trust", title: TRUST.title, intro: TRUST.intro },
  { id: "faq", title: FAQ.title, intro: FAQ.intro },
] as const;

export function Chapters() {
  return (
    <ChaptersMotion>
      <div className="chapters" data-chapters>
        <div className="chapters__rail" aria-hidden="true" data-rail>
          <div className="shell">
            <div className="rail__track" data-rail-track>
              <div className="rail__panel" data-rail-panel>
                <div className="rail__titles">
                  {RAIL_CHAPTERS.map((chapter) => (
                    <p key={chapter.id} className="rail__title" data-rail-title>
                      {chapter.title}
                    </p>
                  ))}
                </div>
                <div className="rail__intros">
                  {RAIL_CHAPTERS.map((chapter) => (
                    <p key={chapter.id} className="rail__intro" data-rail-intro>
                      {chapter.intro}
                    </p>
                  ))}
                </div>
                <div className="rail__progress">
                  {RAIL_CHAPTERS.map((chapter) => (
                    <span
                      key={chapter.id}
                      className="rail__bar"
                      data-rail-bar
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chapters__content">
          <Process />
          <Trust />
          <Faq />
        </div>
      </div>
    </ChaptersMotion>
  );
}
