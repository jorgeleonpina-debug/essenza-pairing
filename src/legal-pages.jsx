import { useEffect } from "react";

const COLORS = {
  darkGreen: "#0d2214",
  gold: "#c9a84c",
  cream: "#f5f0e8",
};

const IconArrowLeft = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const LegalHeader = ({ title }) => {
  const [logoError, setLogoError] = require("react").useState(false);
  return (
    <header style={{ background: COLORS.darkGreen, borderBottom: "1px solid rgba(201,168,76,0.18)", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, height: 64 }}>
        <a href="/" style={{ color: "rgba(201,168,76,0.6)", display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.15em", transition: "color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.gold; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(201,168,76,0.6)"; }}>
          <IconArrowLeft />
          <span>Volver</span>
        </a>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(201,168,76,0.35)", flexShrink: 0 }}>
            {!logoError
              ? <img src="/images/logo-original.png" alt="Essenza Chile" onError={() => setLogoError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>🫒</span>}
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 18, letterSpacing: "0.1em" }}>Essenza Chile</span>
        </div>
        <div style={{ width: 80 }} />
      </div>
    </header>
  );
};

const GoldDivider = () => (
  <div style={{ borderTop: "1px solid rgba(201,168,76,0.25)", margin: "32px 0" }} />
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 20, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 12, marginTop: 0 }}>
    {children}
  </h2>
);

const LegalBody = ({ pageTitle, children }) => (
  <div style={{ background: COLORS.darkGreen, minHeight: "100vh", fontFamily: "'Lora', serif" }}>
    <LegalHeader />
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 32, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8, marginTop: 0 }}>
        {pageTitle}
      </h1>
      <div style={{ borderTop: `2px solid ${COLORS.gold}`, width: 48, marginBottom: 40 }} />
      <div style={{ color: "rgba(245,240,232,0.82)", fontSize: 15, lineHeight: 1.9 }}>
        {children}
      </div>
    </main>
    <footer style={{ background: "#0a1a0f", borderTop: "1px solid rgba(201,168,76,0.12)", padding: "20px 24px", textAlign: "center" }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(201,168,76,0.35)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
        © 2025 Premium Olive Chile SpA. Todos los derechos reservados.
      </p>
    </footer>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
    <span style={{ color: COLORS.gold, flexShrink: 0, minWidth: 8 }}>·</span>
    <span><strong style={{ color: COLORS.cream }}>{label}:</strong> {value}</span>
  </div>
);

const BulletItem = ({ children }) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
    <span style={{ color: COLORS.gold, flexShrink: 0 }}>·</span>
    <span>{children}</span>
  </div>
);

// ── 1. Políticas de Despacho y Devolución ──────────────────────────────────────
export function PoliticasDespacho() {
  useEffect(() => { document.title = "Políticas de Despacho y Devolución - Essenza Chile"; }, []);
  return (
    <LegalBody pageTitle="Políticas de Despacho y Devolución">
      <SectionTitle>Despacho a todo Chile</SectionTitle>
      <p>Realizamos envíos a todo el territorio nacional mediante las empresas de transporte <strong style={{ color: COLORS.cream }}>Starken</strong> y <strong style={{ color: COLORS.cream }}>Chilexpress</strong>.</p>

      <GoldDivider />

      <SectionTitle>Tiempos y costos de envío</SectionTitle>
      <InfoRow label="Región Metropolitana" value="3–5 días hábiles · $3.990" />
      <InfoRow label="Resto de Chile" value="5–7 días hábiles · $5.990" />
      <InfoRow label="Regiones extremas (Arica, Magallanes, Aysén)" value="7–10 días hábiles · $7.990" />
      <p style={{ marginTop: 16, color: "rgba(245,240,232,0.55)", fontSize: 13 }}>
        Los plazos son estimativos y pueden variar según disponibilidad del courier. No incluimos despachos los días sábado, domingo ni festivos.
      </p>

      <GoldDivider />

      <SectionTitle>Política de Devoluciones</SectionTitle>
      <BulletItem>Devoluciones aceptadas dentro de <strong style={{ color: COLORS.cream }}>10 días corridos</strong> desde la fecha de recepción del producto.</BulletItem>
      <BulletItem>El producto debe encontrarse <strong style={{ color: COLORS.cream }}>sin abrir</strong> y en su <strong style={{ color: COLORS.cream }}>empaque original</strong> en perfecto estado.</BulletItem>
      <BulletItem>No se aceptan devoluciones de productos abiertos o que hayan sido utilizados, salvo que presenten defectos de fabricación.</BulletItem>
      <BulletItem>El costo del envío de retorno es responsabilidad del comprador, excepto en casos de producto defectuoso o error en el despacho.</BulletItem>

      <GoldDivider />

      <SectionTitle>Contacto para Devoluciones</SectionTitle>
      <p>Para iniciar el proceso de devolución, contáctanos a:<br />
        <a href="mailto:contacto@premiumolivechile.com" style={{ color: COLORS.gold, textDecoration: "none" }}>contacto@premiumolivechile.com</a>
      </p>
      <p style={{ fontSize: 13, color: "rgba(245,240,232,0.5)" }}>Incluye tu número de orden y descripción del motivo de devolución.</p>
    </LegalBody>
  );
}

// ── 2. Términos y Condiciones ──────────────────────────────────────────────────
export function TerminosCondiciones() {
  useEffect(() => { document.title = "Términos y Condiciones - Essenza Chile"; }, []);
  return (
    <LegalBody pageTitle="Términos y Condiciones">
      <SectionTitle>Información de la Empresa</SectionTitle>
      <InfoRow label="Razón social" value="Premium Olive Chile SpA" />
      <InfoRow label="Giro" value="Comercio al por menor de alimentos" />

      <GoldDivider />

      <SectionTitle>Uso del Sitio Web</SectionTitle>
      <BulletItem>El presente sitio web es de uso exclusivo para personas <strong style={{ color: COLORS.cream }}>mayores de 18 años</strong>.</BulletItem>
      <BulletItem>Todos los precios publicados están expresados en <strong style={{ color: COLORS.cream }}>pesos chilenos (CLP)</strong> e incluyen IVA.</BulletItem>
      <BulletItem>Essenza Chile se reserva el derecho de <strong style={{ color: COLORS.cream }}>modificar precios sin previo aviso</strong>. El precio vigente al momento de la compra es el que aplica.</BulletItem>
      <BulletItem>Las imágenes de productos son referenciales y pueden diferir levemente del producto final.</BulletItem>

      <GoldDivider />

      <SectionTitle>Propiedad Intelectual</SectionTitle>
      <p>La marca <strong style={{ color: COLORS.cream }}>Essenza</strong>, el logotipo y todas las imágenes y contenidos publicados en este sitio web son propiedad exclusiva de <strong style={{ color: COLORS.cream }}>Premium Olive Chile SpA</strong>. Queda prohibida su reproducción, distribución o uso con fines comerciales sin autorización expresa y por escrito.</p>

      <GoldDivider />

      <SectionTitle>Legislación Aplicable</SectionTitle>
      <p>Las presentes condiciones se rigen íntegramente por la <strong style={{ color: COLORS.cream }}>legislación chilena</strong>. Para cualquier controversia derivada del uso de este sitio o de transacciones realizadas en él, las partes se someten a la jurisdicción de los <strong style={{ color: COLORS.cream }}>tribunales ordinarios de Santiago de Chile</strong>.</p>
    </LegalBody>
  );
}

// ── 3. Política de Reembolso ───────────────────────────────────────────────────
export function PoliticaReembolso() {
  useEffect(() => { document.title = "Política de Reembolso - Essenza Chile"; }, []);
  return (
    <LegalBody pageTitle="Política de Reembolso">
      <SectionTitle>Cuándo aplica un reembolso</SectionTitle>
      <BulletItem>Recibirás un <strong style={{ color: COLORS.cream }}>reembolso total</strong> si el producto llega dañado, en mal estado o si recibiste un artículo equivocado.</BulletItem>
      <BulletItem>El plazo máximo para solicitar el reembolso es de <strong style={{ color: COLORS.cream }}>48 horas</strong> desde la recepción del pedido.</BulletItem>
      <BulletItem>No se aceptan reembolsos por cambio de opinión una vez que el pedido ha sido despachado.</BulletItem>

      <GoldDivider />

      <SectionTitle>Proceso de Reembolso</SectionTitle>
      <BulletItem>Una vez validada tu solicitud, el reembolso se realizará mediante <strong style={{ color: COLORS.cream }}>transferencia bancaria</strong> a la cuenta que nos indiques.</BulletItem>
      <BulletItem>El plazo de acreditación es de <strong style={{ color: COLORS.cream }}>5 a 10 días hábiles</strong> desde la aprobación del reembolso.</BulletItem>
      <BulletItem>Para iniciar el proceso, adjunta fotografías del producto recibido junto con tu número de orden.</BulletItem>

      <GoldDivider />

      <SectionTitle>Contacto para Reembolsos</SectionTitle>
      <p>Escríbenos a:<br />
        <a href="mailto:contacto@premiumolivechile.com" style={{ color: COLORS.gold, textDecoration: "none" }}>contacto@premiumolivechile.com</a>
      </p>
      <p style={{ fontSize: 13, color: "rgba(245,240,232,0.5)" }}>Respondemos en un máximo de 2 días hábiles.</p>
    </LegalBody>
  );
}

// ── 4. Política de Privacidad ──────────────────────────────────────────────────
export function PoliticaPrivacidad() {
  useEffect(() => { document.title = "Política de Privacidad y Uso de Datos - Essenza Chile"; }, []);
  return (
    <LegalBody pageTitle="Política de Privacidad y Uso de Datos">
      <SectionTitle>Responsable del Tratamiento de Datos</SectionTitle>
      <p><strong style={{ color: COLORS.cream }}>Premium Olive Chile SpA</strong> es el responsable del tratamiento de los datos personales recopilados a través de este sitio web.</p>

      <GoldDivider />

      <SectionTitle>Datos que Recopilamos</SectionTitle>
      <BulletItem><strong style={{ color: COLORS.cream }}>Nombre completo</strong></BulletItem>
      <BulletItem><strong style={{ color: COLORS.cream }}>Correo electrónico</strong></BulletItem>
      <BulletItem><strong style={{ color: COLORS.cream }}>Teléfono</strong></BulletItem>
      <BulletItem><strong style={{ color: COLORS.cream }}>Dirección de despacho</strong></BulletItem>

      <GoldDivider />

      <SectionTitle>Uso de los Datos</SectionTitle>
      <BulletItem>Procesamiento y gestión de tus pedidos.</BulletItem>
      <BulletItem>Comunicaciones relacionadas con el estado de tu compra.</BulletItem>
      <BulletItem>Envío de comunicaciones de marketing y promociones, <strong style={{ color: COLORS.cream }}>únicamente con tu consentimiento expreso</strong>.</BulletItem>

      <GoldDivider />

      <SectionTitle>Compromiso de Privacidad</SectionTitle>
      <BulletItem><strong style={{ color: COLORS.cream }}>No vendemos ni cedemos</strong> tus datos personales a terceros bajo ninguna circunstancia.</BulletItem>
      <BulletItem>Tus datos son almacenados con medidas de seguridad adecuadas para proteger su confidencialidad e integridad.</BulletItem>
      <BulletItem>Puedes solicitar la <strong style={{ color: COLORS.cream }}>eliminación o rectificación</strong> de tus datos en cualquier momento.</BulletItem>

      <GoldDivider />

      <SectionTitle>Ejercicio de Derechos</SectionTitle>
      <p>Para solicitar la eliminación, corrección o acceso a tus datos personales, contáctanos a:<br />
        <a href="mailto:contacto@premiumolivechile.com" style={{ color: COLORS.gold, textDecoration: "none" }}>contacto@premiumolivechile.com</a>
      </p>

      <GoldDivider />

      <SectionTitle>Marco Legal</SectionTitle>
      <p>El tratamiento de datos personales se realiza en cumplimiento de la <strong style={{ color: COLORS.cream }}>Ley N° 19.628 sobre Protección de la Vida Privada</strong> (Ley de Protección de Datos Personales de Chile).</p>
    </LegalBody>
  );
}
