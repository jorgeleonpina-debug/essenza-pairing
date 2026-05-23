import { useEffect, useRef, useState } from "react";

const styles = `
  .ps-root {
    background: #0d2214;
    padding: 96px 0 104px;
    overflow: hidden;
    border-top: 1px solid rgba(201,168,76,0.12);
    border-bottom: 1px solid rgba(201,168,76,0.12);
  }

  .ps-header {
    text-align: center;
    padding: 0 24px;
    margin-bottom: 64px;
  }

  .ps-kicker {
    font-family: 'Cormorant Garamond', serif;
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.7);
    margin: 0 0 20px;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .ps-kicker.visible { opacity: 1; transform: translateY(0); }

  .ps-headline {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: clamp(40px, 6vw, 56px);
    line-height: 1;
    color: #c9a84c;
    margin: 0 0 24px;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.8s ease 0.12s, transform 0.8s ease 0.12s;
  }
  .ps-headline.visible { opacity: 1; transform: translateY(0); }

  .ps-gold-line {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
    margin: 0 auto 40px;
    opacity: 0;
    transition: opacity 0.8s ease 0.2s;
  }
  .ps-gold-line.visible { opacity: 1; }

  .ps-diamonds {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 56px;
    color: rgba(201,168,76,0.4);
    font-size: 11px;
    opacity: 0;
    transition: opacity 0.8s ease 0.3s;
  }
  .ps-diamonds.visible { opacity: 1; }

  .ps-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: clamp(15px, 2vw, 17px);
    letter-spacing: 0.04em;
    color: rgba(245,240,232,0.6);
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
    gap: 16px;
    max-width: 1160px;
    margin: 0 auto;
  }

  @media (max-width: 900px) {
    .ps-track { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 520px) {
    .ps-track { grid-template-columns: 1fr; max-width: 340px; }
  }

  /* Card */
  .ps-card {
    position: relative;
    background: rgba(0,0,0,0.25);
    border: 1px solid rgba(201,168,76,0.12);
    border-top: 2px solid rgba(201,168,76,0.35);
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
    border-color: rgba(201,168,76,0.5);
    border-top-color: #c9a84c;
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  }
  .ps-card:hover .ps-card-img {
    transform: scale(1.04);
  }

  .ps-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 2;
    font-family: 'Cormorant Garamond', serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #0d2214;
    background: #c9a84c;
    padding: 4px 10px;
  }

  .ps-card-img-wrap {
    width: 100%;
    aspect-ratio: 1/1;
    overflow: hidden;
    background: #f7f4ee;
  }

  .ps-card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    padding: 12px;
    box-sizing: border-box;
    transition: transform 0.5s ease;
    display: block;
  }

  .ps-card-body {
    padding: 18px 18px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ps-card-volume {
    font-family: 'Cormorant Garamond', serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.55);
    margin: 0 0 6px;
  }

  .ps-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: 18px;
    color: #f5f0e8;
    margin: 0 0 8px;
    line-height: 1.25;
  }

  .ps-card-desc {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 11px;
    line-height: 1.7;
    color: rgba(245,240,232,0.4);
    margin: 0 0 14px;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ps-card-price {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 24px;
    color: #c9a84c;
    letter-spacing: 0.02em;
    display: block;
    margin-bottom: 12px;
  }

  .ps-card-qty {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .ps-qty-btn {
    background: transparent;
    border: 1px solid rgba(201,168,76,0.3);
    color: #c9a84c;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    font-family: 'Cormorant Garamond', serif;
    transition: background 0.18s, border-color 0.18s;
    padding: 0;
  }
  .ps-qty-btn:hover:not(:disabled) { background: rgba(201,168,76,0.1); border-color: #c9a84c; }
  .ps-qty-btn:disabled { opacity: 0.25; cursor: default; }

  .ps-qty-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 600;
    color: #f5f0e8;
    min-width: 22px;
    text-align: center;
  }

  .ps-card-btn {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #0d2214;
    background: #c9a84c;
    border: none;
    padding: 12px 0;
    width: 100%;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .ps-card-btn:hover { background: #e8c46a; transform: translateY(-1px); }

  /* Bottom CTA */
  .ps-cta-wrap {
    text-align: center;
    margin-top: 64px;
    padding: 0 24px;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .ps-cta-wrap.visible { opacity: 1; transform: translateY(0); }

  .ps-cta-btn {
    font-family: 'Cormorant Garamond', serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #c9a84c;
    background: transparent;
    border: 1px solid rgba(201,168,76,0.4);
    padding: 16px 52px;
    cursor: pointer;
    transition: border-color 0.25s, color 0.25s, transform 0.2s;
  }
  .ps-cta-btn:hover { border-color: #c9a84c; transform: translateY(-2px); }
`;

const PRODUCTS = [
  {
    id: 1, name: "Bidón Extra Virgen 5L", volume: "Bidón plástico 5L",
    price: "$49.990", numericPrice: 49990, badge: null, image: "/images/1.png",
    description: "Bidón plástico 5L. Acidez 0.3%, primera extracción en frío. Ideal para cocinar, ensaladas, carnes y pastas.",
  },
  {
    id: 2, name: "Pack 2 Bidones 5L", volume: "2 Bidones · 10L total",
    price: "$81.990", numericPrice: 81990, badge: null, image: "/images/2.png",
    description: "2 bidones de 5L = 10 litros. Mejor precio por litro. Ideal para uso frecuente y cocina profesional.",
  },
  {
    id: 3, name: "Pack 3 Bidones 5L", volume: "3 Bidones · 15L total",
    price: "$109.990", numericPrice: 109990, badge: null, image: "/images/3.png",
    description: "3 bidones de 5L = 15 litros. Máximo ahorro por litro. Ideal para restaurantes y cocina gourmet.",
  },
  {
    id: 4, name: "Pack 4 Bidones 5L", volume: "4 Bidones · 20L total",
    price: "$174.990", numericPrice: 174990, badge: "Oferta", image: "/images/4.png",
    description: "4 bidones de 5L = 20 litros. Mejor precio por litro $8.750. Ideal para cocina gourmet, ensaladas, frituras y preparaciones mediterráneas.",
  },
  {
    id: 5, name: "Aceite Extra Virgen Botella 1L", volume: "Botella vidrio 1L",
    price: "$14.990", numericPrice: 14990, badge: "Más Vendido", image: "/images/5.png",
    description: "Botella vidrio 1L. Cosecha selectiva, extracción en frío. Acidez máxima 0.3%.",
  },
  {
    id: 6, name: "Pack 6 Botellas 1L", volume: "6 Botellas · 6L total",
    price: "$74.990", numericPrice: 74990, badge: null, image: "/images/6.png",
    description: "6 botellas de 1L = 6 litros. 12 cuotas sin interés. Ideal para aderezos, cocina gourmet y ensaladas.",
  },
  {
    id: 7, name: "Pack Aceite + Aceto 250ml", volume: "Pack regalo 250ml",
    price: "$7.990", numericPrice: 7990, badge: null, image: "/images/7.jpeg",
    description: "Pack premium aceite extra virgen + aceto balsámico 250ml. El regalo perfecto.",
  },
  {
    id: 8, name: "Aceite Extra Virgen Botella 500ml", volume: "Botella vidrio 500ml",
    price: "$8.990", numericPrice: 8990, badge: null, image: "/images/8.png",
    description: "Botella vidrio 500ml. Cosecha selectiva, extracción en frío. Acidez máxima 0.3%.",
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

function ProductCard({ product, delay, onAddToCart, onDetail }) {
  const ref = useRef(null);
  const visible = useVisible(ref);
  const [qty, setQty] = useState(1);

  return (
    <div ref={ref} className={`ps-card${visible ? " visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {product.badge && <span className="ps-badge">{product.badge}</span>}
      <div className="ps-card-img-wrap" onClick={() => onDetail && onDetail(product)} style={{ cursor: "pointer" }}>
        <img src={product.image} alt={`${product.name} ${product.volume}`} className="ps-card-img" loading="lazy" />
      </div>
      <div className="ps-card-body">
        <p className="ps-card-volume">{product.volume}</p>
        <h3 className="ps-card-name" onClick={() => onDetail && onDetail(product)} style={{ cursor: "pointer" }}>
          {product.name}
        </h3>
        <p className="ps-card-desc">{product.description}</p>
        <span className="ps-card-price">{product.price}</span>
        <div className="ps-card-qty">
          <button className="ps-qty-btn" onClick={(e) => { e.stopPropagation(); setQty(q => Math.max(1, q - 1)); }} disabled={qty <= 1} aria-label="Restar">−</button>
          <span className="ps-qty-num">{qty}</span>
          <button className="ps-qty-btn" onClick={(e) => { e.stopPropagation(); setQty(q => q + 1); }} aria-label="Sumar">+</button>
        </div>
        <button className="ps-card-btn" onClick={(e) => { e.stopPropagation(); onAddToCart(product.id, qty); }}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default function ProductsShowcase({ onAddToCart, onDetail, onViewAll }) {
  const kickerRef = useRef(null);
  const headerRef = useRef(null);
  const lineRef = useRef(null);
  const diamondsRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const kickerVisible = useVisible(kickerRef);
  const headerVisible = useVisible(headerRef);
  const lineVisible = useVisible(lineRef);
  const diamondsVisible = useVisible(diamondsRef);
  const subVisible = useVisible(subRef);
  const ctaVisible = useVisible(ctaRef);

  return (
    <>
      <style>{styles}</style>
      <section className="ps-root" aria-label="Nuestros productos">
        <div className="ps-header">
          <p ref={kickerRef} className={`ps-kicker${kickerVisible ? " visible" : ""}`}>Tienda Essenza</p>
          <h2 ref={headerRef} className={`ps-headline${headerVisible ? " visible" : ""}`}>Lleva Essenza a tu cocina</h2>
          <div ref={lineRef} className={`ps-gold-line${lineVisible ? " visible" : ""}`} />
          <div ref={diamondsRef} className={`ps-diamonds${diamondsVisible ? " visible" : ""}`}>
            <span>◆</span><span>◆</span><span>◆</span>
          </div>
          <p ref={subRef} className={`ps-sub${subVisible ? " visible" : ""}`}>
            100% chileno · Prensado en frío · Máximo 0.3% acidez
          </p>
        </div>

        <div className="ps-track-wrap">
          <div className="ps-track">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 80} onAddToCart={onAddToCart} onDetail={onDetail} />
            ))}
          </div>
        </div>

        <div ref={ctaRef} className={`ps-cta-wrap${ctaVisible ? " visible" : ""}`}>
          <button className="ps-cta-btn" onClick={onViewAll}>Ver tienda completa</button>
        </div>
      </section>
    </>
  );
}
