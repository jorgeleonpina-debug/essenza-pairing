import { useState, useRef, useEffect } from "react";

const COLORS = {
  darkGreen: "#2d4a1e",
  gold: "#c9a84c",
  black: "#111111",
  cream: "#f5f0e8",
  darkGreenLight: "#3d6229",
  goldLight: "#e8c46a",
};

const SYSTEM_PROMPT = `Eres el sommelier de aceite de oliva extra virgen de Essenza Chile, una marca premium de aceite de oliva 100% chileno, prensado en frío, con máximo 0.3% de acidez.

Tu rol es responder ÚNICAMENTE en JSON válido, sin texto adicional, sin markdown, sin explicaciones fuera del JSON.

Cuando el usuario describa un plato o ingredientes, responde con este JSON exacto:
{
  "compatibilidad": 92,
  "titulo": "Carpaccio de Res con Rúcula",
  "momento": "En crudo, al final",
  "descripcion": "Una descripción gourmet de 2-3 oraciones sobre por qué Essenza es ideal para este plato, mencionando sus notas organolépticas (frutado, picante suave, herbáceo) y su origen chileno.",
  "tecnica": "Instrucción concreta y elegante de cómo aplicar Essenza en este plato.",
  "maridaje": "Sugerencia de un vino chileno u otro elemento que complemente tanto el plato como el aceite.",
  "consejo_chef": "Un tip de chef de alto nivel, íntimamente relacionado con Essenza y el plato.",
  "emoji_plato": "🥩"
}

Reglas:
- compatibilidad: número entre 70 y 99
- Tono: refinado, apasionado, experto en gastronomía de autor
- Siempre mencionar el origen chileno de Essenza de forma orgánica
- Si el usuario escribe algo que no es un plato o ingrediente, responde con {"error": "Describe un plato o ingrediente para continuar."}`;

const PRODUCTS = [
  { id: 1, name: "Aceite Extra Virgen", volume: "250ml",                    price: "$2.490",  badge: null,              image: "/images/bottle-250ml.jpeg" },
  { id: 2, name: "Aceite Extra Virgen", volume: "1L",                       price: "$14.990", badge: "Más vendido",     image: "/images/bottle-1l.jpeg" },
  { id: 3, name: "Bidón Extra Virgen",  volume: "5L",                       price: "$32.990", badge: null,              image: "/images/bidon-5l.jpeg" },
  { id: 4, name: "Pack Completo",       volume: "Aceite + Aceto Balsámico", price: "$47.990", badge: "Oferta especial", image: "/images/pack-completo.jpeg" },
];

const NAV_TABS = [
  { id: "inicio",         label: "Inicio" },
  { id: "tienda",         label: "Tienda" },
  { id: "quienes-somos",  label: "Quiénes Somos" },
  { id: "contacto",       label: "Contacto" },
];

const SOCIAL_LINKS = [
  { label: "Instagram",  href: "https://instagram.com/essenzaolive",      icon: "instagram" },
  { label: "Facebook",   href: "https://facebook.com/essenzaolive",       icon: "facebook" },
  { label: "WhatsApp",   href: "https://wa.me/+56965902996",              icon: "whatsapp" },
  { label: "Email",      href: "mailto:contacto@premiumolivechile.com",   icon: "email" },
];

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconInstagram = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
);

const IconFacebook = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const IconWhatsApp = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const IconEmail = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ICON_MAP = { instagram: IconInstagram, facebook: IconFacebook, whatsapp: IconWhatsApp, email: IconEmail };

// ── Small components ───────────────────────────────────────────────────────────
const LoadingDots = () => (
  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.gold, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
    ))}
  </span>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: "0.35em", color: COLORS.gold, textTransform: "uppercase", marginBottom: 10, opacity: 0.8 }}>
    {children}
  </div>
);

const Divider = () => (
  <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", marginBottom: 60 }} />
);

// ── Logo ───────────────────────────────────────────────────────────────────────
const Logo = ({ size = 72 }) => {
  const [error, setError] = useState(false);
  return (
    <div style={{ background: `linear-gradient(135deg, ${COLORS.darkGreen}, rgba(45,74,30,0.6))`, border: "1px solid rgba(201,168,76,0.4)", borderRadius: "50%", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
      {!error
        ? <img src="/images/logo.jpeg" alt="Essenza Chile" onError={() => setError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: size * 0.44 }}>🫒</span>}
    </div>
  );
};

// ── NavBar ─────────────────────────────────────────────────────────────────────
const NavBar = ({ active, onNav }) => (
  <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(17,17,17,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.12)", display: "flex", justifyContent: "center", gap: 0 }}>
    {NAV_TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onNav(tab.id)}
        style={{
          background: "transparent",
          border: "none",
          borderBottom: active === tab.id ? `2px solid ${COLORS.gold}` : "2px solid transparent",
          color: active === tab.id ? COLORS.gold : "rgba(245,240,232,0.45)",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "16px 20px 14px",
          cursor: "pointer",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => { if (active !== tab.id) e.currentTarget.style.color = "rgba(245,240,232,0.75)"; }}
        onMouseLeave={(e) => { if (active !== tab.id) e.currentTarget.style.color = "rgba(245,240,232,0.45)"; }}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

// ── CompatibilityMeter ─────────────────────────────────────────────────────────
const CompatibilityMeter = ({ value }) => {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => { start += 2; if (start <= value) { setDisplayed(start); requestAnimationFrame(step); } else { setDisplayed(value); } };
    requestAnimationFrame(step);
  }, [value]);
  const color = displayed >= 90 ? COLORS.goldLight : displayed >= 80 ? COLORS.gold : "#a07a2e";
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase" }}>Afinidad con Essenza</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{displayed}<span style={{ fontSize: 16, opacity: 0.7 }}>%</span></span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${displayed}%`, background: "linear-gradient(90deg,#3d6229,#c9a84c)", borderRadius: 2, transition: "width 0.05s linear" }} />
      </div>
    </div>
  );
};

// ── ResultCard ─────────────────────────────────────────────────────────────────
const ResultCard = ({ data }) => {
  const items = [
    { label: "Momento de uso",   value: data.momento,      icon: "⏱️" },
    { label: "Técnica",          value: data.tecnica,       icon: "🫒" },
    { label: "Maridaje sugerido",value: data.maridaje,      icon: "🍷" },
    { label: "Consejo del chef", value: data.consejo_chef,  icon: "👨‍🍳" },
  ];
  return (
    <div style={{ animation: "fadeUp 0.6s ease forwards", background: "rgba(45,74,30,0.25)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 16, padding: "32px 28px", marginTop: 24 }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{data.emoji_plato}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: "0.02em" }}>{data.titulo}</h2>
      </div>
      <CompatibilityMeter value={data.compatibilidad} />
      <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.85)", fontSize: 15, lineHeight: 1.8, marginBottom: 24, fontStyle: "italic", borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16 }}>{data.descripcion}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item) => (
          <div key={item.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</span>
            </div>
            <p style={{ fontFamily: "'Lora', serif", color: COLORS.cream, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.value}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, textAlign: "center", paddingTop: 20, borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(201,168,76,0.6)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>Essenza Chile · Extra Virgen · Prensado en Frío</p>
      </div>
    </div>
  );
};

// ── Product components ─────────────────────────────────────────────────────────
const ProductImage = ({ src, alt }) => {
  const [error, setError] = useState(false);
  return (
    <div style={{ width: 90, height: 90, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {!error
        ? <img src={src} alt={alt} onError={() => setError(true)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        : <span style={{ fontSize: 36 }}>🫒</span>}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [buying, setBuying] = useState(false);

  const handleComprar = async () => {
    if (buying) return;
    setBuying(true);
    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (data.init_point) { window.location.href = data.init_point; }
      else { setBuying(false); }
    } catch { setBuying(false); }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", background: hovered ? "rgba(45,74,30,0.35)" : "rgba(45,74,30,0.18)", border: `1px solid ${hovered ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.2)"}`, borderRadius: 14, padding: "28px 20px 22px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", transition: "all 0.3s ease" }}
    >
      {product.badge && (
        <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: COLORS.gold, color: COLORS.black, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap", fontFamily: "'Cormorant Garamond', serif" }}>
          {product.badge}
        </div>
      )}
      <ProductImage src={product.image} alt={product.name} />
      <div style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 17, fontWeight: 600, marginBottom: 4, lineHeight: 1.2 }}>{product.name}</div>
      <div style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.45)", fontSize: 13, fontStyle: "italic", marginBottom: 18 }}>{product.volume}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.goldLight, fontSize: 26, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}>{product.price}</div>
      <button
        onClick={handleComprar}
        disabled={buying}
        style={{ background: buying ? "rgba(45,74,30,0.3)" : `linear-gradient(135deg, ${COLORS.darkGreen}, ${COLORS.darkGreenLight})`, border: `1px solid ${buying ? "rgba(201,168,76,0.25)" : COLORS.gold}`, borderRadius: 8, color: buying ? "rgba(201,168,76,0.35)" : COLORS.gold, fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 0", cursor: buying ? "default" : "pointer", width: "100%", transition: "all 0.25s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        {buying ? <><LoadingDots /><span>Redirigiendo...</span></> : "Comprar"}
      </button>
    </div>
  );
};

// ── Section: Quiénes Somos ─────────────────────────────────────────────────────
const QuienesSomos = () => (
  <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <SectionLabel>Nuestra Historia</SectionLabel>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>Quiénes Somos</h2>
    </div>
    <div style={{ background: "rgba(45,74,30,0.15)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 16, padding: "40px 36px", marginBottom: 28 }}>
      <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.85)", fontSize: 16, lineHeight: 1.9, margin: 0, fontStyle: "italic" }}>
        Essenza Chile nace en el corazón agrícola del Valle Central, donde el clima mediterráneo y la tierra generosa se unen para producir uno de los mejores aceites de oliva virgen extra del mundo. Nuestra marca representa la elegancia, el origen y el compromiso con la excelencia.
      </p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {[
        {
          title: "Visión",
          text: "Ser embajadores del aceite de oliva chileno en el mundo, promoviendo calidad, trazabilidad y sabor natural.",
          icon: "🌍",
        },
        {
          title: "Misión",
          text: "Producir, envasar, comercializar y exportar un aceite de oliva virgen extra de alta gama, respetando el medioambiente y las tradiciones olivícolas.",
          icon: "🫒",
        },
      ].map((item) => (
        <div key={item.title} style={{ background: "rgba(45,74,30,0.2)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 14, padding: "28px 24px" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 20, fontWeight: 600, margin: "0 0 12px", letterSpacing: "0.05em" }}>{item.title}</h3>
          <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.7)", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{item.text}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Section: Contacto ──────────────────────────────────────────────────────────
const Contacto = () => (
  <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <SectionLabel>Escríbenos</SectionLabel>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>Contacto</h2>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {SOCIAL_LINKS.map((link) => {
        const Icon = ICON_MAP[link.icon];
        return (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(45,74,30,0.2)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: "18px 22px", color: COLORS.gold, textDecoration: "none", transition: "all 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(45,74,30,0.35)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(45,74,30,0.2)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; }}
          >
            <span style={{ color: COLORS.gold, flexShrink: 0 }}><Icon size={22} /></span>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: 3 }}>{link.label}</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 14, color: COLORS.cream }}>
                {link.href.replace("https://", "").replace("mailto:", "").replace("wa.me/", "wa.me/")}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  </div>
);

// ── Footer ─────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(201,168,76,0.1)", marginTop: 80, padding: "40px 24px" }}>
    <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", gap: 24 }}>
        {SOCIAL_LINKS.map((link) => {
          const Icon = ICON_MAP[link.icon];
          return (
            <a key={link.label} href={link.href} target={link.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
              aria-label={link.label}
              style={{ color: "rgba(201,168,76,0.5)", transition: "color 0.2s ease", display: "flex" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.gold; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(201,168,76,0.5)"; }}
            >
              <Icon size={20} />
            </a>
          );
        })}
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,240,232,0.2)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, textAlign: "center" }}>
        © 2025 Essenza Chile · Premium Olive Chile SPA
      </p>
    </div>
  </footer>
);

// ── Main ───────────────────────────────────────────────────────────────────────
export default function EssenzaPairingAI() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("inicio");
  const textareaRef = useRef(null);
  const sectionsRef = useRef({});

  const scrollToSection = (id) => {
    setActiveTab(id);
    sectionsRef.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.dataset.section);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.values(sectionsRef.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const suggestions = ["Pulpo a la gallega", "Ensalada caprese", "Lomo de merluza al horno", "Pasta al pesto", "Pan artesanal tostado", "Ceviche chileno"];

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: SYSTEM_PROMPT, messages: [{ role: "user", content: input }] }),
      });
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.error) setError(parsed.error);
      else setResult(parsed);
    } catch { setError("Algo salió mal. Por favor intenta de nuevo."); }
    finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.black}; }
        @keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.2); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        textarea:focus { outline: none; }
        textarea::placeholder { color: rgba(245,240,232,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }
        @media (max-width: 480px) { .qs-grid { grid-template-columns: 1fr !important; } .nav-label { display: none; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 0%, rgba(45,74,30,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(201,168,76,0.08) 0%, transparent 50%), ${COLORS.black}`, fontFamily: "'Cormorant Garamond', serif" }}>

        {/* ── Header ── */}
        <header style={{ textAlign: "center", padding: "52px 24px 36px", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
          <div style={{ margin: "0 auto 20px" }}>
            <Logo size={80} />
          </div>
          <SectionLabel>Essenza Chile</SectionLabel>
          <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.1, marginBottom: 12, background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.goldLight} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Pairing AI
          </h1>
          <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.5)", fontSize: 15, fontStyle: "italic", maxWidth: 320, margin: "0 auto", lineHeight: 1.6 }}>
            Descubre cómo nuestro aceite extra virgen chileno eleva cada plato
          </p>
        </header>

        {/* ── Nav ── */}
        <NavBar active={activeTab} onNav={scrollToSection} />

        {/* ── Section: Inicio ── */}
        <section ref={(el) => { sectionsRef.current["inicio"] = el; }} data-section="inicio" style={{ padding: "60px 0 80px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>
            <div style={{ background: "rgba(45,74,30,0.15)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, letterSpacing: "0.25em", color: COLORS.gold, textTransform: "uppercase", marginBottom: 12, opacity: 0.9 }}>¿Qué vas a preparar?</label>
              <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Escribe un plato o ingredientes..." rows={3}
                style={{ width: "100%", background: "transparent", border: "none", color: COLORS.cream, fontFamily: "'Lora', serif", fontSize: 16, lineHeight: 1.7, resize: "none" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <button onClick={handleSubmit} disabled={!input.trim() || loading}
                  style={{ background: input.trim() && !loading ? `linear-gradient(135deg, ${COLORS.darkGreen}, ${COLORS.darkGreenLight})` : "rgba(255,255,255,0.05)", border: `1px solid ${input.trim() && !loading ? COLORS.gold : "rgba(255,255,255,0.1)"}`, borderRadius: 8, color: input.trim() && !loading ? COLORS.gold : "rgba(255,255,255,0.2)", fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 22px", cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: 10 }}>
                  {loading ? <><span>Analizando</span><LoadingDots /></> : "Descubrir maridaje"}
                </button>
              </div>
            </div>
            {!result && !loading && (
              <div style={{ marginBottom: 8 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(201,168,76,0.4)", textTransform: "uppercase", marginBottom: 10 }}>Sugerencias</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => setInput(s)}
                      style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, color: "rgba(245,240,232,0.5)", fontFamily: "'Lora', serif", fontSize: 13, padding: "6px 14px", cursor: "pointer", fontStyle: "italic", transition: "all 0.2s ease" }}
                      onMouseEnter={(e) => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; e.target.style.color = COLORS.cream; }}
                      onMouseLeave={(e) => { e.target.style.borderColor = "rgba(201,168,76,0.2)"; e.target.style.color = "rgba(245,240,232,0.5)"; }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {error && <div style={{ background: "rgba(180,50,50,0.15)", border: "1px solid rgba(180,50,50,0.3)", borderRadius: 10, padding: "14px 18px", marginTop: 16, color: "#f87171", fontFamily: "'Lora', serif", fontSize: 14, fontStyle: "italic" }}>{error}</div>}
            {result && <ResultCard data={result} />}
            {result && (
              <button onClick={() => { setResult(null); setInput(""); setError(null); }}
                style={{ display: "block", margin: "20px auto 0", background: "transparent", border: "none", color: "rgba(201,168,76,0.4)", fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", padding: "8px 16px" }}>
                ← Nuevo maridaje
              </button>
            )}
          </div>
        </section>

        {/* ── Section: Tienda ── */}
        <section ref={(el) => { sectionsRef.current["tienda"] = el; }} data-section="tienda" style={{ padding: "0 0 80px" }}>
          <Divider />
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <SectionLabel>Nuestra Tienda</SectionLabel>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 36, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.1 }}>Lleva Essenza a tu cocina</h2>
              <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.4)", fontSize: 14, fontStyle: "italic", margin: 0 }}>100% chileno · Prensado en frío · Máximo 0.3% acidez</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
              {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ textAlign: "center", marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.3)", fontSize: 12, fontStyle: "italic" }}>Pago seguro con</span>
              <span style={{ color: "#009ee3", fontWeight: 700, fontSize: 12, opacity: 0.7 }}>Mercado Pago Chile</span>
            </div>
          </div>
        </section>

        {/* ── Section: Quiénes Somos ── */}
        <section ref={(el) => { sectionsRef.current["quienes-somos"] = el; }} data-section="quienes-somos" style={{ padding: "0 0 80px" }}>
          <Divider />
          <QuienesSomos />
        </section>

        {/* ── Section: Contacto ── */}
        <section ref={(el) => { sectionsRef.current["contacto"] = el; }} data-section="contacto" style={{ padding: "0 0 80px" }}>
          <Divider />
          <Contacto />
        </section>

        <Footer />
      </div>
    </>
  );
}
