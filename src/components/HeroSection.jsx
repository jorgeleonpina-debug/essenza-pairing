import { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  .hero-root {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 600px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0d2214;
    font-family: 'Jost', sans-serif;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(13,34,20,0.82) 0%, rgba(13,34,20,0.55) 50%, rgba(13,34,20,0.80) 100%);
    background-color: #0d2214;
    transform: scale(1.08);
    will-change: transform;
    transition: transform 0.1s linear;
  }

  .hero-bg-watermark {
    position: absolute;
    inset: 0;
    background-image: url('/images/images%20web/logo-transparent-hq.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 65%;
    opacity: 0.07;
    pointer-events: none;
  }

  .hero-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  @keyframes floatUp {
    0%   { transform: translateY(0)    rotate(0deg);   opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
  }

  .particle {
    position: absolute;
    bottom: -20px;
    border-radius: 50%;
    background: #c9a84c;
    animation: floatUp linear infinite;
    opacity: 0;
  }

  .hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 0 24px;
    max-width: 820px;
  }

  .hero-eyebrow {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: clamp(11px, 1.4vw, 14px);
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #c9a84c;
    margin: 0 0 24px;
    opacity: 0;
    transform: translateY(20px);
    animation: heroFadeUp 0.9s ease forwards 0.3s;
  }

  @keyframes heroFadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-headline {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(38px, 7vw, 88px);
    line-height: 1.08;
    color: #f5f0e8;
    margin: 0 0 12px;
    opacity: 0;
    transform: translateY(28px);
    animation: heroFadeUp 1s ease forwards 0.55s;
  }

  .hero-headline em {
    font-style: italic;
    color: #c9a84c;
  }

  .hero-subline {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(18px, 3vw, 32px);
    color: rgba(245,240,232,0.75);
    margin: 0 0 48px;
    opacity: 0;
    transform: translateY(20px);
    animation: heroFadeUp 1s ease forwards 0.75s;
  }

  .hero-ctas {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(20px);
    animation: heroFadeUp 1s ease forwards 1s;
  }

  .cta-primary {
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #0d2214;
    background: #c9a84c;
    border: none;
    padding: 16px 40px;
    cursor: pointer;
    transition: background 0.25s, transform 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .cta-primary:hover {
    background: #e8c46a;
    transform: translateY(-2px);
  }

  .cta-secondary {
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #f5f0e8;
    background: transparent;
    border: 1px solid rgba(245,240,232,0.5);
    padding: 16px 40px;
    cursor: pointer;
    transition: border-color 0.25s, color 0.25s, transform 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .cta-secondary:hover {
    border-color: #c9a84c;
    color: #c9a84c;
    transform: translateY(-2px);
  }

  .hero-scroll {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0;
    animation: heroFadeUp 1s ease forwards 1.4s;
    cursor: pointer;
  }

  .hero-scroll span {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.8);
  }

  @keyframes bounceDown {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50%       { transform: translateY(8px); opacity: 0.4; }
  }

  .hero-scroll-arrow {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, #c9a84c, transparent);
    animation: bounceDown 1.8s ease-in-out infinite;
  }

  .hero-badge {
    position: absolute;
    top: 36px;
    right: 36px;
    z-index: 10;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation: heroFadeUp 0.8s ease forwards 1.6s;
  }

  .hero-badge img {
    width: 52px;
    height: 52px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }
`;

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  key: i,
  size: Math.random() * 4 + 2,
  left: Math.random() * 100,
  delay: Math.random() * 12,
  duration: Math.random() * 14 + 10,
  opacity: Math.random() * 0.5 + 0.3,
}));

export default function HeroSection({ onShopClick, onAiClick }) {
  const bgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const y = window.scrollY;
      bgRef.current.style.transform = `scale(1.08) translateY(${y * 0.3}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>
      <section className="hero-root">
        <div className="hero-bg" ref={bgRef}>
          <div className="hero-bg-watermark" aria-hidden />
        </div>

        <div className="hero-particles" aria-hidden>
          {PARTICLES.map((p) => (
            <div
              key={p.key}
              className="particle"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        <div className="hero-badge" aria-hidden>
          <img src="/images/logo-header-dark.png" alt="" />
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">Valle Central de Chile · Prensado en frío</p>
          <h1 className="hero-headline">
            El aceite que<br /><em>transforma</em><br />tu cocina
          </h1>
          <p className="hero-subline">Extra virgen · Acidez máxima 0.3%</p>

          <div className="hero-ctas">
            <button className="cta-primary" onClick={onShopClick}>
              Ver productos
            </button>
            <button className="cta-secondary" onClick={onAiClick}>
              Maridaje con IA
            </button>
          </div>
        </div>

        <div className="hero-scroll" onClick={scrollDown} role="button" aria-label="Desplazar hacia abajo">
          <span>Descubrir</span>
          <div className="hero-scroll-arrow" />
        </div>
      </section>
    </>
  );
}
