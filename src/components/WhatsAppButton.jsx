import { useState, useEffect } from "react";

const WA_URL = "https://wa.me/56965902996?text=Hola%2C%20me%20interesa%20el%20aceite%20de%20oliva%20Essenza%20%F0%9F%AB%92";

const styles = `
  .wa-fab {
    position: fixed;
    bottom: 28px;
    left: 28px;
    z-index: 800;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #25d366;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(37,211,102,0.4);
    transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.4s ease;
    text-decoration: none;
    opacity: 0;
    transform: scale(0.6) translateY(12px);
  }

  .wa-fab.show {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  .wa-fab:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 8px 28px rgba(37,211,102,0.55);
  }

  .wa-fab svg {
    width: 28px;
    height: 28px;
    fill: #ffffff;
    display: block;
  }

  .wa-tooltip {
    position: fixed;
    bottom: 96px;
    left: 28px;
    z-index: 800;
    background: #0d2214;
    border: 1px solid rgba(201,168,76,0.3);
    color: #f5f0e8;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.05em;
    padding: 8px 14px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .wa-tooltip::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 20px;
    width: 10px;
    height: 6px;
    background: #0d2214;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }

  .wa-fab:hover + .wa-tooltip,
  .wa-fab:focus + .wa-tooltip {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`wa-fab${show ? " show" : ""}`}
        aria-label="Contáctanos por WhatsApp"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      <div className="wa-tooltip" aria-hidden>¿Tienes preguntas? Escríbenos</div>
    </>
  );
}
