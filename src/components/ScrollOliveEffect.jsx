import { useEffect, useRef, useState } from "react";

const OLIVES = [
  { x: "8%",  size: 18, speed: 0.12, baseY: 120  },
  { x: "22%", size: 14, speed: 0.20, baseY: 340  },
  { x: "75%", size: 16, speed: 0.15, baseY: 600  },
  { x: "88%", size: 12, speed: 0.28, baseY: 900  },
  { x: "55%", size: 15, speed: 0.10, baseY: 1400 },
];

// Total SVG path length for the drip line — matches viewBox height
const PATH_LENGTH = 2000;

export default function ScrollOliveEffect() {
  const [scrollPct, setScrollPct] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        const y = window.scrollY;
        setScrollY(y);
        setScrollPct(max > 0 ? Math.min(1, y / max) : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const filled = scrollPct * PATH_LENGTH;
  const remaining = PATH_LENGTH - filled;

  return (
    <>
      <style>{`
        @keyframes wobble {
          0%,100% { transform: translateX(0) scale(1); }
          30%      { transform: translateX(-2px) scale(1.1); }
          60%      { transform: translateX(2px) scale(0.95); }
        }
        @keyframes drip-drop {
          0%   { transform: translateY(0) scale(1);   opacity: 1; }
          80%  { transform: translateY(8px) scale(0.9); opacity: 0.8; }
          100% { transform: translateY(12px) scale(0); opacity: 0; }
        }
        .olive-drip-drop {
          animation: drip-drop 1.4s ease-in-out infinite;
          transform-origin: center top;
        }
        .olive-drip-drop:nth-child(2) { animation-delay: 0.45s; }
        .olive-drip-drop:nth-child(3) { animation-delay: 0.9s; }
      `}</style>

      {/* Right-edge oil drip */}
      <svg
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 24,
          height: "100vh",
          zIndex: 999,
          pointerEvents: "none",
          overflow: "visible",
        }}
        viewBox={`0 0 24 ${PATH_LENGTH}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="drip-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c9a84c" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#e8c46a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Track line (faint) */}
        <line x1="12" y1="0" x2="12" y2={PATH_LENGTH} stroke="rgba(201,168,76,0.08)" strokeWidth="1.5" />

        {/* Filled drip */}
        <line
          x1="12" y1="0" x2="12" y2={PATH_LENGTH}
          stroke="url(#drip-grad)"
          strokeWidth="3"
          strokeDasharray={`${filled} ${remaining}`}
          strokeLinecap="round"
        />

        {/* Droplets at the tip */}
        {scrollPct > 0.02 && (
          <g transform={`translate(12, ${filled})`}>
            {[0, 1, 2].map((i) => (
              <ellipse
                key={i}
                className="olive-drip-drop"
                cx="0"
                cy={i * 7}
                rx={3 - i * 0.7}
                ry={4 - i * 0.8}
                fill="#c9a84c"
                fillOpacity={0.9 - i * 0.2}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Floating olives */}
      {OLIVES.map((o, i) => {
        const dy = scrollY * o.speed;
        return (
          <svg
            key={i}
            style={{
              position: "fixed",
              left: o.x,
              top: o.baseY - dy,
              width: o.size * 2,
              height: o.size * 3,
              zIndex: 999,
              pointerEvents: "none",
              animation: `wobble ${2.8 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
              opacity: 0.55,
            }}
            viewBox={`0 0 ${o.size * 2} ${o.size * 3}`}
            aria-hidden="true"
          >
            {/* Olive body */}
            <ellipse
              cx={o.size}
              cy={o.size * 1.5}
              rx={o.size * 0.72}
              ry={o.size * 1.1}
              fill="#1a3d20"
              stroke="#c9a84c"
              strokeWidth="1.2"
            />
            {/* Red pimento dot */}
            <circle cx={o.size} cy={o.size * 1.3} r={o.size * 0.18} fill="#c0392b" />
            {/* Tiny stem */}
            <line
              x1={o.size} y1={o.size * 0.42}
              x2={o.size + o.size * 0.22} y2={o.size * 0.1}
              stroke="#c9a84c"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        );
      })}
    </>
  );
}
