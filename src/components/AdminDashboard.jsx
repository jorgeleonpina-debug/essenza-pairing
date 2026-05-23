import { useState } from "react";

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
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
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
    approved: { label: "Aprobado", bg: "rgba(45,74,30,0.6)", color: "#6fcf97" },
    pending: { label: "Pendiente", bg: "rgba(180,140,0,0.2)", color: "#f2c94c" },
    failed: { label: "Fallido", bg: "rgba(180,0,0,0.2)", color: "#eb5757" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`, borderRadius: 20, fontSize: 10, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px" }}>
      {s.label}
    </span>
  );
};

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [savedPw, setSavedPw] = useState("");

  const fetchData = async (pw) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cargar datos");
      setData(json);
      setIsLoggedIn(true);
    } catch (err) {
      if (err.message === "Contraseña incorrecta") setAuthError(err.message);
      else setFetchError(err.message);
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
            onChange={(e) => { setPassword(e.target.value); setAuthError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Contraseña de acceso"
            style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: `1px solid ${authError ? "rgba(248,113,113,0.6)" : "rgba(201,168,76,0.25)"}`, borderRadius: 9, color: COLORS.cream, fontFamily: "'Lora', serif", fontSize: 14, padding: "12px 16px", outline: "none", marginBottom: authError ? 8 : 20 }}
          />
          {authError && <p style={{ color: "#f87171", fontSize: 12, fontFamily: "'Lora', serif", textAlign: "left", marginBottom: 14 }}>{authError}</p>}
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
        tr:hover td { background: rgba(45,74,30,0.12); }
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
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
