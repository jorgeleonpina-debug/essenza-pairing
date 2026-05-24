import { useEffect, useRef, useState } from "react";

const styles = `
  .brand-root {
    background: #0d2214;
    padding: 96px 24px 104px;
    overflow: hidden;
    border-top: 1px solid rgba(201,168,76,0.12);
    border-bottom: 1px solid rgba(201,168,76,0.12);
  }

  .brand-headline-wrap {
    text-align: center;
    margin-bottom: 72px;
  }

  .brand-kicker {
    font-family: 'Cormorant Garamond', serif;
    font-size: 10px;
    letter-spacing: 0.38em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.7);
    margin: 0 0 20px;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .brand-kicker.visible { opacity: 1; transform: translateY(0); }

  .brand-headline {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: clamp(40px, 6vw, 56px);
    line-height: 1.05;
    color: #c9a84c;
    margin: 0 0 24px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s;
  }
  .brand-headline.visible { opacity: 1; transform: translateY(0); }
  .brand-headline em { font-style: italic; color: #f5f0e8; }

  .brand-gold-line {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
    margin: 0 auto 32px;
    opacity: 0;
    transition: opacity 0.8s ease 0.25s;
  }
  .brand-gold-line.visible { opacity: 1; }

  .brand-diamonds {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: rgba(201,168,76,0.4);
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.8s ease 0.35s;
  }
  .brand-diamonds.visible { opacity: 1; }

  .brand-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    max-width: 1000px;
    margin: 72px auto 0;
  }

  @media (max-width: 860px) {
    .brand-stats { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  }
  @media (max-width: 480px) {
    .brand-stats { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  }

  .brand-stat {
    border-top: 2px solid rgba(201,168,76,0.35);
    padding-top: 28px;
    text-align: center;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .brand-stat.visible { opacity: 1; transform: translateY(0); }
  .brand-stat:hover { border-top-color: #c9a84c; }

  .brand-stat-ornament {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.4);
    margin-bottom: 16px;
  }

  .brand-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(36px, 4.5vw, 58px);
    line-height: 1;
    color: #c9a84c;
    margin: 0 0 14px;
    letter-spacing: -0.01em;
  }

  .brand-stat-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.5);
    margin: 0;
    line-height: 1.6;
  }

  .brand-stat-sub {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 11px;
    color: rgba(245,240,232,0.3);
    margin: 8px 0 0;
    line-height: 1.5;
  }
`;

const STATS = [
  { ornament: "◆", display: "0.3%",     label: "Acidez Máxima",  sub: "Extra virgen certificado", numeric: null },
  { ornament: "◆", display: "Extracción", label: "en Frío",        sub: "Sin calor ni solventes",   numeric: null },
  { ornament: "◆", display: "100%",     label: "Extra Virgen",    sub: "Máxima calidad",           numeric: 100, suffix: "%", countTo: 100, decimals: 0 },
  { ornament: "◆", display: "Cosecha",  label: "Selectiva",       sub: "Valle Central, Chile",     numeric: null },
];

function useVisible(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return v;
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

function StatCard({ stat, delay }) {
  const ref = useRef(null);
  const visible = useVisible(ref);
  const countValue = useCountUp(stat.countTo, stat.decimals ?? 0, 1400, visible && stat.numeric != null);
  const displayValue = stat.numeric != null ? `${countValue}${stat.suffix ?? ""}` : stat.display;

  return (
    <div ref={ref} className={`brand-stat${visible ? " visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      <span className="brand-stat-ornament" aria-hidden>{stat.ornament}</span>
      <p className="brand-stat-value">{displayValue}</p>
      <p className="brand-stat-label">{stat.label}</p>
      <p className="brand-stat-sub">{stat.sub}</p>
    </div>
  );
}

export default function BrandStory() {
  const kickerRef = useRef(null);
  const headlineRef = useRef(null);
  const lineRef = useRef(null);
  const diamondsRef = useRef(null);
  const kickerV = useVisible(kickerRef);
  const headlineV = useVisible(headlineRef);
  const lineV = useVisible(lineRef);
  const diamondsV = useVisible(diamondsRef);

  return (
    <>
      <style>{styles}</style>
      <section className="brand-root" aria-label="Nuestra historia">
        <div className="brand-headline-wrap">
          <p ref={kickerRef} className={`brand-kicker${kickerV ? " visible" : ""}`}>
            Desde el Valle Central de Chile
          </p>
          <h2 ref={headlineRef} className={`brand-headline${headlineV ? " visible" : ""}`}>
            Pureza que se <em>siente</em><br />en cada gota
          </h2>
          <div ref={lineRef} className={`brand-gold-line${lineV ? " visible" : ""}`} aria-hidden />
          <div ref={diamondsRef} className={`brand-diamonds${diamondsV ? " visible" : ""}`} aria-hidden>
            <span>◆</span><span>◆</span><span>◆</span>
          </div>
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
