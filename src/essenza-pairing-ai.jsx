import { useState, useRef, useEffect } from "react";
import { trackEvent, trackLead, trackContact, serverEvent } from "./utils/metaPixel";
import { initCursor, initParallax, initScrollReveal, initTypeReveal } from "./utils/premiumEffects";
import HeroSection from "./components/HeroSection";
import BrandStory from "./components/BrandStory";
import ProductsShowcase from "./components/ProductsShowcase";
import Testimonials from "./components/Testimonials";
import WhatsAppButton from "./components/WhatsAppButton";

const COLORS = {
  darkGreen: "#2d4a1e",
  gold: "#c9a84c",
  black: "#111111",
  cream: "#f5f0e8",
  darkGreenLight: "#3d6229",
  goldLight: "#e8c46a",
};

const SYSTEM_PROMPT = `Eres el sommelier de aceite de oliva extra virgen de Essenza Chile, una marca premium de aceite de oliva 100% chileno, extracción en frío, con máximo 0.3% de acidez.

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

const REGIONS = [
  { id: "rm",          name: "Región Metropolitana",               shipping: 3990 },
  { id: "arica",       name: "Arica y Parinacota",                 shipping: 7990 },
  { id: "tarapaca",    name: "Tarapacá",                           shipping: 5990 },
  { id: "antofagasta", name: "Antofagasta",                        shipping: 5990 },
  { id: "atacama",     name: "Atacama",                            shipping: 5990 },
  { id: "coquimbo",    name: "Coquimbo",                           shipping: 5990 },
  { id: "valparaiso",  name: "Valparaíso",                         shipping: 5990 },
  { id: "ohiggins",    name: "O'Higgins",                          shipping: 5990 },
  { id: "maule",       name: "Maule",                              shipping: 5990 },
  { id: "nuble",       name: "Ñuble",                              shipping: 5990 },
  { id: "biobio",      name: "Biobío",                             shipping: 5990 },
  { id: "araucania",   name: "La Araucanía",                       shipping: 5990 },
  { id: "losrios",     name: "Los Ríos",                           shipping: 5990 },
  { id: "loslagos",    name: "Los Lagos",                          shipping: 5990 },
  { id: "aysen",       name: "Aysén",                              shipping: 7990 },
  { id: "magallanes",  name: "Magallanes y la Antártica Chilena",  shipping: 7990 },
];

const COMMUNES = {
  arica:       ["Arica", "Camarones", "General Lagos", "Putre"],
  tarapaca:    ["Alto Hospicio", "Camiña", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"],
  antofagasta: ["Antofagasta", "Calama", "María Elena", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"],
  atacama:     ["Alto del Carmen", "Caldera", "Chañaral", "Copiapó", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"],
  coquimbo:    ["Andacollo", "Canela", "Combarbalá", "Coquimbo", "Illapel", "La Higuera", "La Serena", "Los Vilos", "Monte Patria", "Ovalle", "Paiguano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña"],
  valparaiso:  ["Algarrobo", "Cabildo", "Calera", "Calle Larga", "Cartagena", "Casablanca", "Catemu", "Concón", "El Quisco", "El Tabo", "Hijuelas", "Isla de Pascua", "Juan Fernández", "La Cruz", "La Ligua", "Limache", "Llaillay", "Los Andes", "Nogales", "Olmué", "Panquehue", "Papudo", "Petorca", "Puchuncaví", "Putaendo", "Quillota", "Quilpué", "Quintero", "Rinconada", "San Antonio", "San Esteban", "San Felipe", "Santa María", "Santo Domingo", "Valparaíso", "Villa Alemana", "Viña del Mar", "Zapallar"],
  rm:          ["Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "Curacaví", "El Bosque", "El Monte", "Estación Central", "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor", "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago", "Talagante", "Tiltil", "Vitacura"],
  ohiggins:    ["Chépica", "Chimbarongo", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "La Estrella", "Las Cabras", "Litueche", "Lolol", "Machalí", "Malloa", "Marchihue", "Mostazal", "Nancagua", "Navidad", "Olivar", "Palmilla", "Paredones", "Peralillo", "Peumo", "Pichidegua", "Pichilemu", "Placilla", "Pumanque", "Quinta de Tilcoco", "Rancagua", "Rengo", "Requínoa", "San Fernando", "San Vicente", "Santa Cruz"],
  maule:       ["Cauquenes", "Chanco", "Colbún", "Constitución", "Curicó", "Curepto", "Empedrado", "Hualañé", "Licantén", "Linares", "Longaví", "Maule", "Molina", "Parral", "Pelarco", "Pelluhue", "Pencahue", "Rauco", "Retiro", "Río Claro", "Romeral", "Sagrada Familia", "San Clemente", "San Javier", "San Rafael", "Talca", "Teno", "Vichuquén", "Villa Alegre", "Yerbas Buenas"],
  nuble:       ["Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
  biobio:      ["Alto Biobío", "Antuco", "Arauco", "Cabrero", "Cañete", "Chiguayante", "Concepción", "Contulmo", "Coronel", "Curanilahue", "Florida", "Hualpén", "Hualqui", "Laja", "Lebu", "Los Álamos", "Los Ángeles", "Lota", "Mulchén", "Nacimiento", "Negrete", "Penco", "Quilaco", "Quilleco", "San Pedro de la Paz", "San Rosendo", "Santa Bárbara", "Santa Juana", "Talcahuano", "Tirúa", "Tomé", "Tucapel", "Yumbel"],
  araucania:   ["Angol", "Carahue", "Cholchol", "Collipulli", "Cunco", "Curacautín", "Curarrehue", "Ercilla", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Purén", "Renaico", "Saavedra", "Temuco", "Teodoro Schmidt", "Toltén", "Traiguén", "Victoria", "Vilcún", "Villarrica"],
  losrios:     ["Corral", "Futrono", "La Unión", "Lago Ranco", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Río Bueno", "Valdivia"],
  loslagos:    ["Ancud", "Calbuco", "Castro", "Chaitén", "Chonchi", "Cochamó", "Curaco de Vélez", "Dalcahue", "Fresia", "Frutillar", "Futaleufú", "Hualaihué", "Llanquihue", "Los Muermos", "Maullín", "Osorno", "Palena", "Puerto Montt", "Puerto Octay", "Puerto Varas", "Puqueldón", "Purranque", "Puyehue", "Queilén", "Quellón", "Quemchi", "Quinchao", "Río Negro", "San Juan de la Costa", "San Pablo"],
  aysen:       ["Aysén", "Chile Chico", "Cisnes", "Cochrane", "Coihaique", "Guaitecas", "Lago Verde", "O'Higgins", "Río Ibáñez", "Tortel"],
  magallanes:  ["Antártica", "Cabo de Hornos", "Laguna Blanca", "Natales", "Porvenir", "Primavera", "Punta Arenas", "Río Verde", "San Gregorio", "Timaukel", "Torres del Paine"],
};

const NAV_TABS = [
  { id: "inicio",        label: "Inicio" },
  { id: "tienda",        label: "Tienda" },
  { id: "quienes-somos", label: "Quiénes Somos" },
  { id: "contacto",      label: "Contacto" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/essenzaolive",    icon: "instagram" },
  { label: "Facebook",  href: "https://facebook.com/essenzaolive",     icon: "facebook" },
  { label: "WhatsApp",  href: "https://wa.me/+56965902996",            icon: "whatsapp" },
  { label: "Email",     href: "mailto:contacto@premiumolivechile.com", icon: "email" },
];

const formatCLP = (n) => `$${Number(n).toLocaleString("es-CL")}`;

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconInstagram = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/>
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
const IconCart = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const IconUser = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMinus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconPlus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconTrash = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
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

// ── NavBar ─────────────────────────────────────────────────────────────────────
const NavBar = ({ active, onNav, user, onLogin, onLogout, cartCount, onOpenCart }) => (
  <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(13,34,20,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.12)", display: "flex", alignItems: "center", padding: "0 12px" }}>
    <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 4 }}>
      <img
        src="/images/logo-header-hq.png"
        alt="Essenza Chile"
        style={{ height: 45, width: "auto", display: "block", objectFit: "contain" }}
      />
    </div>
    <div style={{ display: "flex" }}>
      {NAV_TABS.map((tab) => (
        <button key={tab.id} onClick={() => onNav(tab.id)} style={{ background: "transparent", border: "none", borderBottom: active === tab.id ? `2px solid ${COLORS.gold}` : "2px solid transparent", color: active === tab.id ? COLORS.gold : "rgba(245,240,232,0.45)", fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", padding: "16px 18px 14px", cursor: "pointer", transition: "all 0.25s ease" }}
          onMouseEnter={(e) => { if (active !== tab.id) e.currentTarget.style.color = "rgba(245,240,232,0.75)"; }}
          onMouseLeave={(e) => { if (active !== tab.id) e.currentTarget.style.color = "rgba(245,240,232,0.45)"; }}>
          {tab.label}
        </button>
      ))}
    </div>
    <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
      {user ? (
        <button onClick={onLogout} style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 16, color: "rgba(201,168,76,0.7)", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.1em", padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
          {user.nombre.split(" ")[0]} · Salir
        </button>
      ) : (
        <button onClick={onLogin} title="Ingresar" style={{ background: "transparent", border: "none", color: "rgba(201,168,76,0.55)", cursor: "pointer", display: "flex", alignItems: "center", padding: 8 }}>
          <IconUser size={18} />
        </button>
      )}
      <button onClick={onOpenCart} aria-label="Carrito" style={{ background: "transparent", border: "none", color: COLORS.gold, cursor: "pointer", position: "relative", display: "flex", padding: 8 }}>
        <IconCart size={20} />
        {cartCount > 0 && (
          <span style={{ position: "absolute", top: 2, right: 2, background: COLORS.gold, color: COLORS.black, borderRadius: "50%", minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, padding: "0 3px" }}>
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </button>
    </div>
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
const ResultCard = ({ data, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const featured = PRODUCTS[4]; // 1L glass bottle

  const handleAdd = () => {
    if (onAddToCart) { onAddToCart(featured.id, 1); }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const details = [
    { label: "Momento de uso",    value: data.momento,      icon: "⏱" },
    { label: "Técnica",           value: data.tecnica,       icon: "🫒" },
    { label: "Maridaje sugerido", value: data.maridaje,      icon: "🍷" },
    { label: "Consejo del chef",  value: data.consejo_chef,  icon: "👨‍🍳" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.6s ease forwards", marginTop: 40, borderLeft: "3px solid #c9a84c", paddingLeft: 28 }}>

      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <span style={{ fontSize: 40, lineHeight: 1 }}>{data.emoji_plato}</span>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 26, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>{data.titulo}</h3>
      </div>

      <CompatibilityMeter value={data.compatibilidad} />

      {/* Product image + description */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{ flexShrink: 0, textAlign: "center", width: 76 }}>
          <img src={featured.image} alt={featured.name}
            style={{ width: 68, height: 90, objectFit: "contain", filter: "drop-shadow(0 4px 14px rgba(201,168,76,0.22))" }}
            onError={(e) => { e.target.style.display = "none"; }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(201,168,76,0.5)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6 }}>Essenza 1L</div>
        </div>
        <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.82)", fontSize: 15, lineHeight: 1.9, margin: 0, fontStyle: "italic", flex: 1 }}>{data.descripcion}</p>
      </div>

      {/* Detail rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 28 }}>
        {details.map((item) => (
          <div key={item.label} style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: 14, paddingBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>{item.label}</span>
            </div>
            <p style={{ fontFamily: "'Lora', serif", color: COLORS.cream, fontSize: 14, lineHeight: 1.75, margin: 0 }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Add to cart */}
      <button onClick={handleAdd}
        style={{ width: "100%", background: added ? "transparent" : COLORS.gold, border: `1px solid ${COLORS.gold}`, color: added ? COLORS.gold : COLORS.darkGreen, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", padding: "15px 0", cursor: "pointer", transition: "all 0.3s ease" }}>
        {added ? `✓ Agregado — ${featured.price}` : `Agregar al carrito · ${featured.price}`}
      </button>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(201,168,76,0.35)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", margin: 0 }}>
          Essenza Chile · Extra Virgen · Extracción en Frío
        </p>
      </div>
    </div>
  );
};

const QtyBtn = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} style={{ background: disabled ? "rgba(255,255,255,0.04)" : "rgba(45,74,30,0.4)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 6, color: disabled ? "rgba(201,168,76,0.2)" : COLORS.gold, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "default" : "pointer", flexShrink: 0 }}>
    {children}
  </button>
);

// ── Checkout Modal (cart-based) ────────────────────────────────────────────────
const inputBase = {
  width: "100%", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(201,168,76,0.25)",
  borderRadius: 8, color: "#f5f0e8", fontFamily: "'Lora', serif", fontSize: 14,
  padding: "10px 14px", outline: "none", boxSizing: "border-box",
};
const fieldLabel = {
  display: "block", fontSize: 10, letterSpacing: "0.2em", color: "rgba(201,168,76,0.75)",
  textTransform: "uppercase", marginBottom: 6, fontFamily: "'Cormorant Garamond', serif",
};
const chevronUrl = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")";

const CheckoutModal = ({ cartItems, onClose }) => {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", calle: "", numero: "", region: "", comuna: "", tipoDoc: "boleta", rut: "", razonSocial: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const selectedRegion = REGIONS.find((r) => r.id === form.region);
  const shippingCost = selectedRegion?.shipping || 0;
  const cartSubtotal = cartItems.reduce((s, item) => {
    const p = PRODUCTS.find((p) => p.id === item.productId);
    return s + (p?.numericPrice || 0) * item.quantity;
  }, 0);
  const total = cartSubtotal + shippingCost;

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    if (!form.calle.trim()) e.calle = "Requerido";
    if (!form.numero.trim()) e.numero = "Requerido";
    if (!form.region) e.region = "Selecciona una región";
    if (!form.comuna) e.comuna = "Selecciona una comuna";
    if (form.tipoDoc === "factura") {
      if (!form.rut.trim()) e.rut = "Requerido";
      if (!form.razonSocial.trim()) e.razonSocial = "Requerido";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || loading) return;
    setLoading(true);
    try {
      const products = cartItems.map((item) => {
        const p = PRODUCTS.find((p) => p.id === item.productId);
        return { name: `${p.name} ${p.volume}`, price: p.price, numericPrice: p.numericPrice, quantity: item.quantity };
      });
      const orderData = { customer: form, products, shipping: { cost: shippingCost, regionName: selectedRegion?.name || "" }, subtotal: cartSubtotal, total };
      localStorage.setItem("essenza_order", JSON.stringify(orderData));

      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, customer: form, shippingCost }),
      });
      const data = await res.json();
      if (data.init_point) { window.location.href = data.init_point; } else { setLoading(false); }
    } catch { setLoading(false); }
  };

  const err = { color: "#f87171", fontSize: 11, margin: "4px 0 0", fontFamily: "'Lora', serif" };
  const selectStyle = { ...inputBase, cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: chevronUrl, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#111", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ padding: "22px 26px 18px", borderBottom: "1px solid rgba(201,168,76,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#111", zIndex: 10, borderRadius: "18px 18px 0 0" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(201,168,76,0.6)", textTransform: "uppercase", marginBottom: 4, fontFamily: "'Cormorant Garamond', serif" }}>Finalizar pedido</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f5f0e8", fontSize: 18, fontWeight: 600, margin: 0 }}>
              {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"} · {formatCLP(cartSubtotal)}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(245,240,232,0.35)", cursor: "pointer", fontSize: 20, padding: "4px 4px 4px 12px" }}>✕</button>
        </div>

        <div style={{ padding: "22px 26px 28px" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", margin: "0 0 14px", fontFamily: "'Cormorant Garamond', serif" }}>Datos personales</p>
          <div style={{ marginBottom: 12 }}>
            <label style={fieldLabel}>Nombre completo</label>
            <input type="text" value={form.nombre} onChange={set("nombre")} placeholder="Juan Pérez" style={{ ...inputBase, borderColor: errors.nombre ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)" }} />
            {errors.nombre && <p style={err}>{errors.nombre}</p>}
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="juan@email.com" style={{ ...inputBase, borderColor: errors.email ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)" }} />
              {errors.email && <p style={err}>{errors.email}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>Teléfono</label>
              <input type="tel" value={form.telefono} onChange={set("telefono")} placeholder="+56 9 1234 5678" style={{ ...inputBase, borderColor: errors.telefono ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)" }} />
              {errors.telefono && <p style={err}>{errors.telefono}</p>}
            </div>
          </div>

          <p style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", margin: "0 0 14px", fontFamily: "'Cormorant Garamond', serif" }}>Dirección de despacho</p>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 2 }}>
              <label style={fieldLabel}>Calle</label>
              <input type="text" value={form.calle} onChange={set("calle")} placeholder="Av. Providencia" style={{ ...inputBase, borderColor: errors.calle ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)" }} />
              {errors.calle && <p style={err}>{errors.calle}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>Número</label>
              <input type="text" value={form.numero} onChange={set("numero")} placeholder="1234" style={{ ...inputBase, borderColor: errors.numero ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)" }} />
              {errors.numero && <p style={err}>{errors.numero}</p>}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={fieldLabel}>Región</label>
            <select value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value, comuna: "" }))} style={{ ...selectStyle, borderColor: errors.region ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)" }}>
              <option value="" style={{ background: "#111" }}>Selecciona tu región</option>
              {REGIONS.map((r) => <option key={r.id} value={r.id} style={{ background: "#111" }}>{r.name}</option>)}
            </select>
            {errors.region && <p style={err}>{errors.region}</p>}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={fieldLabel}>Comuna</label>
            <select value={form.comuna} onChange={set("comuna")} disabled={!form.region} style={{ ...selectStyle, borderColor: errors.comuna ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)", opacity: form.region ? 1 : 0.4, cursor: form.region ? "pointer" : "not-allowed" }}>
              <option value="" style={{ background: "#111" }}>{form.region ? "Selecciona tu comuna" : "Primero selecciona una región"}</option>
              {(COMMUNES[form.region] || []).map((c) => <option key={c} value={c} style={{ background: "#111" }}>{c}</option>)}
            </select>
            {errors.comuna && <p style={err}>{errors.comuna}</p>}
          </div>

          {selectedRegion && (
            <div style={{ background: "rgba(45,74,30,0.25)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.65)", fontSize: 13 }}>Despacho a {form.comuna ? `${form.comuna}, ` : ""}{selectedRegion.name}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.goldLight, fontSize: 18, fontWeight: 700 }}>{formatCLP(shippingCost)}</span>
            </div>
          )}

          <p style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", margin: "0 0 14px", fontFamily: "'Cormorant Garamond', serif" }}>Documento tributario</p>
          <div style={{ display: "flex", gap: 10, marginBottom: form.tipoDoc === "factura" ? 14 : 20 }}>
            {["boleta", "factura"].map((tipo) => (
              <button key={tipo} onClick={() => setForm((f) => ({ ...f, tipoDoc: tipo }))} style={{ flex: 1, background: form.tipoDoc === tipo ? "rgba(45,74,30,0.45)" : "transparent", border: `1px solid ${form.tipoDoc === tipo ? COLORS.gold : "rgba(201,168,76,0.22)"}`, borderRadius: 8, color: form.tipoDoc === tipo ? COLORS.gold : "rgba(245,240,232,0.45)", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: "0.12em", padding: "10px 0", cursor: "pointer", transition: "all 0.2s ease", textTransform: "capitalize" }}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>
          {form.tipoDoc === "factura" && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={fieldLabel}>RUT empresa</label>
                <input type="text" value={form.rut} onChange={set("rut")} placeholder="12.345.678-9" style={{ ...inputBase, borderColor: errors.rut ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)" }} />
                {errors.rut && <p style={err}>{errors.rut}</p>}
              </div>
              <div>
                <label style={fieldLabel}>Razón Social</label>
                <input type="text" value={form.razonSocial} onChange={set("razonSocial")} placeholder="Mi Empresa SpA" style={{ ...inputBase, borderColor: errors.razonSocial ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)" }} />
                {errors.razonSocial && <p style={err}>{errors.razonSocial}</p>}
              </div>
            </div>
          )}

          <div style={{ background: "rgba(45,74,30,0.15)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
            {cartItems.map((item) => {
              const p = PRODUCTS.find((p) => p.id === item.productId);
              return (
                <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.6)", fontSize: 13 }}>{p?.name} {p?.volume} × {item.quantity}</span>
                  <span style={{ fontFamily: "'Lora', serif", color: COLORS.cream, fontSize: 13 }}>{formatCLP((p?.numericPrice || 0) * item.quantity)}</span>
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: 10, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.55)", fontSize: 13 }}>Despacho{selectedRegion ? ` — ${selectedRegion.name}` : ""}</span>
                <span style={{ fontFamily: "'Lora', serif", color: selectedRegion ? COLORS.cream : "rgba(245,240,232,0.25)", fontSize: 13 }}>{selectedRegion ? formatCLP(shippingCost) : "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 15, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.goldLight, fontSize: 26, fontWeight: 700 }}>{selectedRegion ? formatCLP(total) : formatCLP(cartSubtotal)}</span>
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "rgba(45,74,30,0.25)" : `linear-gradient(135deg, ${COLORS.darkGreen}, ${COLORS.darkGreenLight})`, border: `1px solid ${loading ? "rgba(201,168,76,0.2)" : COLORS.gold}`, borderRadius: 10, color: loading ? "rgba(201,168,76,0.3)" : COLORS.gold, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase", padding: "14px 0", cursor: loading ? "default" : "pointer", transition: "all 0.25s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {loading ? <><LoadingDots /><span>Procesando...</span></> : "Proceder al pago →"}
          </button>
          <div style={{ textAlign: "center", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.25)", fontSize: 11, fontStyle: "italic" }}>Pago seguro con</span>
            <span style={{ color: "#009ee3", fontWeight: 700, fontSize: 11, opacity: 0.65 }}>Mercado Pago Chile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Payment Banner ─────────────────────────────────────────────────────────────
const PaymentBanner = ({ status, onClose }) => {
  const ok = status === "success";
  return (
    <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 500, width: "calc(100% - 32px)", maxWidth: 500, background: ok ? "rgba(30,60,20,0.97)" : "rgba(60,20,20,0.97)", border: `1px solid ${ok ? "rgba(201,168,76,0.45)" : "rgba(248,113,113,0.4)"}`, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "fadeUp 0.4s ease" }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>{ok ? "✓" : "✕"}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: ok ? COLORS.gold : "#f87171", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>
          {ok ? "¡Pago confirmado!" : status === "pending" ? "Pago pendiente" : "Pago no completado"}
        </p>
        <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.65)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          {ok ? "Recibirás un email de confirmación. Te contactaremos para coordinar el despacho." : status === "pending" ? "Tu pago está siendo procesado." : "Puedes intentarlo nuevamente cuando quieras."}
        </p>
      </div>
      <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(245,240,232,0.35)", cursor: "pointer", fontSize: 18, padding: 4, flexShrink: 0 }}>✕</button>
    </div>
  );
};

// ── Auth Modal ─────────────────────────────────────────────────────────────────
const AuthModal = ({ onClose, onLogin }) => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("essenza_users") || "[]");
    const found = users.find((u) => u.email === form.email && u.password === form.password);
    if (!found) { setError("Email o contraseña incorrectos."); return; }
    onLogin({ nombre: found.nombre, email: found.email });
    onClose();
  };

  const handleRegister = () => {
    if (!form.nombre.trim()) { setError("Ingresa tu nombre."); return; }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) { setError("Email inválido."); return; }
    if (form.password.length < 6) { setError("Contraseña mínimo 6 caracteres."); return; }
    if (form.password !== form.confirm) { setError("Las contraseñas no coinciden."); return; }
    const users = JSON.parse(localStorage.getItem("essenza_users") || "[]");
    if (users.find((u) => u.email === form.email)) { setError("Este email ya está registrado."); return; }
    const newUser = { nombre: form.nombre, email: form.email, password: form.password };
    localStorage.setItem("essenza_users", JSON.stringify([...users, newUser]));
    onLogin({ nombre: form.nombre, email: form.email });
    onClose();
  };

  const aI = { ...inputBase, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 12 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1050, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#0d2214", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 18, width: "100%", maxWidth: 380, animation: "fadeUp 0.35s ease" }}>
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(201,168,76,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 0 }}>
            {[["login", "Ingresar"], ["register", "Registrarse"]].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); setError(""); }} style={{ background: "transparent", border: "none", borderBottom: tab === id ? `2px solid ${COLORS.gold}` : "2px solid transparent", color: tab === id ? COLORS.gold : "rgba(245,240,232,0.4)", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: "0.12em", padding: "4px 16px 8px", cursor: "pointer" }}>{label}</button>
            ))}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(245,240,232,0.3)", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px 28px" }}>
          {tab === "register" && (
            <input type="text" value={form.nombre} onChange={set("nombre")} placeholder="Nombre completo" style={aI} />
          )}
          <input type="email" value={form.email} onChange={set("email")} placeholder="Email" style={aI} />
          <input type="password" value={form.password} onChange={set("password")} placeholder="Contraseña" style={aI} />
          {tab === "register" && (
            <input type="password" value={form.confirm} onChange={set("confirm")} placeholder="Confirmar contraseña" style={{ ...aI, marginBottom: 0 }} />
          )}
          {error && <p style={{ color: "#f87171", fontSize: 12, margin: "10px 0 0", fontFamily: "'Lora', serif", fontStyle: "italic" }}>{error}</p>}
          <button onClick={tab === "login" ? handleLogin : handleRegister}
            style={{ width: "100%", marginTop: 20, background: COLORS.gold, border: "none", borderRadius: 9, color: COLORS.black, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 0", cursor: "pointer" }}>
            {tab === "login" ? "Ingresar" : "Crear cuenta"}
          </button>
          <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.25)", fontSize: 11, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
            Los invitados también pueden comprar sin registrarse.
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Cart Drawer ────────────────────────────────────────────────────────────────
const CartDrawer = ({ cart, onClose, onCheckout, onUpdateQty, onRemove }) => {
  const subtotal = cart.reduce((s, item) => {
    const p = PRODUCTS.find((p) => p.id === item.productId);
    return s + (p?.numericPrice || 0) * item.quantity;
  }, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "100%", maxWidth: 380, background: "#0d2214", borderLeft: "1px solid rgba(201,168,76,0.25)", display: "flex", flexDirection: "column", animation: "slideInRight 0.28s ease" }}>
        <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid rgba(201,168,76,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 20, fontWeight: 600, margin: 0 }}>Tu Carrito</h2>
            {totalItems > 0 && <p style={{ fontFamily: "'Lora', serif", color: "rgba(201,168,76,0.6)", fontSize: 12, margin: "2px 0 0" }}>{totalItems} {totalItems === 1 ? "producto" : "productos"}</p>}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(245,240,232,0.35)", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,240,232,0.5)", fontSize: 18 }}>Tu carrito está vacío</p>
              <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.3)", fontSize: 13, fontStyle: "italic" }}>Explora nuestra tienda</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {cart.map((item) => {
                const p = PRODUCTS.find((p) => p.id === item.productId);
                if (!p) return null;
                return (
                  <div key={item.productId} style={{ background: "rgba(45,74,30,0.2)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12, padding: "14px 14px" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 56, height: 56, flexShrink: 0, background: "rgba(0,0,0,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{p.name}</div>
                        <div style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.4)", fontSize: 11, fontStyle: "italic", marginBottom: 8 }}>{p.volume}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <QtyBtn onClick={() => onUpdateQty(item.productId, -1)} disabled={item.quantity <= 1}><IconMinus /></QtyBtn>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 15, fontWeight: 600, minWidth: 18, textAlign: "center" }}>{item.quantity}</span>
                            <QtyBtn onClick={() => onUpdateQty(item.productId, 1)}><IconPlus /></QtyBtn>
                          </div>
                          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.goldLight, fontSize: 16, fontWeight: 700 }}>{formatCLP(p.numericPrice * item.quantity)}</span>
                        </div>
                      </div>
                      <button onClick={() => onRemove(item.productId)} style={{ background: "transparent", border: "none", color: "rgba(245,240,232,0.25)", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: "16px 22px 24px", borderTop: "1px solid rgba(201,168,76,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.55)", fontSize: 13 }}>Subtotal</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 18, fontWeight: 700 }}>{formatCLP(subtotal)}</span>
            </div>
            <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.3)", fontSize: 11, fontStyle: "italic", margin: "0 0 16px" }}>Envío calculado al finalizar</p>
            <button onClick={onCheckout} style={{ width: "100%", background: COLORS.gold, border: "none", borderRadius: 10, color: COLORS.black, fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", padding: "15px 0", cursor: "pointer", transition: "opacity 0.2s" }}>
              Ir al checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Product Detail Modal ───────────────────────────────────────────────────────
const CERTS = ["Extra Virgen", "Extracción en Frío", "Sin Aditivos"];

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    onAddToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(5px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#0d2214", border: "1px solid rgba(201,168,76,0.28)", borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "92vh", overflowY: "auto", animation: "fadeUp 0.35s ease" }}>
        <div style={{ position: "sticky", top: 0, background: "#0d2214", zIndex: 10, padding: "16px 20px 12px", borderBottom: "1px solid rgba(201,168,76,0.1)", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(245,240,232,0.3)", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ padding: "0 28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {!imgError
                ? <img src={product.image} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                : <span style={{ fontSize: 64 }}>🫒</span>}
            </div>
          </div>

          {product.badge && (
            <div style={{ display: "inline-block", background: COLORS.gold, color: COLORS.black, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 12px", borderRadius: 20, marginBottom: 10, fontFamily: "'Cormorant Garamond', serif" }}>{product.badge}</div>
          )}

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 26, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.1 }}>{product.name}</h2>
          <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.4)", fontSize: 14, fontStyle: "italic", margin: "0 0 12px" }}>{product.volume}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.goldLight, fontSize: 30, fontWeight: 700, margin: "0 0 18px" }}>{product.price}</p>

          <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.75)", fontSize: 14, lineHeight: 1.8, margin: "0 0 20px" }}>{product.description}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {CERTS.map((c) => (
              <span key={c} style={{ background: "rgba(45,74,30,0.5)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 20, color: "rgba(201,168,76,0.8)", fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 12px" }}>{c}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.55)", fontSize: 13 }}>Cantidad:</span>
            <QtyBtn onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}><IconMinus /></QtyBtn>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 18, fontWeight: 600, minWidth: 24, textAlign: "center" }}>{qty}</span>
            <QtyBtn onClick={() => setQty((q) => q + 1)}><IconPlus /></QtyBtn>
          </div>

          <button onClick={handleAdd} style={{ width: "100%", background: added ? "rgba(45,74,30,0.7)" : `linear-gradient(135deg, ${COLORS.darkGreen}, ${COLORS.darkGreenLight})`, border: `1px solid ${added ? "rgba(201,168,76,0.4)" : COLORS.gold}`, borderRadius: 10, color: COLORS.gold, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 0", cursor: "pointer", transition: "all 0.25s ease" }}>
            {added ? "✓ Agregado al carrito" : `Agregar al carrito · ${formatCLP(product.numericPrice * qty)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Newsletter Modal ───────────────────────────────────────────────────────────
const IconOliveBranch = () => (
  <svg width="52" height="56" viewBox="0 0 52 56" fill="none">
    <path d="M26 52 Q25 38 24 28 Q23 18 26 8" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <ellipse cx="16" cy="20" rx="9" ry="4.2" fill="rgba(45,74,30,0.9)" stroke="#c9a84c" strokeWidth="1.2" transform="rotate(-38 16 20)"/>
    <ellipse cx="14" cy="34" rx="8" ry="3.8" fill="rgba(45,74,30,0.8)" stroke="#c9a84c" strokeWidth="1.1" transform="rotate(-28 14 34)"/>
    <ellipse cx="36" cy="16" rx="9" ry="4.2" fill="rgba(45,74,30,0.9)" stroke="#c9a84c" strokeWidth="1.2" transform="rotate(33 36 16)"/>
    <ellipse cx="34" cy="30" rx="8" ry="3.8" fill="rgba(45,74,30,0.8)" stroke="#c9a84c" strokeWidth="1.1" transform="rotate(22 34 30)"/>
    <circle cx="16" cy="18" r="2.2" fill="#c9a84c" opacity="0.75"/>
    <circle cx="36" cy="14" r="2.2" fill="#c9a84c" opacity="0.75"/>
    <circle cx="13" cy="32" r="1.8" fill="#c9a84c" opacity="0.5"/>
  </svg>
);

const NEWSLETTER_PREFS = ["Aceite de oliva extra virgen", "Pastas artesanales", "Sets de regalo", "Todo Essenza"];
const DISCOUNT_CODE = "ESSENZA15";

const nlInputBase = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "#f5f0e8", fontFamily: "'Lora', serif", fontSize: 14, padding: "11px 14px", outline: "none", boxSizing: "border-box" };
const nlFieldLabel = { display: "block", fontSize: 10, letterSpacing: "0.2em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", marginBottom: 5, fontFamily: "'Cormorant Garamond', serif" };
const chevronSvg = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")";

const NewsletterModal = ({ onClose }) => {
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", fechaNacimiento: "", preferencia: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Email inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || loading) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      localStorage.setItem("essenza_subscribed", "1");
      trackLead(form.email);
      setSuccess(true);
    } catch {}
    setLoading(false);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(DISCOUNT_CODE); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
  };

  const nlErr = { color: "#f87171", fontSize: 11, margin: "3px 0 0", fontFamily: "'Lora', serif" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(0,0,0,0.86)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(7px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#0d2214", border: "1px solid rgba(201,168,76,0.32)", borderRadius: 22, width: "100%", maxWidth: 480, maxHeight: "94vh", overflowY: "auto", animation: "fadeUp 0.4s ease", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "transparent", border: "none", color: "rgba(245,240,232,0.3)", cursor: "pointer", fontSize: 20, zIndex: 2, padding: 6 }}>✕</button>
        {!success ? (
          <div style={{ padding: "40px 36px 32px" }}>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ marginBottom: 14 }}><IconOliveBranch /></div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.32)", borderRadius: 20, padding: "5px 16px" }}>
                <span style={{ fontSize: 9, color: COLORS.gold }}>✦</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.24em", color: COLORS.gold, textTransform: "uppercase" }}>Bienvenida exclusiva</span>
                <span style={{ fontSize: 9, color: COLORS.gold }}>✦</span>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 31, fontWeight: 700, lineHeight: 1.08, textAlign: "center", marginBottom: 14, background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.goldLight} 60%, ${COLORS.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textTransform: "uppercase" }}>
              15% OFF<br />y Envío Gratis<br />en tu primera compra
            </h2>
            <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.48)", fontSize: 13.5, lineHeight: 1.7, textAlign: "center", marginBottom: 26, fontStyle: "italic" }}>
              Regístrate para recibir tu descuento exclusivo,<br />novedades y ofertas de Essenza Chile.
            </p>
            <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", marginBottom: 22 }} />
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={nlFieldLabel}>Nombre</label>
                <input type="text" value={form.nombre} onChange={set("nombre")} placeholder="María" style={{ ...nlInputBase, borderColor: errors.nombre ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.2)" }} />
                {errors.nombre && <p style={nlErr}>{errors.nombre}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={nlFieldLabel}>Apellido</label>
                <input type="text" value={form.apellido} onChange={set("apellido")} placeholder="González" style={nlInputBase} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={nlFieldLabel}>Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="maria@email.com" style={{ ...nlInputBase, borderColor: errors.email ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.2)" }} />
              {errors.email && <p style={nlErr}>{errors.email}</p>}
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <label style={nlFieldLabel}>Fecha de nacimiento</label>
                <input type="date" value={form.fechaNacimiento} onChange={set("fechaNacimiento")} style={{ ...nlInputBase, colorScheme: "dark" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={nlFieldLabel}>Preferencia</label>
                <select value={form.preferencia} onChange={set("preferencia")} style={{ ...nlInputBase, cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: chevronSvg, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32 }}>
                  <option value="" style={{ background: "#0d2214" }}>Elige una</option>
                  {NEWSLETTER_PREFS.map((p) => <option key={p} value={p} style={{ background: "#0d2214" }}>{p}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "rgba(201,168,76,0.5)" : COLORS.gold, border: "none", borderRadius: 10, color: COLORS.black, fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", padding: "16px 0", cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
              {loading ? <><LoadingDots /><span style={{ color: COLORS.darkGreen }}>Enviando...</span></> : "Quiero mi descuento"}
            </button>
            <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.2)", fontSize: 10.5, lineHeight: 1.6, textAlign: "center" }}>
              Al registrarte aceptas nuestra <a href="mailto:contacto@premiumolivechile.com" style={{ color: "rgba(201,168,76,0.4)", textDecoration: "underline" }}>Política de Privacidad</a>. Puedes cancelar en cualquier momento.
            </p>
          </div>
        ) : (
          <div style={{ padding: "52px 36px", textAlign: "center" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(45,74,30,0.5)", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, color: COLORS.gold }}>✓</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 26, fontWeight: 600, margin: "0 0 8px" }}>¡Ya eres parte de Essenza!</h2>
            <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.45)", fontSize: 13, lineHeight: 1.7, marginBottom: 30, fontStyle: "italic" }}>Hemos enviado tu código exclusivo a tu email.</p>
            <div style={{ background: "rgba(201,168,76,0.09)", border: "1px solid rgba(201,168,76,0.32)", borderRadius: 14, padding: "26px 20px", marginBottom: 22 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(201,168,76,0.6)", fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", margin: "0 0 14px" }}>Tu código exclusivo</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 12 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.goldLight, fontSize: 38, fontWeight: 700, letterSpacing: "0.14em" }}>{DISCOUNT_CODE}</span>
                <button onClick={handleCopy} style={{ background: copied ? "rgba(45,74,30,0.6)" : "rgba(201,168,76,0.14)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: COLORS.gold, fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", padding: "7px 14px", cursor: "pointer" }}>
                  {copied ? "✓ Copiado" : "Copiar"}
                </button>
              </div>
              <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.4)", fontSize: 12, margin: 0, fontStyle: "italic" }}>15% de descuento + envío gratis en tu primera compra</p>
            </div>
            <button onClick={onClose} style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.darkGreen}, ${COLORS.darkGreenLight})`, border: `1px solid ${COLORS.gold}`, borderRadius: 10, color: COLORS.gold, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 0", cursor: "pointer" }}>Ir a la tienda →</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Sections ───────────────────────────────────────────────────────────────────
const QuienesSomos = () => {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cards = [
    { title: "Visión", text: "Ser embajadores del aceite de oliva chileno en el mundo, promoviendo calidad, trazabilidad y sabor natural." },
    { title: "Misión", text: "Producir, envasar, comercializar y exportar un aceite de oliva virgen extra de alta gama, respetando el medioambiente y las tradiciones olivícolas." },
    { title: "Origen", text: "Valle Central de Chile, donde el clima mediterráneo y la tierra fértil producen aceitunas de calidad excepcional." },
  ];

  return (
    <div ref={containerRef} style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px", textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.35em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", marginBottom: 20 }}>Nuestra Historia</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: "clamp(40px, 6vw, 56px)", fontWeight: 400, margin: "0 0 24px", lineHeight: 1 }}>Quiénes Somos</h2>
        <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", margin: "0 auto" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 52, color: "rgba(201,168,76,0.45)", fontSize: 11 }}>
        <span>◆</span>
        <span>◆</span>
        <span>◆</span>
      </div>

      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#f5f0e8", fontSize: "clamp(18px, 2.5vw, 22px)", lineHeight: 1.9, maxWidth: 700, margin: "0 auto 72px", fontWeight: 400 }}>
        Essenza Chile nace en el corazón agrícola del Valle Central, donde el clima mediterráneo y la tierra generosa se unen para producir uno de los mejores aceites de oliva virgen extra del mundo. Nuestra marca representa la elegancia, el origen y el compromiso con la excelencia.
      </p>

      <div className="qs-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
        {cards.map((item, i) => (
          <div key={item.title} style={{ borderTop: "2px solid #c9a84c", paddingTop: 28, textAlign: "left", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.9s ease ${0.2 + i * 0.15}s, transform 0.9s ease ${0.2 + i * 0.15}s` }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 22, fontWeight: 600, margin: "0 0 16px", letterSpacing: "0.05em" }}>{item.title}</h3>
            <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", color: "rgba(245,240,232,0.75)", fontSize: 14, lineHeight: 1.85, margin: 0 }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Contacto = () => {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px", textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.35em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", marginBottom: 20 }}>Escríbenos</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: "clamp(40px, 6vw, 56px)", fontWeight: 400, margin: "0 0 24px", lineHeight: 1 }}>Contacto</h2>
        <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", margin: "0 auto" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 52, color: "rgba(201,168,76,0.45)", fontSize: 11 }}>
        <span>◆</span><span>◆</span><span>◆</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {SOCIAL_LINKS.map((link, i) => {
          const Icon = ICON_MAP[link.icon];
          return (
            <a key={link.label} href={link.href} target={link.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
              onClick={() => { if (link.icon === "whatsapp" || link.icon === "email") trackContact({}); }}
              style={{ display: "flex", alignItems: "center", gap: 24, borderTop: i === 0 ? "1px solid rgba(201,168,76,0.25)" : "none", borderBottom: "1px solid rgba(201,168,76,0.25)", padding: "28px 8px", color: COLORS.gold, textDecoration: "none", transition: "all 0.3s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transitionDelay: `${0.15 + i * 0.1}s` }}
              onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "20px"; e.currentTarget.style.color = "#e8c46a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "8px"; e.currentTarget.style.color = COLORS.gold; }}>
              <span style={{ color: "rgba(201,168,76,0.55)", flexShrink: 0 }}><Icon size={18} /></span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 4 }}>{link.label}</div>
                <div style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 15, color: "rgba(245,240,232,0.85)" }}>{link.href.replace("https://", "").replace("mailto:", "")}</div>
              </div>
              <span style={{ color: "rgba(201,168,76,0.3)", fontSize: 12 }}>◆</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

const LEGAL_LINKS = [
  { label: "Despacho y Devolución", href: "/politicas-despacho" },
  { label: "Términos y Condiciones", href: "/terminos-condiciones" },
  { label: "Política de Reembolso", href: "/politica-reembolso" },
  { label: "Privacidad", href: "/politica-privacidad" },
];

// ── Footer ─────────────────────────────────────────────────────────────────────
const Footer = ({ onNewsletter, onNav }) => (
  <footer style={{ background: "#0d2214", borderTop: "1px solid rgba(201,168,76,0.12)", padding: "80px 24px 48px" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* Top gold line */}
      <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)", marginBottom: 64 }} />

      {/* Three-column body */}
      <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 48, alignItems: "start", marginBottom: 64 }}>

        {/* Left — brand */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: COLORS.gold, letterSpacing: "0.04em", marginBottom: 14, lineHeight: 1 }}>Essenza</div>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 13, color: "rgba(245,240,232,0.5)", lineHeight: 1.8, margin: "0 0 20px", maxWidth: 220 }}>
            Aceite de oliva extra virgen del Valle Central de Chile. Elegancia, origen y excelencia.
          </p>
          <div style={{ display: "flex", gap: 18, marginTop: 4 }}>
            {SOCIAL_LINKS.map((link) => {
              const Icon = ICON_MAP[link.icon];
              return (
                <a key={link.label} href={link.href} target={link.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" aria-label={link.label}
                  style={{ color: "rgba(201,168,76,0.45)", transition: "color 0.2s ease", display: "flex" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.gold; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(201,168,76,0.45)"; }}>
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Center — nav + diamonds */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(201,168,76,0.3)", fontSize: 9, marginBottom: 28 }}>
            <span>◆</span><span>◆</span><span>◆</span>
          </div>
          {NAV_TABS.map((tab) => (
            <button key={tab.id} onClick={() => onNav && onNav(tab.id)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", padding: "8px 0", transition: "color 0.2s ease", display: "block" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.gold; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(201,168,76,0.5)"; }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right — newsletter */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 4 }}>Newsletter</div>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 13, color: "rgba(245,240,232,0.45)", lineHeight: 1.7, margin: 0, textAlign: "right", maxWidth: 200 }}>
            Recibe recetas, novedades y un 15% de descuento en tu primera compra.
          </p>
          <button onClick={onNewsletter}
            style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.35)", color: "rgba(201,168,76,0.7)", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", cursor: "pointer", transition: "all 0.25s ease", marginTop: 4 }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.background = "rgba(201,168,76,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.color = "rgba(201,168,76,0.7)"; e.currentTarget.style.background = "transparent"; }}>
            ◆ Quiero mi 15% OFF
          </button>
        </div>
      </div>

      {/* Bottom divider + legal */}
      <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: 28, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(201,168,76,0.25)", fontSize: 11, letterSpacing: "0.12em", margin: 0 }}>
          © 2025 Premium Olive Chile SpA · Todos los derechos reservados.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
          {LEGAL_LINKS.map((link) => (
            <a key={link.href} href={link.href}
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(201,168,76,0.28)", fontSize: 11, letterSpacing: "0.1em", textDecoration: "none", transition: "color 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(201,168,76,0.65)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(201,168,76,0.28)"; }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>

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

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("essenza_user") || "null"));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("essenza_cart") || "[]"));
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const textareaRef = useRef(null);
  const sectionsRef = useRef({});

  const saveCart = (next) => { localStorage.setItem("essenza_cart", JSON.stringify(next)); return next; };

  const addToCart = (productId, qty) => {
    trackEvent("AddToCart", { content_ids: [productId], content_type: "product", quantity: qty });
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      const next = existing
        ? prev.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { productId, quantity: qty }];
      return saveCart(next);
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) => saveCart(prev.map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => saveCart(prev.filter((i) => i.productId !== productId)));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("essenza_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("essenza_user");
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    if (!localStorage.getItem("essenza_subscribed")) {
      const t = setTimeout(() => setShowNewsletter(true), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const cleanups = [
      initCursor(),
      initParallax(),
      initScrollReveal(),
      initTypeReveal(),
    ].filter(Boolean);
    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success" || payment === "failure" || payment === "pending") {
      setPaymentStatus(payment);
      if (payment === "success") {
        const paymentId = params.get("payment_id") || params.get("collection_id") || "";
        const stored = localStorage.getItem("essenza_order");
        if (stored) {
          try {
            const orderData = JSON.parse(stored);
            const productNames = (orderData.products || []).map((p) => p.name).join(", ");
            const itemCount = (orderData.products || []).reduce((s, p) => s + (p.quantity || 1), 0);
            trackEvent("Purchase", {
              total: orderData.total || 0,
              items: productNames,
              order_id: paymentId,
              quantity: itemCount,
            });
            serverEvent("Purchase", {
              value: orderData.total || 0,
              currency: "CLP",
              content_ids: [paymentId],
              num_items: itemCount,
            }, {
              email: orderData.customer?.email || "",
              phone: orderData.customer?.telefono || "",
            });
            const payload = JSON.stringify({ ...orderData, paymentId });
            fetch("/api/send-order-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload }).catch(console.error);
            fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload }).catch(console.error);
          } catch {}
          localStorage.removeItem("essenza_order");
        }
        setCart([]);
        localStorage.removeItem("essenza_cart");
      }
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveTab(e.target.dataset.section); }); },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.values(sectionsRef.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    sectionsRef.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: SYSTEM_PROMPT, messages: [{ role: "user", content: input }] }) });
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.error) setError(parsed.error); else setResult(parsed);
    } catch { setError("Algo salió mal. Por favor intenta de nuevo."); }
    finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } };
  const suggestions = ["Pulpo a la gallega", "Ensalada caprese", "Lomo de merluza al horno", "Pasta al pesto", "Pan artesanal tostado", "Ceviche chileno"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.black}; }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.2);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
        @keyframes slideInRight { from{transform:translateX(100%);}to{transform:translateX(0);} }
        textarea:focus { outline: none; }
        textarea::placeholder { color: rgba(245,240,232,0.3); }
        input::placeholder { color: rgba(245,240,232,0.25); }
        select option { background: #111111; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.75) sepia(1) hue-rotate(10deg); opacity: 0.55; cursor: pointer; }
        @keyframes slowRotate { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
        .pairing-input::placeholder { color: rgba(245,240,232,0.3) !important; font-style: italic; }
        @media (max-width: 640px) { .nav-text { display: none; } .qs-cards { grid-template-columns: 1fr !important; gap: 32px !important; } }
        @media (max-width: 480px) { .nav-text { display: none; } }
        @media (min-width: 768px) { .maridaje-foto-col { display: block !important; } }
        @media (max-width: 767px) { .maridaje-content-col { padding: 80px 24px 60px !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 0%, rgba(45,74,30,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(201,168,76,0.08) 0%, transparent 50%), ${COLORS.black}`, fontFamily: "'Cormorant Garamond', serif" }}>

        {paymentStatus && <PaymentBanner status={paymentStatus} onClose={() => setPaymentStatus(null)} />}
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={login} />}
        {showCart && <CartDrawer cart={cart} onClose={() => setShowCart(false)} onCheckout={() => { setShowCart(false); setCheckoutOpen(true); trackEvent("InitiateCheckout"); }} onUpdateQty={updateCartQty} onRemove={removeFromCart} />}
        {checkoutOpen && cart.length > 0 && <CheckoutModal cartItems={cart} onClose={() => setCheckoutOpen(false)} />}
        {detailProduct && <ProductDetailModal product={detailProduct} onClose={() => setDetailProduct(null)} onAddToCart={(id, qty) => { addToCart(id, qty); }} />}
        {showNewsletter && <NewsletterModal onClose={() => setShowNewsletter(false)} />}
        <WhatsAppButton />}

        <HeroSection
          onShopClick={() => scrollToSection("tienda")}
          onAiClick={() => scrollToSection("inicio")}
        />

        <BrandStory />

        <div ref={(el) => { sectionsRef.current["tienda"] = el; }} data-section="tienda">
          <ProductsShowcase
            onAddToCart={addToCart}
            onDetail={(p) => { trackEvent("ViewContent", { content_ids: [p.id], content_name: p.name, content_type: "product" }); setDetailProduct(p); }}
            onViewAll={() => scrollToSection("tienda")}
          />
        </div>

        <Testimonials />

        <NavBar active={activeTab} onNav={scrollToSection} user={user} onLogin={() => setShowAuth(true)} onLogout={logout} cartCount={cartCount} onOpenCart={() => setShowCart(true)} />

        <section ref={(el) => { sectionsRef.current["inicio"] = el; }} data-section="inicio"
          style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", position: "relative", overflow: "hidden" }}>

          {/* COLUMNA IZQUIERDA — Foto real con overlay */}
          <div style={{ width: "45%", position: "relative", flexShrink: 0, display: "none" }} className="maridaje-foto-col">
            <img
              src="/images/fotos-reales/aceite-lifestyle.jpg"
              alt="Aceite Essenza"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,10,10,0) 60%, #0A0A0A 100%)" }} />
            <div style={{ position: "absolute", bottom: 40, left: 40, background: "rgba(10,10,10,0.7)", border: "0.5px solid rgba(201,168,76,0.4)", padding: "16px 24px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: 6 }}>Inteligencia artificial</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#f5f0e8" }}>Maridaje perfecto</div>
            </div>
          </div>

          {/* COLUMNA DERECHA — Contenido */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px 64px 80px", position: "relative", zIndex: 1 }} className="maridaje-content-col">

            {/* SVG decorativo fondo */}
            <div style={{ position: "absolute", bottom: "-10%", right: "-5%", opacity: 0.03, animation: "slowRotate 80s linear infinite", pointerEvents: "none" }}>
              <svg viewBox="0 0 400 400" width="560" height="560" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M200 380 Q196 290 186 210 Q176 130 200 50" stroke="#c9a84c" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                <path d="M191 335 Q148 308 105 288" stroke="#c9a84c" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                <path d="M189 295 Q238 268 278 250" stroke="#c9a84c" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                <path d="M192 258 Q144 228 102 205" stroke="#c9a84c" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                <path d="M191 218 Q242 192 282 172" stroke="#c9a84c" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                <path d="M193 178 Q148 150 110 130" stroke="#c9a84c" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                <path d="M195 140 Q244 115 278 96" stroke="#c9a84c" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                <path d="M197 104 Q155 82 122 68" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <ellipse cx="84" cy="280" rx="24" ry="9.5" fill="#c9a84c" transform="rotate(-36 84 280)"/>
                <ellipse cx="58" cy="266" rx="19" ry="7.5" fill="#c9a84c" transform="rotate(-42 58 266)"/>
                <ellipse cx="114" cy="292" rx="19" ry="7.5" fill="#c9a84c" transform="rotate(-28 114 292)"/>
                <ellipse cx="288" cy="242" rx="24" ry="9.5" fill="#c9a84c" transform="rotate(36 288 242)"/>
                <ellipse cx="314" cy="228" rx="19" ry="7.5" fill="#c9a84c" transform="rotate(30 314 228)"/>
                <ellipse cx="264" cy="255" rx="19" ry="7.5" fill="#c9a84c" transform="rotate(42 264 255)"/>
                <ellipse cx="82" cy="198" rx="24" ry="9.5" fill="#c9a84c" transform="rotate(-40 82 198)"/>
                <ellipse cx="56" cy="184" rx="19" ry="7.5" fill="#c9a84c" transform="rotate(-46 56 184)"/>
                <ellipse cx="112" cy="210" rx="19" ry="7.5" fill="#c9a84c" transform="rotate(-32 112 210)"/>
                <ellipse cx="292" cy="164" rx="24" ry="9.5" fill="#c9a84c" transform="rotate(34 292 164)"/>
                <ellipse cx="318" cy="150" rx="19" ry="7.5" fill="#c9a84c" transform="rotate(28 318 150)"/>
                <ellipse cx="88" cy="122" rx="22" ry="8.5" fill="#c9a84c" transform="rotate(-38 88 122)"/>
                <ellipse cx="64" cy="108" rx="17" ry="6.5" fill="#c9a84c" transform="rotate(-44 64 108)"/>
                <ellipse cx="286" cy="88" rx="22" ry="8.5" fill="#c9a84c" transform="rotate(37 286 88)"/>
                <ellipse cx="264" cy="76" rx="17" ry="6.5" fill="#c9a84c" transform="rotate(43 264 76)"/>
                <ellipse cx="100" cy="66" rx="18" ry="7" fill="#c9a84c" transform="rotate(-35 100 66)"/>
                <circle cx="104" cy="288" r="7" fill="#c9a84c"/>
                <circle cx="294" cy="248" r="7" fill="#c9a84c"/>
                <circle cx="102" cy="208" r="6" fill="#c9a84c"/>
                <circle cx="298" cy="168" r="6" fill="#c9a84c"/>
                <circle cx="106" cy="128" r="6" fill="#c9a84c"/>
                <circle cx="292" cy="94" r="6" fill="#c9a84c"/>
                <circle cx="112" cy="74" r="5" fill="#c9a84c"/>
              </svg>
            </div>

            {/* Eyebrow */}
            <div className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "5px", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: 20 }}>
              Potenciado por Claude AI · Essenza Chile
            </div>

            {/* Título */}
            <h2 className="type-reveal" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f5f0e8", fontSize: "clamp(36px, 4.5vw, 58px)", fontWeight: 300, margin: "0 0 8px", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              Encuentra tu
            </h2>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#c9a84c", fontSize: "clamp(36px, 4.5vw, 58px)", fontWeight: 300, fontStyle: "italic", margin: "0 0 28px", lineHeight: 1.05 }}>
              Maridaje Perfecto
            </h2>

            {/* Descripción */}
            <p className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,240,232,0.55)", fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.8, margin: "0 0 48px", maxWidth: 420, fontStyle: "italic" }}>
              Nuestra IA analiza tu plato y selecciona el aceite Essenza que mejor realza sus sabores.
            </p>

            {/* Separador */}
            <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
              <div style={{ width: 48, height: "0.5px", background: "rgba(201,168,76,0.4)" }} />
              <span style={{ color: "rgba(201,168,76,0.5)", fontSize: 9, letterSpacing: "3px", textTransform: "uppercase" }}>Escribe tu plato</span>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(201,168,76,0.15)" }} />
            </div>

            {/* Input */}
            <div style={{ position: "relative", marginBottom: 32 }}>
              <input
                ref={textareaRef}
                className="pairing-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="ej: Pasta al pesto, Ceviche, Asado a la parrilla..."
                style={{ width: "100%", background: "rgba(13,32,20,0.6)", border: "0.5px solid rgba(201,168,76,0.2)", borderBottom: "1px solid rgba(201,168,76,0.4)", color: "#f5f0e8", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px, 2.5vw, 22px)", fontStyle: "italic", padding: "18px 20px", outline: "none", caretColor: "#c9a84c", boxSizing: "border-box", transition: "border-color 0.3s ease" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", height: 2, background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", width: inputFocused ? "100%" : "0%", transition: "width 0.45s ease", pointerEvents: "none" }} />
            </div>

            {/* Suggestions */}
            {!result && !loading && (
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => setInput(s)}
                      style={{ background: "transparent", border: "0.5px solid rgba(201,168,76,0.2)", color: "rgba(245,240,232,0.5)", fontFamily: "'Cormorant Garamond', serif", fontSize: 13, padding: "6px 14px", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.5px" }}
                      onMouseEnter={(e) => { e.target.style.borderColor = "rgba(201,168,76,0.6)"; e.target.style.color = "#c9a84c"; e.target.style.background = "rgba(201,168,76,0.05)"; }}
                      onMouseLeave={(e) => { e.target.style.borderColor = "rgba(201,168,76,0.2)"; e.target.style.color = "rgba(245,240,232,0.5)"; e.target.style.background = "transparent"; }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botón */}
            <button onClick={handleSubmit} disabled={!input.trim() || loading}
              style={{ background: input.trim() && !loading ? "#c9a84c" : "transparent", border: "0.5px solid rgba(201,168,76,0.4)", color: input.trim() && !loading ? "#0A0A0A" : "rgba(201,168,76,0.4)", fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", padding: "16px 48px", cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.3s ease", maxWidth: 280 }}
              onMouseEnter={(e) => { if (input.trim() && !loading) e.currentTarget.style.background = "#e8c46a"; }}
              onMouseLeave={(e) => { if (input.trim() && !loading) e.currentTarget.style.background = "#c9a84c"; }}>
              {loading ? <><span>Analizando</span><LoadingDots /></> : "Descubrir Maridaje"}
            </button>

            {error && (
              <div style={{ marginTop: 20, color: "#eb5757", fontSize: 13, fontFamily: "'Cormorant Garamond', serif" }}>{error}</div>
            )}

            {result && <ResultCard data={result} onAddToCart={addToCart} />}

            {result && (
              <button onClick={() => { setResult(null); setInput(""); setError(null); }}
                style={{ marginTop: 24, background: "transparent", border: "none", color: "rgba(201,168,76,0.6)", fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "2px", cursor: "pointer", padding: 0 }}
                onMouseEnter={(e) => { e.target.style.color = "rgba(201,168,76,0.9)"; }}
                onMouseLeave={(e) => { e.target.style.color = "rgba(201,168,76,0.6)"; }}>
                ← Nuevo maridaje
              </button>
            )}

            {/* Stats */}
            <div className="reveal" style={{ display: "flex", gap: 40, marginTop: 56, paddingTop: 32, borderTop: "0.5px solid rgba(201,168,76,0.1)" }}>
              {[
                { num: "0.3%", label: "Acidez máxima" },
                { num: "24h", label: "Cosecha a botella" },
                { num: "100%", label: "Valle Central" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: "#c9a84c" }}>{num}</div>
                  <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <section ref={(el) => { sectionsRef.current["quienes-somos"] = el; }} data-section="quienes-somos" style={{ background: "#0d2214", borderTop: "1px solid rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
          <QuienesSomos />
        </section>

        <section ref={(el) => { sectionsRef.current["contacto"] = el; }} data-section="contacto" style={{ background: "#0d2214", borderTop: "1px solid rgba(201,168,76,0.12)" }}>
          <Contacto />
        </section>

        <Footer onNewsletter={() => setShowNewsletter(true)} onNav={scrollToSection} />
      </div>
    </>
  );
}
