import { useState, useMemo, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Tooltip, Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Filler);

const C = {
  negro:   "#0A0A0A",
  negro2:  "#0F130F",
  verde:   "#0D2014",
  verde2:  "#122918",
  verde3:  "#1A3820",
  borde:   "#1C2E1E",
  oro:     "#c9a84c",
  oro2:    "#e8c46a",
  oroDim:  "#7A6530",
  crema:   "#f5f0e8",
  muted:   "rgba(245,240,232,0.45)",
  success: "#2ecc71",
  danger:  "#eb5757",
  warning: "#f2c94c",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lora:ital@0;1&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.25);border-radius:2px}
  input::placeholder{color:rgba(245,240,232,0.2)}
  .adm-layout{display:flex;min-height:100vh;background:#0A0A0A;color:#f5f0e8;font-family:'Lora',serif}
  .adm-sidebar{width:252px;flex-shrink:0;background:#0F130F;border-right:0.5px solid #1C2E1E;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
  .adm-sb-logo{padding:22px 20px 18px;border-bottom:0.5px solid #1C2E1E}
  .adm-sb-logo-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;letter-spacing:5px;text-transform:uppercase;color:#c9a84c}
  .adm-sb-logo-sub{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#7A6530;margin-top:3px}
  .adm-sb-section{padding:16px 16px 6px;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#7A6530}
  .adm-sb-divider{height:0.5px;background:#1C2E1E;margin:8px 16px}
  .adm-sb-item{display:flex;align-items:center;gap:10px;padding:9px 14px;margin:1px 8px;border-radius:3px;cursor:pointer;border-left:2px solid transparent;transition:background 0.15s,border-color 0.15s}
  .adm-sb-item:hover{background:#0D2014}
  .adm-sb-item.active{background:#122918;border-left-color:#c9a84c}
  .adm-sb-item.active .adm-si-label{color:#f5f0e8}
  .adm-sb-item.active .adm-si-icon{color:#c9a84c}
  .adm-si-icon{font-size:15px;color:rgba(245,240,232,0.45);width:18px;flex-shrink:0}
  .adm-si-label{font-size:12px;color:rgba(245,240,232,0.45);flex:1}
  .adm-si-badge{font-size:9px;font-weight:500;min-width:20px;text-align:center;padding:2px 7px;border-radius:10px;background:#1A3820;color:#c9a84c}
  .adm-si-badge.highlight{background:#c9a84c;color:#0A0A0A}
  .adm-si-badge.zero{background:transparent;border:0.5px solid #1C2E1E;color:#7A6530}
  .adm-sb-footer{margin-top:auto;padding:14px;border-top:0.5px solid #1C2E1E}
  .adm-sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0D2014;border-radius:3px;margin-bottom:8px}
  .adm-sb-avatar{width:28px;height:28px;border-radius:50%;background:#7A6530;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#0A0A0A;flex-shrink:0;font-family:'Cormorant Garamond',serif}
  .adm-sb-uname{font-size:12px;color:#f5f0e8}
  .adm-sb-urole{font-size:10px;color:rgba(245,240,232,0.45)}
  .adm-sb-logout{width:100%;padding:9px;background:transparent;border:0.5px solid #1C2E1E;color:rgba(245,240,232,0.45);font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:'Cormorant Garamond',serif;transition:border-color 0.15s,color 0.15s}
  .adm-sb-logout:hover{border-color:#eb5757;color:#eb5757}
  .adm-main{flex:1;display:flex;flex-direction:column;min-width:0}
  .adm-topbar{background:#0F130F;border-bottom:0.5px solid #1C2E1E;padding:0 28px;height:54px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
  .adm-topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;color:#f5f0e8}
  .adm-topbar-title em{font-style:italic;color:#c9a84c}
  .adm-topbar-actions{display:flex;gap:8px}
  .adm-btn{padding:7px 16px;background:transparent;border:0.5px solid #1C2E1E;color:rgba(245,240,232,0.45);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;font-family:'Cormorant Garamond',serif;display:flex;align-items:center;gap:6px;transition:border-color 0.15s,color 0.15s}
  .adm-btn:hover{border-color:#7A6530;color:#c9a84c}
  .adm-btn.primary{background:#c9a84c;color:#0A0A0A;border-color:#c9a84c}
  .adm-btn.primary:hover{background:#e8c46a}
  .adm-btn:disabled{opacity:0.4;cursor:default}
  .adm-content{padding:28px;flex:1}
  .adm-kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
  .adm-kpi{background:#0F130F;border:0.5px solid #1C2E1E;padding:18px 20px}
  .adm-kpi-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#7A6530;margin-bottom:8px;font-family:'Cormorant Garamond',serif}
  .adm-kpi-value{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:#c9a84c;line-height:1}
  .adm-kpi-sub{font-size:11px;color:rgba(245,240,232,0.45);margin-top:5px}
  .adm-sec-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
  .adm-sec-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:300;color:#f5f0e8}
  .adm-sec-count{font-size:12px;color:rgba(245,240,232,0.45);margin-left:8px}
  .adm-table-wrap{background:#0F130F;border:0.5px solid #1C2E1E;overflow:hidden}
  .adm-table-wrap table{border-collapse:collapse;width:100%}
  .adm-table-wrap th{font-family:'Cormorant Garamond',serif;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:#7A6530;padding:11px 14px;text-align:left;border-bottom:0.5px solid #1C2E1E;font-weight:400;white-space:nowrap}
  .adm-table-wrap td{font-family:'Lora',serif;font-size:12px;color:rgba(245,240,232,0.45);padding:11px 14px;border-bottom:0.5px solid #1C2E1E;vertical-align:top}
  .adm-table-wrap tr:last-child td{border-bottom:none}
  .adm-table-wrap tr.clickable:hover td{background:#0D2014;cursor:pointer}
  .td-name{color:#f5f0e8 !important;font-family:'Cormorant Garamond',serif !important;font-size:14px !important}
  .td-price{color:#c9a84c !important;font-family:'Cormorant Garamond',serif !important;font-size:16px !important;font-weight:300 !important}
  .td-empty{text-align:center !important;padding:40px 14px !important;color:rgba(245,240,232,0.2) !important;font-style:italic}
  .adm-info-box{background:#0D2014;border:0.5px solid #1C2E1E;border-left:2px solid #7A6530;padding:14px 18px;margin-bottom:20px;font-size:12px;color:rgba(245,240,232,0.45);line-height:1.7}
  .adm-info-box strong{color:#c9a84c;font-weight:400}
  .adm-chart-wrap{background:#0F130F;border:0.5px solid #1C2E1E;padding:22px 24px;margin-bottom:20px}
  .adm-divider{height:0.5px;background:#1C2E1E;margin:24px 0}
  .adm-status{border-radius:0;font-size:9px;font-family:'Cormorant Garamond',serif;letter-spacing:1.5px;text-transform:uppercase;padding:3px 10px;border:0.5px solid}
`;

const formatCLP = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;
const formatDate = (d) =>
  new Date(d).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

function exportToCSV(rows, filename, headers, mapper) {
  const csvRows = rows.map(mapper);
  const csv = ["sep=;", headers.join(";"), ...csvRows].join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportOrders(orders) {
  exportToCSV(
    orders, "essenza-pedidos",
    ["ID","Fecha","Cliente","Email","Teléfono","Productos","Subtotal","Despacho","Total","Región","Comuna","Dirección","Documento","RUT","Razón Social","Payment ID","Estado"],
    (o) => {
      const items = (o.items || []).map((i) => `${i.name || i.title || "Producto"} x${i.quantity || 1}`).join(" | ");
      return [o.id, formatDate(o.created_at), o.customers?.name||"", o.customers?.email||"", o.customers?.phone||"",
        items, o.subtotal||0, o.shipping_cost||0, o.total||0, o.region||"", o.commune||"",
        o.address||"", o.document_type||"", o.rut||"", o.razon_social||"", o.payment_id||"", o.payment_status||""]
        .map((v) => `"${String(v).replace(/"/g,'""')}"`).join(";");
    }
  );
}

function StatusBadge({ status }) {
  const map = {
    aprobado:  { label:"Aprobado",  color:"#2ecc71" },
    enviado:   { label:"Enviado",   color:"#2ecc71" },
    pendiente: { label:"Pendiente", color:"#f2c94c" },
    cancelado: { label:"Cancelado", color:"#eb5757" },
    approved:  { label:"Aprobado",  color:"#2ecc71" },
    pending:   { label:"Pendiente", color:"#f2c94c" },
    failed:    { label:"Fallido",   color:"#eb5757" },
  };
  const s = map[status] || map.pendiente;
  return (
    <span className="adm-status" style={{ color:s.color, borderColor:s.color+"40", background:s.color+"18" }}>
      {s.label}
    </span>
  );
}

const PERIODS = [
  { key:"7d", label:"7 días" },
  { key:"30d", label:"30 días" },
  { key:"month", label:"Este mes" },
];

function SalesChart({ orders }) {
  const [period, setPeriod] = useState("30d");
  const { labels, values } = useMemo(() => {
    const now = new Date();
    const days = [];
    if (period === "7d") {
      for (let i = 6; i >= 0; i--) { const d = new Date(now); d.setDate(now.getDate()-i); days.push(d); }
    } else if (period === "30d") {
      for (let i = 29; i >= 0; i--) { const d = new Date(now); d.setDate(now.getDate()-i); days.push(d); }
    } else {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      for (let i = 0; i < now.getDate(); i++) { const d = new Date(first); d.setDate(1+i); days.push(d); }
    }
    const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    const totals = {};
    for (const o of orders) { const k = toKey(new Date(o.created_at)); totals[k]=(totals[k]||0)+(o.total||0); }
    return {
      labels: days.map((d) => d.toLocaleDateString("es-CL",{day:"2-digit",month:"2-digit"})),
      values: days.map((d) => totals[toKey(d)]||0),
    };
  }, [orders, period]);

  return (
    <div className="adm-chart-wrap">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"3px",textTransform:"uppercase",color:C.oroDim,marginBottom:4}}>Evolución</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.crema}}>Ventas diarias</div>
        </div>
        <div style={{display:"flex",gap:4}}>
          {PERIODS.map((p) => (
            <button key={p.key} onClick={()=>setPeriod(p.key)} className="adm-btn"
              style={period===p.key?{borderColor:C.oro,color:C.oro,background:"rgba(201,168,76,0.08)"}:{}}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <Bar
        data={{ labels, datasets:[{data:values,backgroundColor:"rgba(201,168,76,0.2)",borderColor:C.oro,borderWidth:1.5,borderRadius:2,borderSkipped:false,hoverBackgroundColor:"rgba(232,196,106,0.4)"}] }}
        options={{
          responsive:true,maintainAspectRatio:true,animation:{duration:300},
          plugins:{legend:{display:false},tooltip:{backgroundColor:C.verde,borderColor:"rgba(201,168,76,0.3)",borderWidth:1,titleColor:C.oroDim,bodyColor:C.oro2,padding:10,callbacks:{label:(ctx)=>` $${Number(ctx.raw).toLocaleString("es-CL")}`}}},
          scales:{
            x:{grid:{color:"rgba(28,46,30,0.8)"},ticks:{color:"rgba(201,168,76,0.45)",font:{size:10},maxRotation:45},border:{display:false}},
            y:{grid:{color:"rgba(28,46,30,0.8)"},ticks:{color:"rgba(201,168,76,0.45)",font:{size:10},callback:(v)=>v===0?"$0":`$${(v/1000).toFixed(0)}k`},border:{display:false},beginAtZero:true},
          },
        }}
      />
    </div>
  );
}

function ShipModal({ order, savedPw, onClose, onShipped }) {
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirm = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/ship-order", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({orderId:order.id,trackingNumber:tracking.trim()||null,customerEmail:order.customers?.email,customerName:order.customers?.name,password:savedPw}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error||`Error ${res.status}`);
      onShipped();
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
      <div onClick={(e)=>e.stopPropagation()} style={{background:C.verde,border:"0.5px solid rgba(201,168,76,0.35)",width:"100%",maxWidth:420,padding:"32px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"3px",color:C.oroDim,textTransform:"uppercase",marginBottom:8}}>Marcar como enviado</div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",color:C.crema,fontSize:20,fontWeight:300,marginBottom:4}}>{order.customers?.name||"Cliente"}</h3>
        <p style={{fontSize:12,color:C.muted,marginBottom:24}}>{order.customers?.email}</p>
        <label style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"2px",color:C.oroDim,textTransform:"uppercase",display:"block",marginBottom:8}}>
          Número de tracking <span style={{color:"rgba(245,240,232,0.3)"}}>(opcional)</span>
        </label>
        <input type="text" value={tracking} onChange={(e)=>setTracking(e.target.value)} placeholder="Ej: CL123456789"
          style={{width:"100%",background:"rgba(0,0,0,0.3)",border:"0.5px solid rgba(201,168,76,0.25)",color:C.crema,fontFamily:"monospace",fontSize:14,padding:"10px 14px",outline:"none",marginBottom:error?8:20}}/>
        {error && <p style={{color:C.danger,fontSize:12,marginBottom:14}}>{error}</p>}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} className="adm-btn" style={{flex:1}}>Cancelar</button>
          <button onClick={confirm} disabled={loading} className="adm-btn" style={{flex:2,borderColor:"rgba(46,204,113,0.5)",color:C.success,background:"rgba(46,204,113,0.08)"}}>
            {loading?"Enviando...":"Confirmar envío →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderModal({ order, onClose }) {
  if (!order) return null;
  const c = order.customers || {};
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
      <div onClick={(e)=>e.stopPropagation()} style={{background:C.verde,border:"0.5px solid rgba(201,168,76,0.3)",width:"100%",maxWidth:540,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{padding:"24px 28px 18px",borderBottom:`0.5px solid ${C.borde}`,display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"3px",color:C.oroDim,textTransform:"uppercase",marginBottom:6}}>Pedido</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",color:C.crema,fontSize:18,fontWeight:300}}>{c.name||"Cliente"}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:4}}>{formatDate(order.created_at)}</div>
          </div>
          <button onClick={onClose} className="adm-btn" style={{padding:"6px 10px"}}>✕</button>
        </div>
        <div style={{padding:"22px 28px",display:"flex",flexDirection:"column",gap:16}}>
          {[
            {title:"Cliente",rows:[["Nombre",c.name||"—"],["Email",c.email||"—"],["Teléfono",c.phone||"—"]]},
            {title:"Dirección de despacho",rows:[["Dirección",order.address||"—"],["Comuna",order.commune||"—"],["Región",order.region||"—"]]},
          ].map(({title,rows})=>(
            <div key={title} style={{background:"rgba(0,0,0,0.2)",border:`0.5px solid ${C.borde}`,padding:"16px 18px"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"3px",color:C.oroDim,textTransform:"uppercase",marginBottom:12}}>{title}</div>
              {rows.map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8,gap:12}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:"1.5px",color:"rgba(245,240,232,0.4)",textTransform:"uppercase",flexShrink:0}}>{l}</span>
                  <span style={{fontSize:13,color:"rgba(245,240,232,0.8)",textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>
          ))}
          <div style={{background:"rgba(0,0,0,0.2)",border:`0.5px solid ${C.borde}`,padding:"16px 18px"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"3px",color:C.oroDim,textTransform:"uppercase",marginBottom:12}}>Productos</div>
            {(order.items||[]).map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:13,color:"rgba(245,240,232,0.8)"}}>{item.name||item.title||"Producto"}{item.quantity>1?` × ${item.quantity}`:""}</span>
                {item.price&&<span style={{fontFamily:"'Cormorant Garamond',serif",color:C.oro}}>{formatCLP(item.price*(item.quantity||1))}</span>}
              </div>
            ))}
            <div style={{borderTop:`0.5px solid ${C.borde}`,paddingTop:12,marginTop:8,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:"2px",color:C.oroDim,textTransform:"uppercase"}}>Total</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,color:C.oro2}}>{formatCLP(order.total)}</span>
            </div>
          </div>
          <div style={{background:"rgba(0,0,0,0.2)",border:`0.5px solid ${C.borde}`,padding:"16px 18px"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"3px",color:C.oroDim,textTransform:"uppercase",marginBottom:12}}>Estado del pedido</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:"1.5px",color:"rgba(245,240,232,0.4)",textTransform:"uppercase"}}>Estado</span>
              <StatusBadge status={order.payment_status}/>
            </div>
            {order.payment_id&&(
              <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:"1.5px",color:"rgba(245,240,232,0.4)",textTransform:"uppercase",flexShrink:0}}>Payment ID</span>
                <span style={{fontFamily:"monospace",fontSize:11,color:"rgba(245,240,232,0.8)",textAlign:"right",wordBreak:"break-all"}}>{order.payment_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TablaOrdenes({ orders }) {
  const [selOrder, setSelOrder] = useState(null);
  const [shipOrder, setShipOrder] = useState(null);
  const savedPw = sessionStorage.getItem("esz_pw") || "";
  return (
    <>
      <div className="adm-table-wrap">
        <table>
          <thead>
            <tr><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th>Región</th><th></th></tr>
          </thead>
          <tbody>
            {orders.length===0?(
              <tr><td colSpan={7} className="td-empty">Sin pedidos en este período</td></tr>
            ):orders.map((o)=>(
              <tr key={o.id} className="clickable" onClick={()=>setSelOrder(o)}>
                <td style={{fontSize:11,color:"rgba(245,240,232,0.4)",whiteSpace:"nowrap"}}>{formatDate(o.created_at)}</td>
                <td>
                  <div className="td-name">{o.customers?.name||"—"}</div>
                  <div style={{fontSize:11,color:C.oroDim,marginTop:2}}>{o.customers?.email||""}</div>
                </td>
                <td style={{maxWidth:200}}>
                  {(o.items||[]).map((item,i)=>(
                    <div key={i} style={{fontSize:11,color:"rgba(245,240,232,0.6)",lineHeight:1.6}}>
                      {item.name||item.title||"Producto"}{item.quantity>1?` × ${item.quantity}`:""}
                    </div>
                  ))}
                </td>
                <td>
                  <span className="td-price">{formatCLP(o.total)}</span>
                  {o.shipping_cost>0&&<div style={{fontSize:10,color:"rgba(245,240,232,0.3)",marginTop:2}}>+ {formatCLP(o.shipping_cost)} despacho</div>}
                </td>
                <td><StatusBadge status={o.payment_status}/></td>
                <td style={{fontSize:11}}>{o.region||"—"}{o.commune&&<div style={{marginTop:2}}>{o.commune}</div>}</td>
                <td onClick={(e)=>e.stopPropagation()}>
                  {o.payment_status!=="enviado"&&(
                    <button className="adm-btn" onClick={(e)=>{e.stopPropagation();setShipOrder(o);}}
                      style={{borderColor:"rgba(46,204,113,0.4)",color:C.success,fontSize:9,padding:"5px 12px"}}>
                      Enviar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderModal order={selOrder} onClose={()=>setSelOrder(null)}/>
      {shipOrder&&(
        <ShipModal order={shipOrder} savedPw={savedPw}
          onClose={()=>setShipOrder(null)}
          onShipped={()=>{setShipOrder(null);window.location.reload();}}/>
      )}
    </>
  );
}

function VistaVentas({ orders, periodo, salesToday, salesWeek, salesMonth }) {
  const filteredOrders = useMemo(()=>{
    const now = new Date();
    if (periodo==="today") {
      const start = new Date(now.getFullYear(),now.getMonth(),now.getDate());
      return orders.filter(o=>new Date(o.created_at)>=start);
    }
    if (periodo==="week") {
      const start = new Date(now); start.setDate(now.getDate()-7);
      return orders.filter(o=>new Date(o.created_at)>=start);
    }
    if (periodo==="month") {
      const start = new Date(now.getFullYear(),now.getMonth(),1);
      return orders.filter(o=>new Date(o.created_at)>=start);
    }
    return orders;
  },[orders,periodo]);
  const total = periodo==="today"?salesToday:periodo==="week"?salesWeek:salesMonth;
  const ticket = filteredOrders.length?Math.round(total/filteredOrders.length):0;
  const label = periodo==="today"?"hoy":periodo==="week"?"esta semana":"este mes";
  return (
    <>
      <div className="adm-kpi-grid">
        <div className="adm-kpi">
          <div className="adm-kpi-label">Total {label}</div>
          <div className="adm-kpi-value">{formatCLP(total)}</div>
          <div className="adm-kpi-sub">{filteredOrders.length} pedidos</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-label">Ticket promedio</div>
          <div className="adm-kpi-value">{filteredOrders.length?formatCLP(ticket):"—"}</div>
          <div className="adm-kpi-sub">Por pedido</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-label">Pedidos</div>
          <div className="adm-kpi-value">{filteredOrders.length}</div>
          <div className="adm-kpi-sub">{label}</div>
        </div>
      </div>
      <SalesChart orders={orders}/>
      <div className="adm-sec-header">
        <div><span className="adm-sec-title">Pedidos</span><span className="adm-sec-count">({filteredOrders.length})</span></div>
        <button className="adm-btn primary" onClick={()=>exportOrders(filteredOrders)}>
          <i className="ti ti-file-spreadsheet" style={{fontSize:13}} aria-hidden="true"></i>
          Exportar Excel
        </button>
      </div>
      <TablaOrdenes orders={filteredOrders}/>
    </>
  );
}

function VistaClientes({ clientes, tipo }) {
  const esRegistrados = tipo==="registrados";
  const headers = esRegistrados
    ?["Nombre","Email","Teléfono","Comuna","Región"]
    :["Email","Fecha suscripción"];
  return (
    <>
      <div className="adm-kpi-grid" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
        <div className="adm-kpi">
          <div className="adm-kpi-label">{esRegistrados?"Clientes registrados":"Suscriptores newsletter"}</div>
          <div className="adm-kpi-value">{clientes.length}</div>
          <div className="adm-kpi-sub">{esRegistrados?"Usuarios con cuenta creada":"Suscritos con código ESSENZA15"}</div>
        </div>
        <div className="adm-kpi" style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
          <button className="adm-btn primary" onClick={()=>{
            exportToCSV(clientes,`essenza-${tipo}`,headers,
              esRegistrados
                ?(c)=>[c.name||"",c.email||"",c.phone||"",c.commune||"",c.region||""].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";")
                :(c)=>[c.email||"",formatDate(c.created_at||c.subscribed_at||"")].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";")
            );
          }}>
            <i className="ti ti-file-spreadsheet" style={{fontSize:13}} aria-hidden="true"></i>
            Exportar Excel
          </button>
        </div>
      </div>
      <div className="adm-table-wrap">
        <table>
          <thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {clientes.length===0?(
              <tr><td colSpan={headers.length} className="td-empty">Sin registros aún</td></tr>
            ):esRegistrados?clientes.map((c,i)=>(
              <tr key={i}>
                <td className="td-name">{c.name||"—"}</td>
                <td>{c.email||"—"}</td>
                <td>{c.phone||"—"}</td>
                <td>{c.commune||"—"}</td>
                <td>{c.region||"—"}</td>
              </tr>
            )):clientes.map((c,i)=>(
              <tr key={i}>
                <td className="td-name">{c.email||"—"}</td>
                <td>{formatDate(c.created_at||c.subscribed_at||"")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function VistaMarketing({ tipo, metaConversions=[], metaVisits=[], whatsapp=[] }) {
  if (tipo === "pixel") {
    return (
      <>
        <div className="adm-info-box">
          El <strong>Pixel de Meta Ads</strong> permite rastrear conversiones y construir audiencias.
          Para activarlo dile a Claude Code: <strong>"Instala el pixel de Meta Ads con ID XXXXXXX"</strong>
        </div>
        <div className="adm-kpi-grid" style={{gridTemplateColumns:"1fr"}}>
          <div className="adm-kpi">
            <div className="adm-kpi-label">Estado del pixel</div>
            <div className="adm-kpi-value" style={{color:C.warning}}>No configurado</div>
            <div className="adm-kpi-sub">Eventos: PageView · ViewContent · AddToCart · InitiateCheckout · Purchase</div>
          </div>
        </div>
      </>
    );
  }

  const configs = {
    meta_conv: {
      title:"Meta Ads · con conversión",
      desc:"Visitantes desde Meta Ads que completaron una compra.",
      data: metaConversions,
      cols:["Nombre","Email","Producto","Valor","Fecha"],
      exportHeaders:["Nombre","Email","Producto","Valor","Campaign ID","Fecha"],
      exportMapper:(r)=>[r.nombre||"",r.email||"",r.producto||"",r.valor||0,r.campaign_id||"",formatDate(r.created_at)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";"),
      mapper:(r)=>(
        <tr key={r.id}>
          <td className="td-name">{r.nombre||"—"}</td>
          <td>{r.email||"—"}</td>
          <td>{r.producto||"—"}</td>
          <td className="td-price">{r.valor?`$${Number(r.valor).toLocaleString("es-CL")}`:"—"}</td>
          <td style={{fontSize:11,color:"rgba(245,240,232,0.4)"}}>{formatDate(r.created_at)}</td>
        </tr>
      ),
    },
    meta_noconv: {
      title:"Meta Ads · sin conversión",
      desc:"Visitantes desde Meta Ads que no compraron. Candidatos para retargeting.",
      data: metaVisits,
      cols:["Email","Fuente","Página visitada","Fecha"],
      exportHeaders:["Email","Fuente","Página visitada","Campaign ID","Fecha"],
      exportMapper:(r)=>[r.email||"",r.fuente||"",r.pagina_visitada||"",r.campaign_id||"",formatDate(r.created_at)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";"),
      mapper:(r)=>(
        <tr key={r.id}>
          <td className="td-name">{r.email||"—"}</td>
          <td>{r.fuente||"meta_ads"}</td>
          <td>{r.pagina_visitada||"—"}</td>
          <td style={{fontSize:11,color:"rgba(245,240,232,0.4)"}}>{formatDate(r.created_at)}</td>
        </tr>
      ),
    },
    whatsapp: {
      title:"WhatsApp · con conversión",
      desc:"Clientes que contactaron por WhatsApp y convirtieron en compra.",
      data: whatsapp,
      cols:["Nombre","Teléfono","Email","Producto","Fecha"],
      exportHeaders:["Nombre","Teléfono","Email","Producto","Notas","Fecha"],
      exportMapper:(r)=>[r.nombre||"",r.telefono||"",r.email||"",r.producto||"",r.notas||"",formatDate(r.created_at)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";"),
      mapper:(r)=>(
        <tr key={r.id}>
          <td className="td-name">{r.nombre||"—"}</td>
          <td>{r.telefono||"—"}</td>
          <td>{r.email||"—"}</td>
          <td>{r.producto||"—"}</td>
          <td style={{fontSize:11,color:"rgba(245,240,232,0.4)"}}>{formatDate(r.created_at)}</td>
        </tr>
      ),
    },
    retargeting: {
      title:"Retargeting",
      desc:"Visitantes sin conversión listos para campañas de reimpacto.",
      data: metaVisits.filter(r=>!r.convertido),
      cols:["Email","Canal","Página visitada","Último contacto"],
      exportHeaders:["Email","Canal","Página visitada","Último contacto"],
      exportMapper:(r)=>[r.email||"",r.fuente||"",r.pagina_visitada||"",formatDate(r.created_at)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";"),
      mapper:(r)=>(
        <tr key={r.id}>
          <td className="td-name">{r.email||"—"}</td>
          <td>{r.fuente||"meta_ads"}</td>
          <td>{r.pagina_visitada||"—"}</td>
          <td style={{fontSize:11,color:"rgba(245,240,232,0.4)"}}>{formatDate(r.created_at)}</td>
        </tr>
      ),
    },
  };

  const cfg = configs[tipo];
  const filas = cfg?.data || [];

  return (
    <>
      <div className="adm-kpi-grid" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
        <div className="adm-kpi">
          <div className="adm-kpi-label">{cfg.title}</div>
          <div className="adm-kpi-value">{filas.length}</div>
          <div className="adm-kpi-sub">{cfg.desc}</div>
        </div>
        <div className="adm-kpi" style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
          <button className="adm-btn primary" disabled={filas.length===0}
            onClick={()=>exportToCSV(filas,`essenza-${tipo}`,cfg.exportHeaders,cfg.exportMapper)}>
            <i className="ti ti-file-spreadsheet" style={{fontSize:13}} aria-hidden="true"></i>
            Exportar Excel
          </button>
        </div>
      </div>
      <div className="adm-table-wrap">
        <table>
          <thead><tr>{cfg.cols.map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filas.length===0
              ? <tr><td colSpan={cfg.cols.length} className="td-empty">Sin registros aún — los datos aparecerán aquí automáticamente</td></tr>
              : filas.map(cfg.mapper)
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

const NAV = [
  {section:"Ventas"},
  {key:"today",       label:"Ventas hoy",          icon:"ti-chart-bar"},
  {key:"week",        label:"Ventas semana",        icon:"ti-calendar-week"},
  {key:"month",       label:"Ventas mes",           icon:"ti-calendar-month"},
  {divider:true},
  {section:"Clientes"},
  {key:"registrados", label:"Registrados",          icon:"ti-users"},
  {key:"newsletter",  label:"Newsletter",           icon:"ti-mail"},
  {divider:true},
  {section:"Marketing"},
  {key:"meta_conv",   label:"Meta Ads · conv.",     icon:"ti-brand-meta"},
  {key:"whatsapp",    label:"WhatsApp · conv.",     icon:"ti-brand-whatsapp"},
  {key:"meta_noconv", label:"Meta Ads · sin conv.", icon:"ti-target"},
  {key:"retargeting", label:"Retargeting",          icon:"ti-refresh"},
  {divider:true},
  {section:"Configuración"},
  {key:"pixel",       label:"Pixel Meta Ads",       icon:"ti-brand-meta"},
  {key:"pedidos",     label:"Todos los pedidos",    icon:"ti-list"},
];

const TITLES = {
  today:"Ventas hoy", week:"Ventas semana", month:"Ventas mes",
  registrados:"Clientes registrados", newsletter:"Newsletter",
  meta_conv:"Meta Ads · con conversión", whatsapp:"WhatsApp · conversión",
  meta_noconv:"Meta Ads · sin conversión", retargeting:"Retargeting",
  pixel:"Pixel Meta Ads", pedidos:"Todos los pedidos",
};

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [savedPw, setSavedPw] = useState(()=>sessionStorage.getItem("esz_pw")||"");
  const [vista, setVista] = useState("today");

  const fetchData = async (pw) => {
    setLoading(true); setFetchError(""); setAuthError("");
    try {
      const res = await fetch("/api/admin-data",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({password:pw}),
      });
      let json; try{json=await res.json();}catch{json={};}
      if (res.status===401){setAuthError("Contraseña incorrecta");return;}
      if (!res.ok) throw new Error(json.error||`Error del servidor (${res.status})`);
      setData(json);
      setIsLoggedIn(true);
    } catch(err){setFetchError(err.message);}
    finally{setLoading(false);}
  };

  const handleLogin = () => {
    if (!password.trim()) return;
    setSavedPw(password);
    sessionStorage.setItem("esz_pw",password);
    fetchData(password);
  };

  useEffect(()=>{
    const pw = sessionStorage.getItem("esz_pw");
    if (pw) fetchData(pw);
  },[]);

  const handleLogout = () => {
    setIsLoggedIn(false); setData(null); setPassword("");
    sessionStorage.removeItem("esz_pw");
  };

  if (!isLoggedIn) {
    return (
      <div style={{minHeight:"100vh",background:C.negro,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <style>{css}</style>
        <div style={{background:C.verde,border:"0.5px solid rgba(201,168,76,0.3)",padding:"48px 44px",width:"100%",maxWidth:360,textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"4px",color:C.oroDim,textTransform:"uppercase",marginBottom:14}}>Panel Administrativo</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",color:C.oro,fontSize:34,fontWeight:300,marginBottom:36,lineHeight:1}}>Essenza</h1>
          <input type="password" value={password}
            onChange={(e)=>{setPassword(e.target.value);setAuthError("");setFetchError("");}}
            onKeyDown={(e)=>e.key==="Enter"&&handleLogin()}
            placeholder="Contraseña de acceso"
            style={{width:"100%",background:"rgba(0,0,0,0.3)",border:`0.5px solid ${(authError||fetchError)?"rgba(248,113,113,0.6)":"rgba(201,168,76,0.25)"}`,color:C.crema,fontFamily:"'Lora',serif",fontSize:14,padding:"12px 16px",outline:"none",marginBottom:(authError||fetchError)?8:20}}
          />
          {authError&&<p style={{color:C.danger,fontSize:12,textAlign:"left",marginBottom:14}}>{authError}</p>}
          {fetchError&&<p style={{color:C.danger,fontSize:12,textAlign:"left",marginBottom:14}}>{fetchError}</p>}
          <button onClick={handleLogin} disabled={loading} className="adm-btn primary" style={{width:"100%",justifyContent:"center",padding:"13px 0",fontSize:11}}>
            {loading?"Verificando...":"Ingresar"}
          </button>
        </div>
      </div>
    );
  }

  const {orders=[],customerCount=0,newsletterCount=0,salesToday=0,salesWeek=0,salesMonth=0,customers=[],metaConversions=[],metaVisits=[],whatsapp=[]} = data||{};

  const getBadge = (key) => {
    if (key==="today") return salesToday>0?formatCLP(salesToday):"$0";
    if (key==="week")  return formatCLP(salesWeek);
    if (key==="month") return formatCLP(salesMonth);
    if (key==="registrados") return customerCount||0;
    if (key==="newsletter")  return newsletterCount||0;
    return undefined;
  };

  const renderVista = () => {
    if (["today","week","month"].includes(vista))
      return <VistaVentas orders={orders} periodo={vista} salesToday={salesToday} salesWeek={salesWeek} salesMonth={salesMonth}/>;
    if (vista==="registrados") return <VistaClientes clientes={customers||[]} tipo="registrados"/>;
    if (vista==="newsletter")  return <VistaClientes clientes={[]} tipo="newsletter"/>;
    if (vista==="pedidos") return (
      <>
        <div className="adm-sec-header">
          <div><span className="adm-sec-title">Todos los pedidos</span><span className="adm-sec-count">({orders.length})</span></div>
          <button className="adm-btn primary" onClick={()=>exportOrders(orders)}>
            <i className="ti ti-file-spreadsheet" style={{fontSize:13}} aria-hidden="true"></i>
            Exportar Excel
          </button>
        </div>
        <TablaOrdenes orders={orders}/>
      </>
    );
    return <VistaMarketing tipo={vista} metaConversions={metaConversions} metaVisits={metaVisits} whatsapp={whatsapp}/>;
  };

  const titleParts = (TITLES[vista]||"").split("·");

  return (
    <div className="adm-layout">
      <style>{css}</style>
      <aside className="adm-sidebar">
        <div className="adm-sb-logo">
          <div className="adm-sb-logo-name">Essenza</div>
          <div className="adm-sb-logo-sub">Panel de administración</div>
        </div>
        {NAV.map((item,i)=>{
          if (item.section) return <div key={i} className="adm-sb-section">{item.section}</div>;
          if (item.divider) return <div key={i} className="adm-sb-divider"/>;
          const badgeVal = getBadge(item.key);
          const isZero = badgeVal===0||badgeVal==="$0";
          return (
            <div key={item.key} className={`adm-sb-item${vista===item.key?" active":""}`} onClick={()=>setVista(item.key)}>
              <i className={`ti ${item.icon} adm-si-icon`} aria-hidden="true"></i>
              <span className="adm-si-label">{item.label}</span>
              {badgeVal!==undefined&&(
                <span className={`adm-si-badge${isZero?" zero":""}`}>{badgeVal}</span>
              )}
            </div>
          );
        })}
        <div className="adm-sb-footer">
          <div className="adm-sb-user">
            <div className="adm-sb-avatar">E</div>
            <div>
              <div className="adm-sb-uname">Administrador</div>
              <div className="adm-sb-urole">Essenza Chile</div>
            </div>
          </div>
          <button className="adm-sb-logout" onClick={handleLogout}>
            <i className="ti ti-logout" style={{fontSize:13,marginRight:6}} aria-hidden="true"></i>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar-title">
            {titleParts[0]}
            {titleParts[1]&&<em>·{titleParts[1]}</em>}
          </div>
          <div className="adm-topbar-actions">
            <button className="adm-btn" onClick={()=>fetchData(savedPw)} disabled={loading}>
              <i className="ti ti-refresh" style={{fontSize:13}} aria-hidden="true"></i>
              {loading?"Cargando...":"Actualizar"}
            </button>
          </div>
        </div>
        <div className="adm-content">
          {fetchError&&(
            <div style={{background:"rgba(235,87,87,0.1)",border:"0.5px solid rgba(235,87,87,0.3)",padding:"12px 16px",marginBottom:20,color:C.danger,fontSize:12}}>
              Error: {fetchError}
            </div>
          )}
          {renderVista()}
        </div>
      </main>
    </div>
  );
}
