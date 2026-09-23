import { StatsMotion } from "@/components/motion/StatsMotion";
import { STATS } from "@/content/landing";
import { formatCount } from "@/lib/format";

export function Stats() {
  return (
    <StatsMotion>
      <section className="stats" aria-label="Números da assessoria">
        <ul className="shell stats__list" data-reveal-group>
          {STATS.map((stat) => (
            <li key={stat.id} className="stat" data-reveal-fade>
              <span className="stat__value">
                {stat.prefix}
                <span data-count={stat.value}>{formatCount(stat.value)}</span>
                {stat.suffix}
              </span>
              <span className="stat__label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </section>
    </StatsMotion>
  );
}
