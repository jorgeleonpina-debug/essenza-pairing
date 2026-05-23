import { BrowserRouter, Routes, Route } from "react-router-dom";
import EssenzaPairingAI from "./essenza-pairing-ai";
import { PoliticasDespacho, TerminosCondiciones, PoliticaReembolso, PoliticaPrivacidad } from "./legal-pages";
import ScrollOliveEffect from "./components/ScrollOliveEffect";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollOliveEffect />
      <Routes>
        <Route path="/" element={<EssenzaPairingAI />} />
        <Route path="/politicas-despacho" element={<PoliticasDespacho />} />
        <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
        <Route path="/politica-reembolso" element={<PoliticaReembolso />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
      </Routes>
    </BrowserRouter>
  );
}
