import { useEffect, useRef, useState } from "react";

const styles = `
  .ps-root {
    background: #111111;
    padding: 96px 0 104px;
    overflow: hidden;
  }

  .ps-header {
    text-align: center;
    padding: 0 24px;
    margin-bottom: 64px;
  }

  .ps-kicker {
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
  .ps-kicker.visible { opacity: 1; transform: translateY(0); }

  .ps-headline {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: clamp(32px, 5vw, 60px);
    line-height: 1.1;
    color: #f5f0e8;
    margin: 0 0 16px;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.8s ease 0.12s, transform 0.8s ease 0.12s;
  }
  .ps-headline.visible { opacity: 1; transform: translateY(0); }
  .ps-headline em { font-style: italic; color: #c9a84c; }

  .ps-sub {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 13px;
    letter-spacing: 0.08em;
    color: rgba(245,240,232,0.4);
    margin: 0;
    opacity: 0;
    transition: opacity 0.8s ease 0.25s;
  }
  .ps-sub.visible { opacity: 1; }

  /* Track */
  .ps-track-wrap {
    position: relative;
    padding: 0 24px;
  }

  .ps-track {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 1160px;
    margin: 0 auto;
  }

  @media (max-width: 900px) {
    .ps-track {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 520px) {
    .ps-track {
      grid-template-columns: 1fr;
      max-width: 340px;
    }
  }

  /* Card */
  .ps-card {
    position: relative;
    background: #0d2214;
    border: 1px solid rgba(201,168,76,0.12);
    display: flex;
    flex-direction: column;
    cursor: pointer;
    opacity: 0;
    transform: translateY(32px);
    transition:
      opacity 0.6s ease,
      transform 0.6s ease,
      border-color 0.3s ease,
      box-shadow 0.3s ease;
  }
  .ps-card.visible { opacity: 1; transform: translateY(0); }
  .ps-card:hover {
    border-color: rgba(201,168,76,0.4);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  }
  .ps-card:hover .ps-card-img {
    transform: scale(1.04);
  }

  .ps-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 2;
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #0d2214;
    background: #c9a84c;
    padding: 4px 10px;
  }

  .ps-card-img-wrap {
    width: 100%;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: #0a1c0f;
  }

  .ps-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s ease;
    display: block;
  }

  .ps-card-body {
    padding: 20px 20px 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ps-card-volume {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.65);
    margin: 0 0 6px;
  }

  .ps-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: 20px;
    color: #f5f0e8;
    margin: 0 0 10px;
    line-height: 1.2;
  }

  .ps-card-desc {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 12px;
    line-height: 1.7;
    color: rgba(245,240,232,0.45);
    margin: 0 0 20px;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ps-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .ps-card-price {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 22px;
    color: #c9a84c;
    letter-spacing: 0.02em;
  }

  .ps-card-btn {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #0d2214;
    background: #c9a84c;
    border: none;
    padding: 10px 18px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .ps-card-btn:hover { background: #e8c46a; transform: translateY(-1px); }

  /* Bottom CTA */
  .ps-cta-wrap {
    text-align: center;
    margin-top: 56px;
    padding: 0 24px;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .ps-cta-wrap.visible { opacity: 1; transform: translateY(0); }

  .ps-cta-btn {
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #f5f0e8;
    background: transparent;
    border: 1px solid rgba(201,168,76,0.4);
    padding: 16px 48px;
    cursor: pointer;
    transition: border-color 0.25s, color 0.25s, transform 0.2s;
  }
  .ps-cta-btn:hover { border-color: #c9a84c; color: #c9a84c; transform: translateY(-2px); }
`;

const PRODUCTS = [
  {
    id: 1, name: "Aceite Extra Virgen", volume: "250ml",
    price: "$2.490", badge: null, image: "/images/bottle-250ml.jpeg",
    description: "Botella de iniciación perfecta para descubrir Essenza. Prensado en frío, cosecha selectiva, acidez máxima 0.3%.",
  },
  {
    id: 2, name: "Aceite Extra Virgen", volume: "1L",
    price: "$14.990", badge: "Más vendido", image: "/images/bottle-1l.jpeg",
    description: "El favorito de nuestra comunidad. Cosecha selectiva, extracción en frío, acidez máxima 0.3%. Perfecto para cocinar y regalar.",
  },
  {
    id: 3, name: "Bidón Extra Virgen", volume: "5L",
    price: "$32.990", badge: null, image: "/images/bidon-5l.jpeg",
    description: "Ideal para uso diario y cocina profesional. Primera presión en frío, acidez máxima 0.3%. Origen: Valle Central de Chile.",
  },
  {
    id: 4, name: "Pack Completo", volume: "Aceite + Aceto Balsámico",
    price: "$47.990", badge: "Oferta especial", image: "/images/pack-completo.jpeg",
    description: "El regalo perfecto. Aceite extra virgen Essenza y aceto balsámico premium en un pack exclusivo.",
  },
];

function useVisible(ref, threshold = 0.18) {
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

function ProductCard({ product, delay, onAddToCart }) {
  const ref = useRef(null);
  const visible = useVisible(ref);

  return (
    <div
      ref={ref}
      className={`ps-card${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {product.badge && <span className="ps-badge">{product.badge}</span>}
      <div className="ps-card-img-wrap">
        <img
          src={product.image}
          alt={`${product.name} ${product.volume}`}
          className="ps-card-img"
          loading="lazy"
        />
      </div>
      <div className="ps-card-body">
        <p className="ps-card-volume">{product.volume}</p>
        <h3 className="ps-card-name">{product.name}</h3>
        <p className="ps-card-desc">{product.description}</p>
        <div className="ps-card-footer">
          <span className="ps-card-price">{product.price}</span>
          <button
            className="ps-card-btn"
            onClick={() => onAddToCart(product.id, 1)}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsShowcase({ onAddToCart, onViewAll }) {
  const headerRef = useRef(null);
  const kickerRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const headerVisible = useVisible(headerRef);
  const kickerVisible = useVisible(kickerRef);
  const subVisible = useVisible(subRef);
  const ctaVisible = useVisible(ctaRef);

  return (
    <>
      <style>{styles}</style>
      <section className="ps-root" aria-label="Nuestros productos">
        <div className="ps-header">
          <p ref={kickerRef} className={`ps-kicker${kickerVisible ? " visible" : ""}`}>
            Tienda Essenza
          </p>
          <h2 ref={headerRef} className={`ps-headline${headerVisible ? " visible" : ""}`}>
            Lleva Essenza a<br /><em>tu cocina</em>
          </h2>
          <p ref={subRef} className={`ps-sub${subVisible ? " visible" : ""}`}>
            100% chileno · Prensado en frío · Máximo 0.3% acidez
          </p>
        </div>

        <div className="ps-track-wrap">
          <div className="ps-track">
            {PRODUCTS.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                delay={i * 100}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>

        <div ref={ctaRef} className={`ps-cta-wrap${ctaVisible ? " visible" : ""}`}>
          <button className="ps-cta-btn" onClick={onViewAll}>
            Ver tienda completa
          </button>
        </div>
      </section>
    </>
  );
}
