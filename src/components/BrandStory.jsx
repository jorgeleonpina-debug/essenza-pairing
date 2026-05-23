import { useEffect, useRef, useState } from "react";

const styles = `
  .brand-root {
    background: #0d2214;
    padding: 96px 24px 104px;
    overflow: hidden;
  }

  .brand-headline-wrap {
    text-align: center;
    margin-bottom: 72px;
  }

  .brand-kicker {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: #c9a84c;
    margin: 0 0 20px;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .brand-kicker.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .brand-headline {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(34px, 5.5vw, 68px);
    line-height: 1.1;
    color: #f5f0e8;
    margin: 0;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s;
  }

  .brand-headline.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .brand-headline em {
    font-style: italic;
    color: #c9a84c;
  }

  .brand-divider {
    width: 48px;
    height: 1px;
    background: linear-gradient(to right, transparent, #c9a84c, transparent);
    margin: 28px auto 0;
    opacity: 0;
    transition: opacity 0.8s ease 0.3s;
  }

  .brand-divider.visible {
    opacity: 1;
  }

  .brand-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    max-width: 1080px;
    margin: 0 auto;
  }

  @media (max-width: 860px) {
    .brand-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .brand-stats {
      grid-template-columns: 1fr;
    }
  }

  .brand-stat {
    padding: 44px 32px;
    border: 1px solid rgba(201,168,76,0.12);
    text-align: center;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease, background 0.3s ease, border-color 0.3s ease;
  }

  .brand-stat.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .brand-stat:hover {
    background: rgba(201,168,76,0.06);
    border-color: rgba(201,168,76,0.3);
  }

  .brand-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(38px, 4.5vw, 58px);
    line-height: 1;
    color: #c9a84c;
    margin: 0 0 12px;
    letter-spacing: -0.01em;
  }

  .brand-stat-value sup {
    font-size: 0.5em;
    vertical-align: super;
    letter-spacing: 0;
  }

  .brand-stat-label {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.55);
    margin: 0;
    line-height: 1.6;
  }

  .brand-stat-icon {
    font-size: 22px;
    margin-bottom: 16px;
    display: block;
    opacity: 0.7;
  }
`;

const STATS = [
  {
    icon: "◎",
    display: "0.3%",
    label: "Acidez Máxima",
    numeric: null,
    suffix: "%",
    prefix: "",
    decimals: 1,
    countTo: 0.3,
  },
  {
    icon: "❄",
    display: "Primera",
    label: "Presión en Frío",
    numeric: null,
  },
  {
    icon: "✦",
    display: "100%",
    label: "Extra Virgen",
    numeric: 100,
    suffix: "%",
    prefix: "",
    decimals: 0,
    countTo: 100,
  },
  {
    icon: "⟡",
    display: "Cosecha",
    label: "Selectiva",
    numeric: null,
  },
];

function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);
  return isVisible;
}

function useCountUp(target, decimals, duration, start) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target == null) return;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((ease * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target, decimals, duration]);
  return value;
}

function StatCard({ stat, delay, triggerCount }) {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref);
  const countValue = useCountUp(stat.countTo, stat.decimals ?? 0, 1400, isVisible && stat.numeric != null);

  const displayValue = stat.numeric != null
    ? `${stat.prefix ?? ""}${countValue}${stat.suffix ?? ""}`
    : stat.display;

  return (
    <div
      ref={ref}
      className={`brand-stat${isVisible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="brand-stat-icon" aria-hidden>{stat.icon}</span>
      <p className="brand-stat-value">{displayValue}</p>
      <p className="brand-stat-label">{stat.label}</p>
    </div>
  );
}

export default function BrandStory() {
  const headlineRef = useRef(null);
  const kickerRef = useRef(null);
  const dividerRef = useRef(null);
  const isHeadlineVisible = useIntersectionObserver(headlineRef);
  const isKickerVisible = useIntersectionObserver(kickerRef);
  const isDividerVisible = useIntersectionObserver(dividerRef);

  return (
    <>
      <style>{styles}</style>
      <section className="brand-root" aria-label="Nuestra historia">
        <div className="brand-headline-wrap">
          <p ref={kickerRef} className={`brand-kicker${isKickerVisible ? " visible" : ""}`}>
            Desde el Valle Central de Chile
          </p>
          <h2 ref={headlineRef} className={`brand-headline${isHeadlineVisible ? " visible" : ""}`}>
            Pureza que se <em>siente</em><br />en cada gota
          </h2>
          <div ref={dividerRef} className={`brand-divider${isDividerVisible ? " visible" : ""}`} aria-hidden />
        </div>

        <div className="brand-stats">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={i * 120} />
          ))}
        </div>
      </section>
    </>
  );
}
