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
  { id: 1, name: "Aceite Extra Virgen", volume: "250ml",                   price: "$2.490",  badge: null,             image: "/images/bottle-250ml.jpeg" },
  { id: 2, name: "Aceite Extra Virgen", volume: "1L",                      price: "$14.990", badge: "Más vendido",    image: "/images/bottle-1l.jpeg" },
  { id: 3, name: "Bidón Extra Virgen",  volume: "5L",                      price: "$32.990", badge: null,             image: "/images/bidon-5l.jpeg" },
  { id: 4, name: "Pack Completo",       volume: "Aceite + Aceto Balsámico", price: "$47.990", badge: "Oferta especial", image: "/images/pack-completo.jpeg" },
];

const LoadingDots = () => (
  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: COLORS.gold,
          animation: "pulse 1.2s ease-in-out " + (i * 0.2) + "s infinite",
        }}
      />
    ))}
  </span>
);

const CompatibilityMeter = ({ value }) => {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 2;
      if (start <= value) {
        setDisplayed(start);
        requestAnimationFrame(step);
      } else {
        setDisplayed(value);
      }
    };
    requestAnimationFrame(step);
  }, [value]);

  const color =
    displayed >= 90 ? COLORS.goldLight : displayed >= 80 ? COLORS.gold : "#a07a2e";

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Afinidad con Essenza
        </span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
          {displayed}<span style={{ fontSize: 16, opacity: 0.7 }}>%</span>
        </span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: displayed + "%", background: "linear-gradient(90deg,#3d6229,#c9a84c)", borderRadius: 2, transition: "width 0.05s linear" }} />
      </div>
    </div>
  );
};

const ResultCard = ({ data }) => {
  const items = [
    { label: "Momento de uso", value: data.momento, icon: "⏱️" },
    { label: "Técnica", value: data.tecnica, icon: "🫒" },
    { label: "Maridaje sugerido", value: data.maridaje, icon: "🍷" },
    { label: "Consejo del chef", value: data.consejo_chef, icon: "👨‍🍳" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.6s ease forwards", background: "rgba(45, 74, 30, 0.25)", border: "1px solid rgba(201, 168, 76, 0.3)", borderRadius: 16, padding: "32px 28px", marginTop: 24 }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{data.emoji_plato}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: "0.02em" }}>
          {data.titulo}
        </h2>
      </div>
      <CompatibilityMeter value={data.compatibilidad} />
      <p style={{ fontFamily: "'Lora', serif", color: "rgba(245, 240, 232, 0.85)", fontSize: 15, lineHeight: 1.8, marginBottom: 24, fontStyle: "italic", borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16 }}>
        {data.descripcion}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item) => (
          <div key={item.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
                {item.label}
              </span>
            </div>
            <p style={{ fontFamily: "'Lora', serif", color: COLORS.cream, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, textAlign: "center", paddingTop: 20, borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(201,168,76,0.6)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
          Essenza Chile · Extra Virgen · Prensado en Frío
        </p>
      </div>
    </div>
  );
};

const ProductImage = ({ src, alt }) => {
  const [error, setError] = useState(false);
  return (
    <div style={{ width: 90, height: 90, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {!error ? (
        <img src={src} alt={alt} onError={() => setError(true)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      ) : (
        <span style={{ fontSize: 36 }}>🫒</span>
      )}
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
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("No init_point:", data);
        setBuying(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setBuying(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? "rgba(45,74,30,0.35)" : "rgba(45,74,30,0.18)",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.2)"}`,
        borderRadius: 14,
        padding: "28px 20px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "all 0.3s ease",
      }}
    >
      {product.badge && (
        <div style={{
          position: "absolute",
          top: -11,
          left: "50%",
          transform: "translateX(-50%)",
          background: COLORS.gold,
          color: COLORS.black,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "3px 12px",
          borderRadius: 20,
          whiteSpace: "nowrap",
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          {product.badge}
        </div>
      )}

      <ProductImage src={product.image} alt={product.name} />

      <div style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 17, fontWeight: 600, marginBottom: 4, lineHeight: 1.2 }}>
        {product.name}
      </div>
      <div style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.45)", fontSize: 13, fontStyle: "italic", marginBottom: 18 }}>
        {product.volume}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.goldLight, fontSize: 26, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}>
        {product.price}
      </div>

      <button
        onClick={handleComprar}
        disabled={buying}
        style={{
          background: buying ? "rgba(45,74,30,0.3)" : `linear-gradient(135deg, ${COLORS.darkGreen}, ${COLORS.darkGreenLight})`,
          border: `1px solid ${buying ? "rgba(201,168,76,0.25)" : COLORS.gold}`,
          borderRadius: 8,
          color: buying ? "rgba(201,168,76,0.35)" : COLORS.gold,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          padding: "10px 0",
          cursor: buying ? "default" : "pointer",
          width: "100%",
          transition: "all 0.25s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {buying ? <><LoadingDots /><span>Redirigiendo...</span></> : "Comprar"}
      </button>
    </div>
  );
};

const ProductStore = () => (
  <div style={{ maxWidth: 860, margin: "72px auto 0", padding: "0 20px" }}>
    <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: 60 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.35em", color: COLORS.gold, textTransform: "uppercase", marginBottom: 10, opacity: 0.8 }}>
          Nuestra Tienda
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 32, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.1 }}>
          Lleva Essenza a tu cocina
        </h2>
        <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.4)", fontSize: 14, fontStyle: "italic", margin: 0 }}>
          100% chileno · Prensado en frío · Máximo 0.3% acidez
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
        {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      <div style={{ textAlign: "center", marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.5 }}>
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 110 10A5 5 0 018 3zm-.5 2v4l3 1.5.5-.87L8.5 8.3V5h-1z" fill="#009ee3"/>
        </svg>
        <span style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.3)", fontSize: 12, fontStyle: "italic" }}>
          Pago seguro con
        </span>
        <span style={{ color: "#009ee3", fontWeight: 700, fontSize: 12, opacity: 0.7 }}>
          Mercado Pago Chile
        </span>
      </div>
    </div>
  </div>
);

const Logo = () => {
  const [imgError, setImgError] = useState(false);
  return (
    <div style={{ background: `linear-gradient(135deg, ${COLORS.darkGreen}, rgba(45,74,30,0.6))`, border: "1px solid rgba(201,168,76,0.4)", borderRadius: "50%", width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", overflow: "hidden" }}>
      {!imgError ? (
        <img
          src="/images/logo.jpeg"
          alt="Essenza Chile"
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: 32 }}>🫒</span>
      )}
    </div>
  );
};

export default function EssenzaPairingAI() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const suggestions = [
    "Pulpo a la gallega",
    "Ensalada caprese",
    "Lomo de merluza al horno",
    "Pasta al pesto",
    "Pan artesanal tostado",
    "Ceviche chileno",
  ];

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      if (parsed.error) {
        setError(parsed.error);
      } else {
        setResult(parsed);
      }
    } catch {
      setError("Algo salió mal. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.black}; }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        textarea:focus { outline: none; }
        textarea::placeholder { color: rgba(245,240,232,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `radial-gradient(ellipse at 20% 0%, rgba(45,74,30,0.4) 0%, transparent 60%),
                       radial-gradient(ellipse at 80% 100%, rgba(201,168,76,0.08) 0%, transparent 50%),
                       ${COLORS.black}`,
          fontFamily: "'Cormorant Garamond', serif",
          padding: "0 0 80px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", padding: "52px 24px 40px", borderBottom: "1px solid rgba(201,168,76,0.1)", marginBottom: 40 }}>
          <Logo />
          <div style={{ fontSize: 10, letterSpacing: "0.35em", color: COLORS.gold, textTransform: "uppercase", marginBottom: 10, opacity: 0.8 }}>
            Essenza Chile
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 700, color: COLORS.cream, lineHeight: 1.1, marginBottom: 12, background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.goldLight} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Pairing AI
          </h1>
          <p style={{ fontFamily: "'Lora', serif", color: "rgba(245,240,232,0.5)", fontSize: 15, fontStyle: "italic", maxWidth: 320, margin: "0 auto", lineHeight: 1.6 }}>
            Descubre cómo nuestro aceite extra virgen chileno eleva cada plato
          </p>
        </div>

        {/* Pairing tool */}
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ background: "rgba(45,74,30,0.15)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, letterSpacing: "0.25em", color: COLORS.gold, textTransform: "uppercase", marginBottom: 12, opacity: 0.9 }}>
              ¿Qué vas a preparar?
            </label>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe un plato o ingredientes..."
              rows={3}
              style={{ width: "100%", background: "transparent", border: "none", color: COLORS.cream, fontFamily: "'Lora', serif", fontSize: 16, lineHeight: 1.7, resize: "none" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || loading}
                style={{
                  background: input.trim() && !loading ? `linear-gradient(135deg, ${COLORS.darkGreen}, ${COLORS.darkGreenLight})` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${input.trim() && !loading ? COLORS.gold : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8,
                  color: input.trim() && !loading ? COLORS.gold : "rgba(255,255,255,0.2)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "10px 22px",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {loading ? <><span>Analizando</span><LoadingDots /></> : "Descubrir maridaje"}
              </button>
            </div>
          </div>

          {!result && !loading && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(201,168,76,0.4)", textTransform: "uppercase", marginBottom: 10 }}>
                Sugerencias
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, color: "rgba(245,240,232,0.5)", fontFamily: "'Lora', serif", fontSize: 13, padding: "6px 14px", cursor: "pointer", fontStyle: "italic", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; e.target.style.color = COLORS.cream; }}
                    onMouseLeave={(e) => { e.target.style.borderColor = "rgba(201,168,76,0.2)"; e.target.style.color = "rgba(245,240,232,0.5)"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(180,50,50,0.15)", border: "1px solid rgba(180,50,50,0.3)", borderRadius: 10, padding: "14px 18px", marginTop: 16, color: "#f87171", fontFamily: "'Lora', serif", fontSize: 14, fontStyle: "italic" }}>
              {error}
            </div>
          )}

          {result && <ResultCard data={result} />}

          {result && (
            <button
              onClick={() => { setResult(null); setInput(""); setError(null); }}
              style={{ display: "block", margin: "20px auto 0", background: "transparent", border: "none", color: "rgba(201,168,76,0.4)", fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", padding: "8px 16px" }}
            >
              ← Nuevo maridaje
            </button>
          )}
        </div>

        {/* Product store */}
        <ProductStore />
      </div>
    </>
  );
}
