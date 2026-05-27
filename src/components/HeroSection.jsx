import { useEffect, useRef } from "react";

const styles = `
  .hero-root {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 620px;
    padding-top: 56px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0d2214;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.06) 0%, transparent 55%),
                radial-gradient(ellipse at 70% 20%, rgba(45,74,30,0.5) 0%, transparent 50%),
                #0d2214;
    transform: scale(1.08);
    will-change: transform;
    transition: transform 0.1s linear;
  }

  .hero-bg-watermark {
    position: absolute;
    inset: 0;
    background-image: url('/images/logo-transparent-hq.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 55%;
    opacity: 0.055;
    pointer-events: none;
  }

  /* Thin horizontal gold lines framing the content */
  .hero-line-top,
  .hero-line-bottom {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: min(600px, 80vw);
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent);
    pointer-events: none;
    z-index: 5;
  }
  .hero-line-top    { top: calc(56px + 36px); }
  .hero-line-bottom { bottom: 80px; }

  @keyframes heroFadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes floatUp {
    0%   { transform: translateY(0) rotate(0deg);    opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.5; }
    100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
  }

  .hero-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    bottom: -20px;
    border-radius: 50%;
    background: #c9a84c;
    animation: floatUp linear infinite;
    opacity: 0;
  }

  /* Content */
  .hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 0 28px;
    max-width: 860px;
  }

  .hero-eyebrow {
    font-family: 'Cormorant Garamond', serif;
    font-size: 10px;
    letter-spacing: 0.38em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.75);
    margin: 0 0 22px;
    opacity: 0;
    transform: translateY(16px);
    animation: heroFadeUp 0.9s ease forwards 0.2s;
  }

  .hero-eyebrow-line {
    width: 56px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
    margin: 0 auto 28px;
    opacity: 0;
    animation: heroFadeUp 0.9s ease forwards 0.35s;
  }

  .hero-headline {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(48px, 8.5vw, 96px);
    line-height: 1.04;
    color: #f5f0e8;
    margin: 0 0 20px;
    letter-spacing: -0.01em;
    opacity: 0;
    transform: translateY(28px);
    animation: heroFadeUp 1.1s ease forwards 0.5s;
  }

  .hero-headline em {
    font-style: italic;
    color: #c9a84c;
  }

  .hero-diamonds {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: rgba(201,168,76,0.38);
    font-size: 10px;
    margin: 0 0 20px;
    opacity: 0;
    animation: heroFadeUp 0.9s ease forwards 0.7s;
  }

  .hero-subline {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(17px, 2.6vw, 26px);
    color: rgba(245,240,232,0.6);
    margin: 0 0 52px;
    letter-spacing: 0.02em;
    opacity: 0;
    transform: translateY(16px);
    animation: heroFadeUp 1s ease forwards 0.85s;
  }

  .hero-ctas {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(16px);
    animation: heroFadeUp 1s ease forwards 1.05s;
  }

  .cta-primary {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #0d2214;
    background: #c9a84c;
    border: none;
    padding: 16px 44px;
    cursor: pointer;
    transition: background 0.25s, transform 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .cta-primary:hover { background: #e8c46a; transform: translateY(-2px); }

  .cta-secondary {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.85);
    background: transparent;
    border: 1px solid rgba(201,168,76,0.4);
    padding: 16px 44px;
    cursor: pointer;
    transition: border-color 0.25s, color 0.25s, transform 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .cta-secondary:hover { border-color: #c9a84c; color: #c9a84c; transform: translateY(-2px); }

  /* Scroll indicator */
  .hero-scroll {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    opacity: 0;
    animation: heroFadeUp 1s ease forwards 1.5s;
    cursor: pointer;
  }

  .hero-scroll-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 9px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.6);
  }

  @keyframes scrollPulse {
    0%, 100% { transform: scaleY(1);   opacity: 0.7; }
    50%       { transform: scaleY(0.5); opacity: 0.3; }
  }

  .hero-scroll-line {
    width: 1px;
    height: 44px;
    background: linear-gradient(to bottom, #c9a84c, transparent);
    transform-origin: top center;
    animation: scrollPulse 2s ease-in-out infinite;
  }
`;

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  key: i,
  size: Math.random() * 3 + 1.5,
  left: Math.random() * 100,
  delay: Math.random() * 14,
  duration: Math.random() * 14 + 12,
}));

export default function HeroSection({ onShopClick, onAiClick }) {
  const bgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      bgRef.current.style.transform = `scale(1.08) translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <section className="hero-root">
        <div className="hero-bg" ref={bgRef}>
          <div className="hero-bg-watermark" aria-hidden />
        </div>

        <div className="hero-particles" aria-hidden>
          {PARTICLES.map((p) => (
            <div key={p.key} className="particle" style={{ width: p.size, height: p.size, left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }} />
          ))}
        </div>

        <div className="hero-line-top" aria-hidden />
        <div className="hero-line-bottom" aria-hidden />

        <div className="hero-content">
          <p className="hero-eyebrow">Valle Central de Chile · Extracción en frío</p>
          <div className="hero-eyebrow-line" aria-hidden />

          <h1 className="hero-headline">
            El aceite que<br /><em>transforma</em><br />tu cocina
          </h1>

          <div className="hero-diamonds" aria-hidden>
            <span>◆</span><span>◆</span><span>◆</span>
          </div>

          <p className="hero-subline">Extra virgen · Acidez máxima 0.3%</p>

          <div className="hero-ctas">
            <button className="cta-primary" onClick={onShopClick}>Ver productos</button>
            <button className="cta-secondary" onClick={onAiClick}>Maridaje con IA</button>
          </div>
        </div>

        <div className="hero-scroll" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} role="button" aria-label="Desplazar hacia abajo">
          <span className="hero-scroll-label">Descubrir</span>
          <div className="hero-scroll-line" />
        </div>
      </section>
    </>
  );
}
