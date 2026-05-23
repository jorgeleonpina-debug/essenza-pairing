import { useEffect, useRef, useState, useCallback } from "react";

const styles = `
  .testi-root {
    background: #0d2214;
    padding: 96px 0 104px;
    overflow: hidden;
  }

  .testi-header {
    text-align: center;
    padding: 0 24px;
    margin-bottom: 64px;
  }

  .testi-kicker {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: #c9a84c;
    margin: 0 0 18px;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .testi-kicker.visible { opacity: 1; transform: translateY(0); }

  .testi-headline {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(32px, 5vw, 60px);
    line-height: 1.1;
    color: #f5f0e8;
    margin: 0;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.8s ease 0.12s, transform 0.8s ease 0.12s;
  }
  .testi-headline.visible { opacity: 1; transform: translateY(0); }
  .testi-headline em { font-style: italic; color: #c9a84c; }

  /* Track */
  .testi-track-outer {
    position: relative;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
  }
  .testi-track-outer.visible { opacity: 1; transform: translateY(0); }

  .testi-track {
    display: flex;
    gap: 20px;
    padding: 8px 60px 24px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    cursor: grab;
  }
  .testi-track::-webkit-scrollbar { display: none; }
  .testi-track.dragging { cursor: grabbing; }

  /* Card */
  .testi-card {
    flex: 0 0 340px;
    scroll-snap-align: start;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.15);
    padding: 36px 32px 32px;
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: border-color 0.3s ease, background 0.3s ease;
  }
  .testi-card:hover {
    border-color: rgba(201,168,76,0.35);
    background: rgba(201,168,76,0.04);
  }

  @media (max-width: 600px) {
    .testi-track { padding: 8px 24px 24px; }
    .testi-card { flex: 0 0 280px; }
  }

  .testi-stars {
    display: flex;
    gap: 3px;
    margin-bottom: 20px;
  }
  .testi-star {
    color: #c9a84c;
    font-size: 14px;
  }

  .testi-quote {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: 18px;
    line-height: 1.65;
    color: rgba(245,240,232,0.85);
    margin: 0 0 28px;
    flex: 1;
  }

  .testi-author {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .testi-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(201,168,76,0.15);
    border: 1px solid rgba(201,168,76,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: #c9a84c;
    flex-shrink: 0;
  }

  .testi-name {
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 13px;
    color: #f5f0e8;
    margin: 0 0 2px;
    letter-spacing: 0.04em;
  }

  .testi-location {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: rgba(245,240,232,0.35);
    margin: 0;
  }

  /* Dots */
  .testi-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 40px;
    padding: 0 24px;
  }
  .testi-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(201,168,76,0.2);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background 0.25s, transform 0.25s;
  }
  .testi-dot.active {
    background: #c9a84c;
    transform: scale(1.4);
  }

  /* Nav arrows */
  .testi-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
  }
  .testi-arrow {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.3);
    background: transparent;
    color: #c9a84c;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.25s, background 0.25s, transform 0.2s;
    line-height: 1;
  }
  .testi-arrow:hover {
    border-color: #c9a84c;
    background: rgba(201,168,76,0.08);
    transform: scale(1.05);
  }
`;

const REVIEWS = [
  {
    quote: "El aceite con menos acidez que he probado. Lo uso en crudo sobre mis ensaladas y el sabor es simplemente extraordinario.",
    name: "Camila R.",
    location: "Santiago, RM",
    stars: 5,
  },
  {
    quote: "Compré el pack completo como regalo corporativo y quedaron fascinados. La presentación y la calidad del aceite son de otro nivel.",
    name: "Rodrigo M.",
    location: "Viña del Mar",
    stars: 5,
  },
  {
    quote: "El bidón de 5L es perfecto para mi restaurante. La consistencia en sabor de cosecha a cosecha es lo que más valoro.",
    name: "Chef Andrés V.",
    location: "Concepción",
    stars: 5,
  },
  {
    quote: "Increíble el maridaje que me sugirió la IA para mi pasta al pesto. Desde ese día no uso otro aceite.",
    name: "Valentina S.",
    location: "Puerto Montt",
    stars: 5,
  },
  {
    quote: "El aroma frutado y el picante suave al final del paladar me convencieron desde la primera gota. 100% chileno y se nota.",
    name: "Felipe T.",
    location: "Temuco",
    stars: 5,
  },
  {
    quote: "Recibo el bidón mensualmente. El despacho es rápido y el aceite llega siempre perfecto. No volvería a comprar otro.",
    name: "María José A.",
    location: "Rancagua",
    stars: 5,
  },
];

function Stars({ n }) {
  return (
    <div className="testi-stars" aria-label={`${n} estrellas`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="testi-star" aria-hidden>★</span>
      ))}
    </div>
  );
}

function useVisible(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

export default function Testimonials() {
  const kickerRef = useRef(null);
  const headlineRef = useRef(null);
  const trackOuterRef = useRef(null);
  const trackRef = useRef(null);
  const kickerVisible = useVisible(kickerRef);
  const headlineVisible = useVisible(headlineRef);
  const trackVisible = useVisible(trackOuterRef);

  const [activeIdx, setActiveIdx] = useState(0);

  // Drag-to-scroll
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX - trackRef.current.offsetLeft, scrollLeft: trackRef.current.scrollLeft };
    trackRef.current.classList.add("dragging");
  };
  const onMouseLeave = () => { drag.current.active = false; trackRef.current?.classList.remove("dragging"); };
  const onMouseUp = () => { drag.current.active = false; trackRef.current?.classList.remove("dragging"); };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - drag.current.startX) * 1.2;
    trackRef.current.scrollLeft = drag.current.scrollLeft - walk;
  };

  // Sync dots to scroll position
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth + 20 || 360;
    setActiveIdx(Math.round(el.scrollLeft / cardWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollTo = (idx) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth + 20 || 360;
    el.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
    setActiveIdx(idx);
  };

  const prev = () => scrollTo(Math.max(0, activeIdx - 1));
  const next = () => scrollTo(Math.min(REVIEWS.length - 1, activeIdx + 1));

  return (
    <>
      <style>{styles}</style>
      <section className="testi-root" aria-label="Opiniones de clientes">
        <div className="testi-header">
          <p ref={kickerRef} className={`testi-kicker${kickerVisible ? " visible" : ""}`}>
            Lo que dicen nuestros clientes
          </p>
          <h2 ref={headlineRef} className={`testi-headline${headlineVisible ? " visible" : ""}`}>
            Sabor que <em>enamora</em>
          </h2>
        </div>

        <div ref={trackOuterRef} className={`testi-track-outer${trackVisible ? " visible" : ""}`}>
          <div
            ref={trackRef}
            className="testi-track"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {REVIEWS.map((r, i) => (
              <article key={i} className="testi-card">
                <Stars n={r.stars} />
                <blockquote className="testi-quote">"{r.quote}"</blockquote>
                <div className="testi-author">
                  <div className="testi-avatar" aria-hidden>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="testi-name">{r.name}</p>
                    <p className="testi-location">{r.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="testi-nav" role="group" aria-label="Navegación de reseñas">
            <button className="testi-arrow" onClick={prev} aria-label="Anterior">‹</button>
            <button className="testi-arrow" onClick={next} aria-label="Siguiente">›</button>
          </div>

          <div className="testi-dots" role="tablist" aria-label="Reseñas">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                className={`testi-dot${i === activeIdx ? " active" : ""}`}
                onClick={() => scrollTo(i)}
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Reseña ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
