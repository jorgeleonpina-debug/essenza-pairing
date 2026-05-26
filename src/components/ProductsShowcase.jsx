import { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

  :root {
    --es-negro:    #0A0A0A;
    --es-negro2:   #0F130F;
    --es-verde:    #0D2014;
    --es-verde2:   #122918;
    --es-verde3:   #1A3820;
    --es-borde:    #1C2E1E;
    --es-oro:      #C9A84C;
    --es-oro2:     #E8C46A;
    --es-oro-dim:  #7A6530;
    --es-crema:    #F5F0E8;
    --es-muted:    rgba(245,240,232,0.45);
    --es-serif:    'Cormorant Garamond', Georgia, serif;
  }

  .ps-root {
    background: var(--es-negro);
    padding: 0 0 80px;
    position: relative;
    overflow: hidden;
  }

  .ps-root::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--es-oro-dim) 30%, var(--es-oro) 50%, var(--es-oro-dim) 70%, transparent 100%);
  }

  /* ── HEADER ── */
  .ps-header {
    background: var(--es-negro2);
    border-bottom: 0.5px solid var(--es-borde);
    padding: 64px 48px 48px;
    text-align: center;
    position: relative;
  }

  .ps-kicker {
    font-size: 10px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--es-oro);
    margin-bottom: 18px;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .ps-kicker.visible { opacity: 1; transform: translateY(0); }

  .ps-headline {
    font-family: var(--es-serif);
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 300;
    line-height: 1.05;
    color: var(--es-crema);
    margin-bottom: 16px;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
  }
  .ps-headline em { font-style: italic; color: var(--es-oro); }
  .ps-headline.visible { opacity: 1; transform: translateY(0); }

  .ps-gold-line {
    width: 48px; height: 1px;
    background: var(--es-oro);
    margin: 0 auto 20px;
    opacity: 0;
    transition: opacity 0.6s ease 0.2s, width 0.6s ease 0.2s;
  }
  .ps-gold-line.visible { opacity: 1; }

  .ps-sub {
    font-size: 13px;
    letter-spacing: 0.5px;
    line-height: 1.8;
    color: var(--es-muted);
    max-width: 480px;
    margin: 0 auto;
    opacity: 0;
    transition: opacity 0.7s ease 0.3s;
  }
  .ps-sub.visible { opacity: 1; }

  /* ── TRUST BAR ── */
  .ps-trust {
    background: var(--es-verde);
    border-top: 0.5px solid var(--es-borde);
    border-bottom: 0.5px solid var(--es-borde);
    padding: 14px 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
    flex-wrap: wrap;
  }
  .ps-trust-item {
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--es-muted);
    padding: 0 24px;
    border-right: 0.5px solid var(--es-borde);
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .ps-trust-item:last-child { border-right: none; }
  .ps-trust-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--es-oro);
    opacity: 0.6;
    flex-shrink: 0;
  }

  /* ── GRID ── */
  .ps-grid-wrap {
    padding: 40px 32px 0;
  }

  .ps-grid-label {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--es-oro-dim);
    margin-bottom: 24px;
  }

  .ps-track {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 0.5px solid var(--es-borde);
  }

  @media (max-width: 1100px) {
    .ps-track { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 580px) {
    .ps-track { grid-template-columns: 1fr; }
    .ps-grid-wrap { padding: 32px 16px 0; }
    .ps-header { padding: 48px 24px 36px; }
  }

  /* ── CARD ── */
  .ps-card {
    background: var(--es-negro2);
    border-right: 0.5px solid var(--es-borde);
    border-bottom: 0.5px solid var(--es-borde);
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.6s ease, transform 0.6s ease, background 0.2s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .ps-card:nth-child(4n) { border-right: none; }
  @media (max-width: 1100px) {
    .ps-card:nth-child(2n) { border-right: none; }
    .ps-card:nth-child(4n) { border-right: 0.5px solid var(--es-borde); }
  }
  @media (max-width: 580px) {
    .ps-card { border-right: none !important; }
  }

  .ps-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--es-oro), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .ps-card:hover { background: var(--es-verde2); }
  .ps-card:hover::after { opacity: 1; }
  .ps-card.visible { opacity: 1; transform: translateY(0); }

  /* ── CARD IMAGE ── */
  .ps-card-img-wrap {
    aspect-ratio: 1 / 1;
    background: var(--es-verde);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 0.5px solid var(--es-borde);
    overflow: hidden;
  }

  .ps-card-img-wrap::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%);
  }

  .ps-card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 24px;
    position: relative;
    z-index: 1;
  }

  /* placeholder elegante cuando no hay imagen */
  .ps-img-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .ps-placeholder-label {
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--es-verde3);
  }

  /* ── BADGE ── */
  .ps-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 2;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 11px;
    font-weight: 500;
  }
  .ps-badge-oferta {
    background: var(--es-oro);
    color: var(--es-negro);
  }
  .ps-badge-vendido {
    background: transparent;
    border: 0.5px solid var(--es-oro);
    color: var(--es-oro);
  }

  /* ── CARD BODY ── */
  .ps-card-body {
    padding: 20px 20px 22px;
  }

  .ps-card-varietal {
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--es-oro-dim);
    margin-bottom: 7px;
  }

  .ps-card-name {
    font-family: var(--es-serif);
    font-size: 20px;
    font-weight: 300;
    color: var(--es-crema);
    line-height: 1.2;
    margin-bottom: 6px;
  }

  .ps-card-desc {
    font-size: 12px;
    color: var(--es-muted);
    line-height: 1.65;
    margin-bottom: 18px;
    min-height: 38px;
  }

  .ps-card-footer {
    border-top: 0.5px solid var(--es-borde);
    padding-top: 16px;
  }

  .ps-card-price-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .ps-card-price {
    font-family: var(--es-serif);
    font-size: 26px;
    font-weight: 300;
    color: var(--es-oro);
    line-height: 1;
  }

  .ps-card-unit {
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--es-muted);
  }

  /* ── QTY ── */
  .ps-card-qty {
    display: flex;
    align-items: center;
    gap: 0;
    border: 0.5px solid var(--es-borde);
    width: fit-content;
    margin-bottom: 12px;
  }
  .ps-qty-btn {
    background: transparent;
    border: none;
    color: var(--es-oro);
    width: 32px;
    height: 32px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--es-serif);
  }
  .ps-qty-btn:hover { background: var(--es-verde3); }
  .ps-qty-num {
    font-size: 13px;
    color: var(--es-crema);
    width: 32px;
    text-align: center;
    font-weight: 500;
    border-left: 0.5px solid var(--es-borde);
    border-right: 0.5px solid var(--es-borde);
    height: 32px;
    line-height: 32px;
  }

  /* ── BUTTONS ── */
  .ps-card-btn {
    width: 100%;
    padding: 11px 0;
    background: var(--es-oro);
    color: var(--es-negro);
    border: none;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    transition: background 0.2s ease;
  }
  .ps-card-btn:hover { background: var(--es-oro2); }

  .ps-card-detail-btn {
    width: 100%;
    padding: 9px 0;
    background: transparent;
    color: var(--es-muted);
    border: 0.5px solid var(--es-borde);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
    margin-top: 7px;
    transition: color 0.2s, border-color 0.2s;
  }
  .ps-card-detail-btn:hover {
    color: var(--es-oro);
    border-color: var(--es-oro-dim);
  }

  /* ── ENVÍOS ── */
  .ps-envios {
    margin: 40px 32px 0;
    border: 0.5px solid var(--es-borde);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 700px) {
    .ps-envios { grid-template-columns: 1fr; margin: 32px 16px 0; }
  }
  .ps-envio-item {
    padding: 22px 24px;
    border-right: 0.5px solid var(--es-borde);
    background: var(--es-negro2);
  }
  .ps-envio-item:last-child { border-right: none; }
  .ps-envio-region {
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--es-muted);
    margin-bottom: 8px;
  }
  .ps-envio-precio {
    font-family: var(--es-serif);
    font-size: 24px;
    font-weight: 300;
    color: var(--es-oro);
    margin-bottom: 4px;
  }
  .ps-envio-desc {
    font-size: 11px;
    color: var(--es-verde3);
  }

  /* ── CTA ── */
  .ps-cta-wrap {
    text-align: center;
    padding: 56px 32px 0;
  }
  .ps-cta-btn {
    background: transparent;
    border: 0.5px solid rgba(201,168,76,0.4);
    color: var(--es-oro);
    padding: 15px 48px;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s, border-color 0.2s;
  }
  .ps-cta-btn:hover {
    background: rgba(201,168,76,0.08);
    border-color: var(--es-oro);
  }
`;

const PRODUCTS = [
  {
    id: 1,
    name: "Bidón Extra Virgen 5L",
    varietal: "Extra Virgen · 5 Litros",
    desc: "Formato familiar ideal para uso diario. Extracción en frío, acidez máxima 0.3%.",
    price: 49990,
    badge: null,
    image: null,
  },
  {
    id: 2,
    name: "Pack 2 Bidones 5L",
    varietal: "Pack · 10 Litros",
    desc: "Ahorro garantizado para el hogar. Dos bidones de extracción en frío.",
    price: 81990,
    badge: null,
    image: null,
  },
  {
    id: 3,
    name: "Pack 3 Bidones 5L",
    varietal: "Pack · 15 Litros",
    desc: "Ideal para familias grandes o para regalar. Envío con seguro incluido.",
    price: 109990,
    badge: null,
    image: null,
  },
  {
    id: 4,
    name: "Pack 4 Bidones 5L",
    varietal: "Pack · 20 Litros",
    desc: "El mejor precio por litro de toda la colección. Formato restaurante.",
    price: 174990,
    badge: "Oferta",
    image: null,
  },
  {
    id: 5,
    name: "Botella Extra Virgen 1L",
    varietal: "Extra Virgen · 1 Litro",
    desc: "El preferido de nuestros clientes. Ideal para ensaladas y cocina gourmet.",
    price: 14990,
    badge: "Más Vendido",
    image: null,
  },
  {
    id: 6,
    name: "Pack 6 Botellas 1L",
    varietal: "Pack · 6 Litros",
    desc: "Perfecto para regalar o abastecer la despensa con el mejor aceite.",
    price: 74990,
    badge: null,
    image: null,
  },
  {
    id: 7,
    name: "Pack Aceite + Aceto 250ml",
    varietal: "Gourmet · Pack Dúo",
    desc: "Maridaje perfecto: aceite extra virgen y aceto balsámico premium.",
    price: 7990,
    badge: null,
    image: null,
  },
  {
    id: 8,
    name: "Botella Extra Virgen 500ml",
    varietal: "Extra Virgen · 500ml",
    desc: "Tamaño práctico para descubrir Essenza. El regalo perfecto.",
    price: 8990,
    badge: null,
    image: null,
  },
];

function useVisible(ref, threshold = 0.18) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* Botella SVG placeholder */
function BottlePlaceholder({ size = 56 }) {
  return (
    <svg width={size} height={Math.round(size * 2.6)} viewBox="0 0 56 148" fill="none" aria-hidden="true">
      <rect x="20" y="4" width="16" height="14" rx="2" fill="#C9A84C" opacity="0.5"/>
      <path
        d="M17 28 Q12 48 11 72 L11 128 Q11 140 22 140 L34 140 Q45 140 45 128 L45 72 Q44 48 39 28 Z"
        fill="#0D2014"
        stroke="#C9A84C"
        strokeWidth="0.7"
      />
      <path
        d="M17 28 L39 28 L43 42 L13 42 Z"
        fill="#0D2014"
        stroke="#C9A84C"
        strokeWidth="0.5"
        opacity="0.7"
      />
      <rect x="16" y="62" width="24" height="32" rx="1" fill="#091510" stroke="#C9A84C" strokeWidth="0.4" opacity="0.8"/>
      <text x="28" y="75" textAnchor="middle" fill="#C9A84C" fontSize="4.5" letterSpacing="2" fontFamily="Georgia,serif" opacity="0.9">ESSENZA</text>
      <text x="28" y="84" textAnchor="middle" fill="#7A6530" fontSize="3.5" letterSpacing="1" fontFamily="sans-serif">EXTRA VIRGEN</text>
      <text x="28" y="90" textAnchor="middle" fill="#7A6530" fontSize="3.5" letterSpacing="1" fontFamily="sans-serif">CHILE</text>
    </svg>
  );
}

function ProductCard({ product, onAddToCart, onDetail, animDelay }) {
  const [qty, setQty] = useState(1);
  const ref = useRef(null);
  const visible = useVisible(ref, 0.1);

  const fmtPrice = (n) =>
    "$" + n.toLocaleString("es-CL");

  return (
    <div
      ref={ref}
      className={`ps-card${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${animDelay}ms` }}
    >
      <div className="ps-card-img-wrap">
        {product.badge && (
          <span className={`ps-badge ${product.badge === "Oferta" ? "ps-badge-oferta" : "ps-badge-vendido"}`}>
            {product.badge}
          </span>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="ps-card-img"
          />
        ) : (
          <div className="ps-img-placeholder">
            <BottlePlaceholder size={52} />
            <span className="ps-placeholder-label">foto del producto</span>
          </div>
        )}
      </div>

      <div className="ps-card-body">
        <div className="ps-card-varietal">{product.varietal}</div>
        <div className="ps-card-name">{product.name}</div>
        <div className="ps-card-desc">{product.desc}</div>

        <div className="ps-card-footer">
          <div className="ps-card-price-row">
            <div className="ps-card-price">{fmtPrice(product.price)}</div>
            <div className="ps-card-unit">/ unidad</div>
          </div>

          <div className="ps-card-qty">
            <button
              className="ps-qty-btn"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Disminuir cantidad"
            >−</button>
            <div className="ps-qty-num">{qty}</div>
            <button
              className="ps-qty-btn"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Aumentar cantidad"
            >+</button>
          </div>

          <button
            className="ps-card-btn"
            onClick={() => onAddToCart && onAddToCart(product.id, qty)}
          >
            Agregar al carro
          </button>
          <button
            className="ps-card-detail-btn"
            onClick={() => onDetail && onDetail(product)}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsShowcase({ onAddToCart, onDetail, onViewAll }) {
  const headerRef = useRef(null);
  const headerVisible = useVisible(headerRef, 0.2);

  return (
    <section className="ps-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="ps-header" ref={headerRef}>
        <div className={`ps-kicker${headerVisible ? " visible" : ""}`}>
          Colección · Cosecha 2024
        </div>
        <h2 className={`ps-headline${headerVisible ? " visible" : ""}`}>
          Aceite de oliva<br /><em>extra virgen</em>
        </h2>
        <div className={`ps-gold-line${headerVisible ? " visible" : ""}`} />
        <p className={`ps-sub${headerVisible ? " visible" : ""}`}>
          Extracción en frío · Valle Central de Chile · Directo del productor
        </p>
      </div>

      {/* TRUST BAR */}
      <div className="ps-trust">
        <div className="ps-trust-item">
          <span className="ps-trust-dot" />
          Acidez 0.3%
        </div>
        <div className="ps-trust-item">
          <span className="ps-trust-dot" />
          Extracción en frío
        </div>
        <div className="ps-trust-item">
          <span className="ps-trust-dot" />
          Valle Central Chile
        </div>
        <div className="ps-trust-item">
          <span className="ps-trust-dot" />
          Pago seguro
        </div>
        <div className="ps-trust-item">
          <span className="ps-trust-dot" />
          Despacho a todo Chile
        </div>
      </div>

      {/* GRID */}
      <div className="ps-grid-wrap">
        <div className="ps-grid-label">
          {PRODUCTS.length} productos disponibles
        </div>
        <div className="ps-track">
          {PRODUCTS.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onDetail={onDetail}
              animDelay={i * 60}
            />
          ))}
        </div>
      </div>

      {/* ENVÍOS */}
      <div className="ps-envios">
        <div className="ps-envio-item">
          <div className="ps-envio-region">Región Metropolitana</div>
          <div className="ps-envio-precio">$3.990</div>
          <div className="ps-envio-desc">2 a 4 días hábiles</div>
        </div>
        <div className="ps-envio-item">
          <div className="ps-envio-region">Resto del país</div>
          <div className="ps-envio-precio">$5.990</div>
          <div className="ps-envio-desc">4 a 7 días hábiles</div>
        </div>
        <div className="ps-envio-item">
          <div className="ps-envio-region">Zonas extremas</div>
          <div className="ps-envio-precio">$7.990</div>
          <div className="ps-envio-desc">7 a 12 días hábiles</div>
        </div>
      </div>

      {/* CTA */}
      {onViewAll && (
        <div className="ps-cta-wrap">
          <button className="ps-cta-btn" onClick={onViewAll}>
            Ver toda la colección
          </button>
        </div>
      )}
    </section>
  );
}
