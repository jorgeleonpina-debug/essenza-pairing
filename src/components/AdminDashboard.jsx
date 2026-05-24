import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Tooltip, Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Filler);

const COLORS = {
  darkGreen: "#0d2214",
  darkGreenLight: "#2d4a1e",
  gold: "#c9a84c",
  goldLight: "#e8c46a",
  black: "#111111",
  cream: "#f5f0e8",
};

const formatCLP = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;
const formatDate = (d) =>
  new Date(d).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

function exportCSV(orders) {
  const headers = [
    "ID", "Fecha", "Cliente", "Email", "Teléfono",
    "Productos", "Subtotal", "Despacho", "Total",
    "Región", "Comuna", "Dirección", "Documento", "RUT", "Razón Social",
    "Payment ID", "Estado",
  ];

  const rows = orders.map((o) => {
    const items = (o.items || [])
      .map((i) => `${i.name || i.title || "Producto"} x${i.quantity || 1}`)
      .join(" | ");
    return [
      o.id,
      formatDate(o.created_at),
      o.customers?.name || "",
      o.customers?.email || "",
      o.customers?.phone || "",
      items,
      o.subtotal || 0,
      o.shipping_cost || 0,
      o.total || 0,
      o.region || "",
      o.commune || "",
      o.address || "",
      o.document_type || "",
      o.rut || "",
      o.razon_social || "",
      o.payment_id || "",
      o.payment_status || "",
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";");
  });

  const csv = ["sep=;", headers.join(";"), ...rows].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `essenza-ordenes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const StatCard = ({ label, value, sub }) => (
  <div style={{
    background: "rgba(45,74,30,0.25)", border: "1px solid rgba(201,168,76,0.22)",
    borderRadius: 14, padding: "22px 24px",
  }}>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.26em", color: "rgba(201,168,76,0.6)", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: COLORS.goldLight, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontFamily: "'Lora', serif", fontSize: 11, color: "rgba(245,240,232,0.35)", marginTop: 6, fontStyle: "italic" }}>{sub}</div>}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    aprobado:  { label: "Aprobado",  bg: "rgba(45,74,30,0.5)",   color: "#6fcf97" },
    enviado:   { label: "Enviado",   bg: "rgba(20,120,60,0.45)", color: "#2ecc71" },
    pendiente: { label: "Pendiente", bg: "rgba(180,140,0,0.2)",  color: "#f2c94c" },
    cancelado: { label: "Cancelado", bg: "rgba(180,0,0,0.2)",    color: "#eb5757" },
    approved:  { label: "Aprobado",  bg: "rgba(45,74,30,0.5)",   color: "#6fcf97" },
    pending:   { label: "Pendiente", bg: "rgba(180,140,0,0.2)",  color: "#f2c94c" },
    failed:    { label: "Fallido",   bg: "rgba(180,0,0,0.2)",    color: "#eb5757" },
  };
  const s = map[status] || map.pendiente;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`, borderRadius: 20, fontSize: 10, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px" }}>
      {s.label}
    </span>
  );
};

const PERIODS = [
  { key: "7d",    label: "Últimos 7 días" },
  { key: "30d",   label: "Últimos 30 días" },
  { key: "month", label: "Este mes" },
];

function SalesChart({ orders }) {
  const [period, setPeriod] = useState("30d");

  const { labels, values } = useMemo(() => {
    const now = new Date();
    const days = [];

    if (period === "7d") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now); d.setDate(now.getDate() - i); days.push(d);
      }
    } else if (period === "30d") {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now); d.setDate(now.getDate() - i); days.push(d);
      }
    } else {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const count = now.getDate();
      for (let i = 0; i < count; i++) {
        const d = new Date(first); d.setDate(1 + i); days.push(d);
      }
    }

    const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const totals = {};
    for (const o of orders) {
      const k = toKey(new Date(o.created_at));
      totals[k] = (totals[k] || 0) + (o.total || 0);
    }

    const labels = days.map((d) =>
      d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" })
    );
    const values = days.map((d) => totals[toKey(d)] || 0);
    return { labels, values };
  }, [orders, period]);

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: "rgba(201,168,76,0.25)",
      borderColor: "#c9a84c",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
      hoverBackgroundColor: "rgba(232,196,106,0.45)",
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0d2214",
        borderColor: "rgba(201,168,76,0.4)",
        borderWidth: 1,
        titleColor: "rgba(201,168,76,0.7)",
        bodyColor: "#e8c46a",
        padding: 10,
        callbacks: {
          label: (ctx) => ` $${Number(ctx.raw).toLocaleString("es-CL")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(45,74,30,0.4)", drawBorder: false },
        ticks: { color: "rgba(201,168,76,0.55)", font: { size: 10 }, maxRotation: 45 },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(45,74,30,0.4)", drawBorder: false },
        ticks: {
          color: "rgba(201,168,76,0.55)",
          font: { size: 10 },
          callback: (v) => v === 0 ? "$0" : `$${(v / 1000).toFixed(0)}k`,
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ background: COLORS.darkGreen, border: "1px solid rgba(201,168,76,0.18)", borderRadius: 16, padding: "22px 24px 20px", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.28em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", marginBottom: 4 }}>Evolución</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 20, fontWeight: 600, margin: 0 }}>Ventas diarias</h2>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              style={{
                background: period === p.key ? "rgba(201,168,76,0.18)" : "transparent",
                border: `1px solid ${period === p.key ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.18)"}`,
                borderRadius: 7,
                color: period === p.key ? COLORS.gold : "rgba(201,168,76,0.45)",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}

function ShipModal({ order, savedPw, onClose, onShipped }) {
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ship-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          trackingNumber: tracking.trim() || null,
          customerEmail: order.customers?.email,
          customerName: order.customers?.name,
          password: savedPw,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      onShipped();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.darkGreen, border: "1px solid rgba(201,168,76,0.35)", borderRadius: 18, width: "100%", maxWidth: 420, padding: "32px 32px 28px", position: "relative" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", marginBottom: 8 }}>Marcar como enviado</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>{order.customers?.name || "Cliente"}</h3>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 12, color: "rgba(201,168,76,0.5)", margin: "0 0 24px" }}>{order.customers?.email}</p>

        <label style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 9, letterSpacing: "0.24em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
          Número de tracking <span style={{ color: "rgba(245,240,232,0.3)" }}>(opcional)</span>
        </label>
        <input
          type="text"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Ej: CL123456789"
          style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 8, color: COLORS.cream, fontFamily: "monospace", fontSize: 14, padding: "10px 14px", outline: "none", boxSizing: "border-box", marginBottom: error ? 8 : 20 }}
        />
        {error && <p style={{ color: "#f87171", fontSize: 12, fontFamily: "'Lora', serif", margin: "0 0 14px" }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "rgba(245,240,232,0.45)", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", padding: "11px 0", cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={confirm} disabled={loading} style={{ flex: 2, background: loading ? "rgba(46,204,113,0.3)" : "rgba(46,204,113,0.18)", border: "1px solid rgba(46,204,113,0.5)", borderRadius: 8, color: "#2ecc71", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", padding: "11px 0", cursor: loading ? "default" : "pointer" }}>
            {loading ? "Enviando..." : "Confirmar envío →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderModal({ order, onClose }) {
  if (!order) return null;
  const c = order.customers || {};
  const docLabel = order.document_type === "factura" ? "Factura" : "Boleta";

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: COLORS.darkGreen, border: "1px solid rgba(201,168,76,0.35)", borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", position: "relative" }}
      >
        {/* Modal header */}
        <div style={{ padding: "24px 28px 18px", borderBottom: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", marginBottom: 6 }}>Pedido</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 18, fontWeight: 600, lineHeight: 1 }}>
              {c.name || "Cliente"}
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 11, color: "rgba(201,168,76,0.5)", marginTop: 4 }}>
              {formatDate(order.created_at)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "rgba(245,240,232,0.5)", fontSize: 16, lineHeight: 1, padding: "6px 10px", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Customer */}
          <Section title="Cliente">
            <Row label="Nombre" value={c.name || "—"} />
            <Row label="Email" value={c.email || "—"} />
            <Row label="Teléfono" value={c.phone || "—"} />
          </Section>

          {/* Address */}
          <Section title="Dirección de despacho">
            <Row label="Dirección" value={order.address || "—"} />
            <Row label="Comuna" value={order.commune || "—"} />
            <Row label="Región" value={order.region || "—"} />
          </Section>

          {/* Tax document */}
          <Section title="Documento tributario">
            <Row label="Tipo" value={docLabel} />
            {order.document_type === "factura" && (
              <>
                <Row label="RUT" value={order.rut || "—"} />
                <Row label="Razón social" value={order.razon_social || "—"} />
              </>
            )}
          </Section>

          {/* Products */}
          <Section title="Productos">
            {(order.items || []).length === 0 ? (
              <span style={{ fontFamily: "'Lora', serif", fontSize: 13, color: "rgba(245,240,232,0.4)", fontStyle: "italic" }}>Sin detalle</span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(order.items || []).map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Lora', serif", fontSize: 13, color: "rgba(245,240,232,0.8)" }}>
                      {item.name || item.title || "Producto"}{item.quantity > 1 ? ` × ${item.quantity}` : ""}
                    </span>
                    {item.price && (
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: COLORS.gold }}>
                        {formatCLP(item.price * (item.quantity || 1))}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Totals */}
          <Section title="Resumen de pago">
            <Row label="Subtotal" value={formatCLP(order.subtotal)} />
            <Row label="Despacho" value={order.shipping_cost > 0 ? formatCLP(order.shipping_cost) : "Gratis"} />
            <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.2em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase" }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: COLORS.goldLight }}>{formatCLP(order.total)}</span>
            </div>
          </Section>

          {/* Status & payment */}
          <Section title="Estado del pedido">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.2em", color: "rgba(245,240,232,0.45)", textTransform: "uppercase" }}>Estado</span>
              <StatusBadge status={order.payment_status} />
            </div>
            {order.payment_id && <Row label="Payment ID" value={order.payment_id} mono />}
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 9, letterSpacing: "0.28em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.18em", color: "rgba(245,240,232,0.4)", textTransform: "uppercase", flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: mono ? "monospace" : "'Lora', serif", fontSize: mono ? 11 : 13, color: "rgba(245,240,232,0.8)", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [savedPw, setSavedPw] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingOrder, setShippingOrder] = useState(null);

  const fetchData = async (pw) => {
    setLoading(true);
    setFetchError("");
    setAuthError("");
    try {
      const res = await fetch("/api/admin-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      let json;
      try { json = await res.json(); } catch { json = {}; }
      if (res.status === 401) {
        setAuthError("Contraseña incorrecta");
        return;
      }
      if (!res.ok) throw new Error(json.error || `Error del servidor (${res.status})`);
      setData(json);
      setIsLoggedIn(true);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (!password.trim()) return;
    setSavedPw(password);
    fetchData(password);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lora:ital@0;1&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          input::placeholder { color: rgba(245,240,232,0.25); }
        `}</style>
        <div style={{ background: COLORS.darkGreen, border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, padding: "48px 44px", width: "100%", maxWidth: 380, textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.35em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", marginBottom: 14 }}>Panel Administrativo</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 34, fontWeight: 400, marginBottom: 36, lineHeight: 1 }}>Essenza</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setAuthError(""); setFetchError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Contraseña de acceso"
            style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: `1px solid ${(authError || fetchError) ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)"}`, borderRadius: 9, color: COLORS.cream, fontFamily: "'Lora', serif", fontSize: 14, padding: "12px 16px", outline: "none", marginBottom: (authError || fetchError) ? 8 : 20 }}
          />
          {authError && <p style={{ color: "#f87171", fontSize: 12, fontFamily: "'Lora', serif", textAlign: "left", marginBottom: 14 }}>{authError}</p>}
          {fetchError && <p style={{ color: "#f87171", fontSize: 12, fontFamily: "'Lora', serif", textAlign: "left", marginBottom: 14 }}>{fetchError}</p>}
          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", background: loading ? "rgba(201,168,76,0.4)" : COLORS.gold, border: "none", borderRadius: 9, color: COLORS.black, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.24em", textTransform: "uppercase", padding: "14px 0", cursor: loading ? "default" : "pointer" }}>
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </div>
      </div>
    );
  }

  const { orders = [], customerCount, newsletterCount, salesToday, salesWeek, salesMonth } = data || {};

  return (
    <div style={{ minHeight: "100vh", background: COLORS.black, color: COLORS.cream }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lora:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }
        table { border-collapse: collapse; width: 100%; }
        th { font-family: 'Cormorant Garamond', serif; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(201,168,76,0.6); padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(201,168,76,0.12); white-space: nowrap; }
        td { font-family: 'Lora', serif; font-size: 13px; color: rgba(245,240,232,0.8); padding: 12px 14px; border-bottom: 1px solid rgba(201,168,76,0.07); vertical-align: top; }
        tr.clickable-row { cursor: pointer; }
        tr.clickable-row:hover td { background: rgba(45,74,30,0.25); }
      `}</style>

      {/* Header */}
      <div style={{ background: COLORS.darkGreen, borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "0 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.gold, fontSize: 22, fontWeight: 400, letterSpacing: "0.06em" }}>Essenza</span>
            <span style={{ color: "rgba(201,168,76,0.3)", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.28em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase" }}>Admin</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => fetchData(savedPw)} style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 8, color: "rgba(201,168,76,0.65)", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", padding: "7px 16px", cursor: "pointer" }}>
              Actualizar
            </button>
            <button onClick={() => exportCSV(orders)} style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.35)", borderRadius: 8, color: COLORS.gold, fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", padding: "7px 16px", cursor: "pointer" }}>
              Exportar CSV
            </button>
            <button onClick={() => { setIsLoggedIn(false); setData(null); setPassword(""); }} style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 8, color: "rgba(245,240,232,0.35)", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", padding: "7px 16px", cursor: "pointer" }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 32px" }}>

        {fetchError && (
          <div style={{ background: "rgba(180,0,0,0.15)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 28, color: "#f87171", fontFamily: "'Lora', serif", fontSize: 13 }}>
            Error: {fetchError}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 36 }}>
          <StatCard label="Ventas hoy" value={formatCLP(salesToday)} sub="Día actual" />
          <StatCard label="Ventas semana" value={formatCLP(salesWeek)} sub="Últimos 7 días" />
          <StatCard label="Ventas mes" value={formatCLP(salesMonth)} sub="Mes actual" />
          <StatCard label="Clientes" value={customerCount?.toLocaleString("es-CL") || "0"} sub="Total registrados" />
          <StatCard label="Newsletter" value={newsletterCount?.toLocaleString("es-CL") || "0"} sub="Suscriptores" />
        </div>

        {/* Sales chart */}
        <SalesChart orders={orders} />

        {/* Orders table */}
        <div style={{ background: COLORS.darkGreen, border: "1px solid rgba(201,168,76,0.18)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.28em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", marginBottom: 4 }}>Registro</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 20, fontWeight: 600 }}>
                Pedidos recientes <span style={{ color: "rgba(201,168,76,0.45)", fontSize: 15, fontWeight: 400 }}>({orders.length})</span>
              </h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", color: "rgba(245,240,232,0.3)", fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 14 }}>
              Aún no hay pedidos registrados
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Región</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="clickable-row" onClick={() => setSelectedOrder(order)}>
                      <td style={{ whiteSpace: "nowrap", color: "rgba(245,240,232,0.5)", fontSize: 12 }}>
                        {formatDate(order.created_at)}
                      </td>
                      <td>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.cream, fontSize: 14, fontWeight: 600 }}>
                          {order.customers?.name || "—"}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(201,168,76,0.5)", marginTop: 2 }}>
                          {order.customers?.email || ""}
                        </div>
                      </td>
                      <td style={{ maxWidth: 280 }}>
                        {(order.items || []).map((item, i) => (
                          <div key={i} style={{ fontSize: 12, color: "rgba(245,240,232,0.65)", lineHeight: 1.6 }}>
                            {item.name || item.title || "Producto"}{item.quantity > 1 ? ` × ${item.quantity}` : ""}
                          </div>
                        ))}
                      </td>
                      <td>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.goldLight, fontSize: 16, fontWeight: 700 }}>
                          {formatCLP(order.total)}
                        </span>
                        {order.shipping_cost > 0 && (
                          <div style={{ fontSize: 11, color: "rgba(245,240,232,0.35)", marginTop: 2 }}>
                            + {formatCLP(order.shipping_cost)} despacho
                          </div>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={order.payment_status} />
                      </td>
                      <td style={{ color: "rgba(245,240,232,0.5)", fontSize: 12 }}>
                        <div>{order.region || "—"}</div>
                        {order.commune && <div style={{ marginTop: 2 }}>{order.commune}</div>}
                      </td>
                      <td onClick={(e) => e.stopPropagation()} style={{ whiteSpace: "nowrap" }}>
                        {order.payment_status !== "enviado" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShippingOrder(order); }}
                            style={{ background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.35)", borderRadius: 7, color: "#2ecc71", fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}
                          >
                            Enviar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      {shippingOrder && (
        <ShipModal
          order={shippingOrder}
          savedPw={savedPw}
          onClose={() => setShippingOrder(null)}
          onShipped={() => { setShippingOrder(null); fetchData(savedPw); }}
        />
      )}
    </div>
  );
}
