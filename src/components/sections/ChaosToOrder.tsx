import { ChaosToOrderMotion } from "@/components/motion/ChaosToOrderMotion";
import { CHAOS, ORDER } from "@/content/landing";
import { cssVars } from "@/lib/style";

const STEP_NUMBER_OFFSET = 1;

export function ChaosToOrder() {
  return (
    <ChaosToOrderMotion>
      <section className="chaos" aria-labelledby="chaos-title" data-chaos-root>
        <div className="chaos__stage" data-chaos-stage>
          <div className="shell chaos__scene">
            <h2
              id="chaos-title"
              className="section-title chaos__title"
              data-chaos-title
            >
              {CHAOS.title}
            </h2>
            <ul className="chaos__words" aria-hidden="true">
              {CHAOS.words.map((word) => (
                <li
                  key={word.label}
                  className="chaos__word"
                  data-chaos-word
                  data-size={word.size}
                  data-rotate={word.rotate}
                  data-x={word.x}
                  style={cssVars({ "--x": word.x, "--y": word.y })}
                >
                  {word.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="order" data-order>
          <div className="shell">
            <h2 className="section-title" data-order-title>
              {ORDER.title}
            </h2>
            <p className="order__subtitle" data-order-subtitle>
              {ORDER.subtitle}
            </p>

            <div className="flow" data-flow>
              <div className="flow__line" aria-hidden="true" data-flow-line>
                <span className="flow__line-fill" data-flow-fill />
              </div>
              <ol className="flow__list">
                {ORDER.steps.map((step, index) => (
                  <li key={step.title} className="flow__step" data-flow-step>
                    <span className="flow__dot" aria-hidden="true" />
                    <span className="flow__index" aria-hidden="true">
                      {index + STEP_NUMBER_OFFSET}
                    </span>
                    <h3 className="flow__title">{step.title}</h3>
                    <p className="flow__text">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </ChaosToOrderMotion>
  );
}
