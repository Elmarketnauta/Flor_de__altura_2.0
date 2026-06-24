"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Award, ChevronRight } from "lucide-react";
import type { Article, ArticleSection } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  origen: "Origen",
  metodos: "Métodos",
  sostenibilidad: "Sostenibilidad",
};

const CATEGORY_COLORS: Record<string, string> = {
  origen: "bg-gold/20 text-gold-dark",
  metodos: "bg-organic/15 text-organic",
  sostenibilidad: "bg-green-100 text-green-800",
};

// ── SVG Illustrations ────────────────────────────────────────────────────────

function TemperaturaIllustration() {
  return (
    <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="tempBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a00" />
          <stop offset="100%" stopColor="#2e1205" />
        </linearGradient>
        <linearGradient id="steamGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#c8a24a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c8a24a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a9edd" />
          <stop offset="100%" stopColor="#1a5c8a" />
        </linearGradient>
        <linearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d1f0a" />
          <stop offset="100%" stopColor="#1a0a00" />
        </linearGradient>
        <radialGradient id="coffeeTop" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6b3010" />
          <stop offset="100%" stopColor="#3d1505" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="420" height="260" fill="url(#tempBg)" />

      {/* Subtle grid lines */}
      {[60,120,180,240,300,360].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="260" stroke="#ffffff" strokeWidth="0.3" opacity="0.04" />
      ))}

      {/* ── Thermometer bar (left side) ── */}
      {/* Scale background */}
      <rect x="32" y="20" width="18" height="200" rx="9" fill="#1a0a00" opacity="0.8" stroke="#c8a24a" strokeWidth="1" />
      {/* Fill — 90°C level (out of 100) */}
      <rect x="33" y="40" width="16" height="172" rx="8" fill="url(#waterGrad)" opacity="0.7" />
      {/* Bulb */}
      <circle cx="41" cy="225" r="12" fill="url(#waterGrad)" />
      <circle cx="41" cy="225" r="8" fill="#4a9edd" opacity="0.9" />
      {/* Tick marks + labels */}
      {[
        [100, 20], [96, 60], [93, 88], [91, 108], [89, 128], [85, 168]
      ].map(([temp, y]) => (
        <g key={temp}>
          <line x1="52" y1={y} x2="60" y2={y} stroke="#c8a24a" strokeWidth="1" opacity="0.7" />
          <text x="63" y={y + 4} fill="#c8a24a" fontSize="8" fontFamily="monospace" opacity="0.85">{temp}°</text>
        </g>
      ))}

      {/* Zone annotations */}
      {/* Red zone — too hot */}
      <rect x="33" y="40" width="16" height="20" rx="0" fill="#cc3333" opacity="0.5" />
      <text x="84" y="54" fill="#ff6666" fontSize="7.5" fontFamily="monospace" opacity="0.9">Sobre-extracción</text>
      {/* Green zone — ideal */}
      <rect x="33" y="60" width="16" height="68" rx="0" fill="#4a9e4a" opacity="0.4" />
      <text x="84" y="78" fill="#7ddf7d" fontSize="7.5" fontFamily="monospace" opacity="0.9">Prensa / Blend</text>
      <text x="84" y="100" fill="#7ddf7d" fontSize="7.5" fontFamily="monospace" opacity="0.9">Catuai V60</text>
      <text x="84" y="120" fill="#a8e8a8" fontSize="7.5" fontFamily="monospace" fontWeight="bold" opacity="1">Geisha / Floral ✓</text>
      {/* Blue zone — too cold */}
      <rect x="33" y="128" width="16" height="42" rx="0" fill="#3355cc" opacity="0.3" />
      <text x="84" y="143" fill="#88aaff" fontSize="7.5" fontFamily="monospace" opacity="0.9">Aeropress</text>
      <text x="84" y="162" fill="#5577dd" fontSize="7.5" fontFamily="monospace" opacity="0.7">Sub-extracción</text>

      {/* ── V60 + Pour-over visual (right side) ── */}
      {/* V60 dripper body */}
      <path d="M270,80 L310,155 L330,155 L370,80 Z" fill="#2a1005" stroke="#c8a24a" strokeWidth="1.5" />
      {/* V60 ribs */}
      {[0,1,2,3,4].map(i => (
        <line key={i}
          x1={282 + i*11} y1={83 + i*3}
          x2={305 + i*8} y2={152}
          stroke="#c8a24a" strokeWidth="0.8" opacity="0.4" />
      ))}
      {/* Filter paper */}
      <path d="M272,82 L312,153 L328,153 L368,82 Z" fill="none" stroke="#e8d5b0" strokeWidth="1" opacity="0.3" />
      {/* Coffee bed */}
      <ellipse cx="320" cy="148" rx="22" ry="5" fill="#5c2e00" opacity="0.9" />
      {/* V60 server / cup below */}
      <path d="M295,158 Q295,185 310,190 L330,190 Q345,185 345,158 Z" fill="url(#cupGrad)" stroke="#c8a24a" strokeWidth="1" />
      <ellipse cx="320" cy="185" rx="18" ry="4" fill="url(#coffeeTop)" />
      {/* Handle */}
      <path d="M345,165 Q360,165 360,172 Q360,180 345,180" stroke="#c8a24a" strokeWidth="2" fill="none" />
      {/* V60 base ring */}
      <rect x="308" y="155" width="24" height="4" rx="2" fill="#c8a24a" opacity="0.5" />

      {/* Pour stream */}
      <path d="M320,40 Q322,60 318,80" stroke="url(#steamGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M318,42 Q316,62 319,80" stroke="url(#waterGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      {/* Gooseneck kettle tip suggestion */}
      <path d="M295,25 Q305,18 320,35" stroke="#6b3010" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M295,25 Q305,18 320,35" stroke="#c8a24a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Steam wisps above cup */}
      {[0,1,2].map(i => (
        <path key={i}
          d={`M${308 + i*8},175 Q${306 + i*8},165 ${310 + i*8},155`}
          stroke="#c8a24a" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={0.35 - i*0.08}
        />
      ))}

      {/* Temperature badge on cup */}
      <rect x="278" y="195" width="84" height="22" rx="11" fill="black" opacity="0.5" />
      <text x="320" y="210" textAnchor="middle" fill="#c8a24a" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">
        89 – 93 °C · SCA
      </text>

      {/* ── Molecule floating labels ── */}
      {/* Linalool */}
      <circle cx="190" cy="55" r="18" fill="#2d4a1e" opacity="0.6" stroke="#4a9e4a" strokeWidth="1" />
      <text x="190" y="52" textAnchor="middle" fill="#a8e8a8" fontSize="6.5" fontFamily="serif" fontStyle="italic">Linalool</text>
      <text x="190" y="63" textAnchor="middle" fill="#7ddf7d" fontSize="5.5" fontFamily="monospace">floral</text>
      {/* Acetic */}
      <circle cx="235" cy="100" r="16" fill="#1a3a6a" opacity="0.6" stroke="#4a6edd" strokeWidth="1" />
      <text x="235" y="97" textAnchor="middle" fill="#aac8ff" fontSize="6.5" fontFamily="serif" fontStyle="italic">Ac. Acético</text>
      <text x="235" y="108" textAnchor="middle" fill="#88aaff" fontSize="5.5" fontFamily="monospace">acidez</text>
      {/* Tannins */}
      <circle cx="200" cy="148" r="17" fill="#4a1a1a" opacity="0.65" stroke="#cc4444" strokeWidth="1" />
      <text x="200" y="145" textAnchor="middle" fill="#ff9999" fontSize="6" fontFamily="serif" fontStyle="italic">Taninos</text>
      <text x="200" y="156" textAnchor="middle" fill="#ff6666" fontSize="5.5" fontFamily="monospace">amargo</text>
      {/* Maillard */}
      <circle cx="245" cy="170" r="18" fill="#3d2a05" opacity="0.65" stroke="#c8a24a" strokeWidth="1" />
      <text x="245" y="167" textAnchor="middle" fill="#f0d090" fontSize="6" fontFamily="serif" fontStyle="italic">Maillard</text>
      <text x="245" y="178" textAnchor="middle" fill="#c8a24a" fontSize="5.5" fontFamily="monospace">dulzor</text>

      {/* Title label bottom */}
      <text x="210" y="248" textAnchor="middle" fill="#c8a24a" fontSize="9" fontFamily="serif" fontStyle="italic" opacity="0.7">
        Química de la extracción · Temperatura y solubilidad
      </text>
    </svg>
  );
}

function TemperaturaSidebarIllustration() {
  const methods = [
    { name: "Geisha", temp: "89–91°C", y: 0, color: "#c8d8f0", bar: 62 },
    { name: "Catuai V60", temp: "91–93°C", y: 44, color: "#a8e8a8", bar: 72 },
    { name: "Chemex", temp: "91–93°C", y: 88, color: "#d4c070", bar: 72 },
    { name: "Aeropress", temp: "85–88°C", y: 132, color: "#e8c0a0", bar: 45 },
    { name: "Prensa Fr.", temp: "93–95°C", y: 176, color: "#f0a060", bar: 82 },
  ];
  return (
    <svg viewBox="0 0 260 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="260" height="230" fill="#f8f4ed" rx="12" />
      {/* Scale header */}
      <text x="130" y="18" textAnchor="middle" fill="#5c2e00" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="1">TEMPERATURA POR MÉTODO</text>
      <line x1="16" y1="24" x2="244" y2="24" stroke="#d4c8a0" strokeWidth="1" />
      {/* Scale markers */}
      {[85, 89, 93, 97, 100].map((t, i) => (
        <g key={t}>
          <line x1={40 + i * 43} y1="26" x2={40 + i * 43} y2="34" stroke="#c8a24a" strokeWidth="1" opacity="0.5" />
          <text x={40 + i * 43} y="43" textAnchor="middle" fill="#8b5e2a" fontSize="7.5" fontFamily="monospace">{t}°</text>
        </g>
      ))}
      {/* Red zone > 96 */}
      <rect x={40 + 3*43 + 7} y="26" width={40} height="194" fill="#cc3333" opacity="0.08" rx="2" />
      <text x={40 + 3*43 + 27} y="36" textAnchor="middle" fill="#cc3333" fontSize="6" fontFamily="monospace" opacity="0.6">Riesgo</text>
      {methods.map((m) => (
        <g key={m.name} transform={`translate(0,${46 + m.y})`}>
          <text x="12" y="14" fill="#5c2e00" fontSize="8" fontFamily="serif">{m.name}</text>
          <text x="12" y="26" fill="#8b5e2a" fontSize="7" fontFamily="monospace">{m.temp}</text>
          {/* Bar */}
          <rect x="40" y="6" width={m.bar} height="16" rx="3" fill={m.color} opacity="0.7" />
          <rect x="40" y="6" width={m.bar} height="16" rx="3" stroke={m.color} strokeWidth="1" fill="none" opacity="0.9" />
        </g>
      ))}
      {/* Legend */}
      <rect x="16" y="208" width="10" height="10" rx="2" fill="#4a9e4a" opacity="0.5" />
      <text x="30" y="217" fill="#5c2e00" fontSize="7" fontFamily="monospace">Rango SCA ideal</text>
      <rect x="120" y="208" width="10" height="10" rx="2" fill="#cc3333" opacity="0.5" />
      <text x="134" y="217" fill="#5c2e00" fontSize="7" fontFamily="monospace">Sobre-extracción</text>
    </svg>
  );
}

function GeishaIllustration() {
  return (
    <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a00" />
          <stop offset="60%" stopColor="#3d1f0a" />
          <stop offset="100%" stopColor="#5c3317" />
        </linearGradient>
        <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d4a1e" />
          <stop offset="100%" stopColor="#1a2e10" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d060" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f0d060" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="branch" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a2c0a" />
          <stop offset="100%" stopColor="#6b3f15" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="260" fill="url(#sky)" />

      {/* Stars */}
      {[[40,20],[80,35],[120,15],[200,25],[260,18],[320,30],[360,22],[150,40],[290,45],[380,55]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#f0d060" opacity={0.6 + (i % 3) * 0.15} />
      ))}

      {/* Moon glow */}
      <circle cx="340" cy="45" r="40" fill="url(#moonGlow)" />
      <circle cx="340" cy="45" r="18" fill="#f8e878" opacity="0.9" />
      <circle cx="334" cy="40" r="14" fill="#1a0a00" opacity="0.15" />

      {/* Mountain silhouettes */}
      <polygon points="0,260 80,100 160,180 0,260" fill="#1a2e10" opacity="0.9" />
      <polygon points="60,260 180,80 280,140 320,260" fill="url(#mountain)" />
      <polygon points="200,260 310,90 400,150 400,260" fill="#243d18" opacity="0.85" />

      {/* Fog / mist bands */}
      <ellipse cx="200" cy="160" rx="220" ry="18" fill="white" opacity="0.06" />
      <ellipse cx="200" cy="185" rx="200" ry="14" fill="white" opacity="0.08" />

      {/* Main branch — left to right */}
      <path d="M-10 200 Q60 170 120 155 Q180 140 230 148" stroke="url(#branch)" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Sub-branches */}
      <path d="M80 162 Q90 140 110 128" stroke="#4a2c0a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M110 155 Q125 132 142 122" stroke="#4a2c0a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M150 150 Q160 130 172 118" stroke="#4a2c0a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M190 148 Q200 130 210 122" stroke="#4a2c0a" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Geisha leaves — elongated lanceolate */}
      {[
        [110,128,"-15"],
        [130,122,"5"],
        [142,122,"-10"],
        [158,116,"8"],
        [172,118,"-5"],
        [185,115,"12"],
        [210,122,"-8"],
        [225,118,"15"],
        [95,145,"20"],
        [165,140,"-20"],
      ].map(([cx,cy,rot],i) => (
        <g key={i} transform={`translate(${cx},${cy}) rotate(${rot})`}>
          <ellipse rx="14" ry="5" fill={i % 2 === 0 ? "#2d5a1b" : "#3a7020"} opacity="0.92" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#1a3a0e" strokeWidth="0.6" opacity="0.5" />
        </g>
      ))}

      {/* Coffee cherries — pairs */}
      {[
        [115,132],[138,126],[168,120],[195,120],[214,125]
      ].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="#b02020" />
          <circle cx={cx+8} cy={cy-2} r="5" fill="#c42222" />
          <circle cx={cx} cy={cy} r="1.5" fill="#e04040" opacity="0.5" />
          <circle cx={cx+8} cy={cy-2} r="1.5" fill="#e04040" opacity="0.5" />
        </g>
      ))}

      {/* White Geisha flowers */}
      {[
        [105,140],[145,130],[175,125],[218,130]
      ].map(([cx,cy],i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          {[0,72,144,216,288].map((angle,j) => (
            <ellipse
              key={j}
              cx={Math.cos((angle * Math.PI) / 180) * 5}
              cy={Math.sin((angle * Math.PI) / 180) * 5}
              rx="3.5"
              ry="2"
              fill="white"
              opacity="0.92"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="2" fill="#f0d060" />
        </g>
      ))}

      {/* Altitude label */}
      <rect x="12" y="222" width="120" height="26" rx="13" fill="black" opacity="0.45" />
      <text x="72" y="239" textAnchor="middle" fill="#f0d060" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
        1.900 – 1.950 msnm
      </text>

      {/* SCA score badge */}
      <rect x="268" y="222" width="120" height="26" rx="13" fill="black" opacity="0.45" />
      <text x="328" y="239" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" letterSpacing="1">
        SCA 87.2 pts
      </text>
    </svg>
  );
}

function EthiopiaMapIllustration() {
  return (
    <svg viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#ede4d0" />
        </linearGradient>
        <linearGradient id="routeLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8a24a" />
          <stop offset="100%" stopColor="#8b5e2a" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#mapBg)" rx="12" />

      {/* Decorative grid */}
      {[30,60,90,120,150,180].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#d4c8a0" strokeWidth="0.5" opacity="0.4" />
      ))}
      {[40,80,120,160].map(y => (
        <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#d4c8a0" strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Ethiopia shape — simplified */}
      <path d="M60,40 Q80,30 105,38 Q125,42 130,55 Q140,68 135,82 Q130,95 118,100 Q110,112 100,118 Q90,125 85,115 Q78,105 72,95 Q62,80 58,65 Q55,52 60,40Z"
        fill="#c8a24a" opacity="0.35" stroke="#8b5e2a" strokeWidth="1.5" />
      {/* Kaffa / Gesha star */}
      <circle cx="78" cy="90" r="7" fill="#b02020" opacity="0.85" />
      <text x="78" y="93" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">★</text>
      <text x="78" y="108" textAnchor="middle" fill="#5c2e00" fontSize="7" fontFamily="serif">Kaffa</text>

      {/* Panama shape — simplified */}
      <path d="M165,85 Q175,80 185,83 Q195,86 198,92 Q200,98 195,103 Q188,108 178,105 Q168,102 163,96 Q161,90 165,85Z"
        fill="#c8a24a" opacity="0.35" stroke="#8b5e2a" strokeWidth="1.5" />
      <circle cx="178" cy="94" r="6" fill="#c8a24a" opacity="0.9" />
      <text x="178" y="97" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">★</text>
      <text x="178" y="110" textAnchor="middle" fill="#5c2e00" fontSize="7" fontFamily="serif">Boquete</text>

      {/* Peru — Chanchamayo region */}
      <path d="M215,95 Q230,85 248,90 Q262,95 265,110 Q268,125 258,132 Q245,138 230,134 Q218,130 212,118 Q208,107 215,95Z"
        fill="#c8a24a" opacity="0.35" stroke="#8b5e2a" strokeWidth="1.5" />
      <circle cx="238" cy="115" r="7" fill="#2d5a1b" opacity="0.9" />
      <text x="238" y="118" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">✦</text>
      <text x="238" y="132" textAnchor="middle" fill="#5c2e00" fontSize="7" fontFamily="serif">Perené</text>

      {/* Route lines */}
      <path d="M85,88 Q130,60 172,90" stroke="url(#routeLine)" strokeWidth="2" strokeDasharray="5,4" fill="none" opacity="0.8" />
      <path d="M184,92 Q200,88 228,106" stroke="url(#routeLine)" strokeWidth="2" strokeDasharray="5,4" fill="none" opacity="0.8" />

      {/* Arrow at end */}
      <polygon points="226,104 232,108 228,112" fill="#c8a24a" opacity="0.9" />

      {/* Year labels on route */}
      <text x="130" y="57" textAnchor="middle" fill="#8b5e2a" fontSize="7.5" fontFamily="monospace">1953</text>
      <text x="207" y="86" textAnchor="middle" fill="#8b5e2a" fontSize="7.5" fontFamily="monospace">2004</text>
      <text x="275" y="108" textAnchor="middle" fill="#2d5a1b" fontSize="7.5" fontFamily="monospace" fontWeight="bold">2021</text>

      {/* Title */}
      <text x="180" y="175" textAnchor="middle" fill="#5c2e00" fontSize="10" fontFamily="serif" fontStyle="italic">
        La ruta del Geisha — Etiopía → Panamá → Perú
      </text>
    </svg>
  );
}

function TastingWheelIllustration() {
  const segments = [
    { label: "Jazmín", color: "#e8d5b0", angle: 0 },
    { label: "Bergamota", color: "#d4c070", angle: 51.4 },
    { label: "Cítrico", color: "#e8c84a", angle: 102.8 },
    { label: "Melocotón", color: "#f0a060", angle: 154.2 },
    { label: "Miel", color: "#d4904a", angle: 205.6 },
    { label: "Málico", color: "#a8c878", angle: 257 },
    { label: "Floral", color: "#c8a8d8", angle: 308.4 },
  ];

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const s = polarToCartesian(cx, cy, r, startAngle);
    const e = polarToCartesian(cx, cy, r, endAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
  };

  const cx = 100, cy = 100, r = 80;
  const segAngle = 360 / segments.length;

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="wheelCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f8f0e0" />
          <stop offset="100%" stopColor="#e8d8b0" />
        </radialGradient>
      </defs>

      {segments.map((seg, i) => {
        const start = seg.angle;
        const end = seg.angle + segAngle;
        const mid = seg.angle + segAngle / 2;
        const label = polarToCartesian(cx, cy, r * 0.68, mid);
        const outerLabel = polarToCartesian(cx, cy, r * 0.92, mid);
        return (
          <g key={i}>
            <path d={describeArc(cx, cy, r, start, end)} fill={seg.color} stroke="white" strokeWidth="1.5" />
            <path d={describeArc(cx, cy, r * 0.42, start, end)} fill={seg.color} opacity="0.5" stroke="white" strokeWidth="1" />
            <text
              x={outerLabel.x}
              y={outerLabel.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="5.5"
              fill="#3d1f0a"
              fontFamily="serif"
              transform={`rotate(${mid}, ${outerLabel.x}, ${outerLabel.y})`}
            >
              {seg.label}
            </text>
          </g>
        );
      })}

      {/* Inner circle */}
      <circle cx={cx} cy={cy} r={r * 0.28} fill="url(#wheelCenter)" stroke="#c8a24a" strokeWidth="1.5" />
      <text x={cx} y={cy - 5} textAnchor="middle" fill="#3d1f0a" fontSize="7" fontFamily="serif" fontWeight="bold">Geisha</text>
      <text x={cx} y={cy + 6} textAnchor="middle" fill="#8b5e2a" fontSize="5.5" fontFamily="monospace">SCA 87.2</text>
    </svg>
  );
}

// ── Section Renderers ─────────────────────────────────────────────────────────

function RenderSection({ section, index }: { section: ArticleSection; index: number }) {
  switch (section.type) {
    case "paragraph":
      return (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * (index % 6) }}
          className="text-espresso-700 leading-[1.85] text-[1.0625rem]"
        >
          {section.text}
        </motion.p>
      );

    case "heading":
      return (
        <motion.h2
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-semibold text-espresso-900 mt-10 mb-1 pt-4 border-t border-sand"
        >
          {section.text}
        </motion.h2>
      );

    case "pullquote":
      return (
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative my-8 rounded-2xl bg-espresso-800 px-8 py-7 text-cream"
        >
          <span className="absolute -top-3 left-6 font-serif text-6xl text-gold leading-none select-none">&ldquo;</span>
          <p className="relative font-serif text-xl leading-relaxed text-cream/95 italic">
            {section.text?.replace(/^"|"$/g, "")}
          </p>
        </motion.blockquote>
      );

    case "callout":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-gold/40 bg-gold/8 px-6 py-5 my-6"
        >
          {section.label && (
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold-dark mb-2">
              {section.label}
            </p>
          )}
          <p className="text-espresso-700 leading-relaxed text-sm">{section.text}</p>
        </motion.div>
      );

    case "tasting-card":
      return (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="my-8 overflow-hidden rounded-2xl border border-sand shadow-sm"
        >
          <div className="bg-espresso-800 px-6 py-4 flex items-center gap-3">
            <Award className="h-5 w-5 text-gold flex-shrink-0" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cream">
              {section.label}
            </h3>
          </div>
          <div className="bg-white divide-y divide-sand">
            {section.rows?.map((row, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-3">
                <span className="w-44 flex-shrink-0 text-xs font-mono text-espresso-400 pt-0.5">
                  {row.label}
                </span>
                <span className="text-sm text-espresso-800 font-medium leading-relaxed">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      );

    case "data-table":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="my-6 overflow-hidden rounded-xl border border-sand"
        >
          {section.label && (
            <div className="bg-cream px-5 py-3 border-b border-sand">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-espresso-500">
                {section.label}
              </p>
            </div>
          )}
          <div className="bg-white divide-y divide-sand/60">
            {section.rows?.map((row, i) => (
              <div key={i} className={`flex gap-4 px-5 py-3 ${row.value.includes("✓") ? "bg-organic/5" : ""}`}>
                <span className="w-36 flex-shrink-0 text-sm font-medium text-espresso-700">{row.label}</span>
                <span className="text-sm text-espresso-500 leading-relaxed">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      );

    case "timeline":
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="my-8"
        >
          {section.label && (
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold-dark mb-6 text-center">
              {section.label}
            </p>
          )}
          <div className="relative pl-8 border-l-2 border-sand space-y-6">
            {section.events?.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative"
              >
                <div className="absolute -left-[2.35rem] flex h-7 w-7 items-center justify-center rounded-full bg-espresso-800 border-2 border-cream shadow-sm">
                  <span className="font-mono text-[9px] text-gold font-bold leading-none">
                    {event.year.slice(-2)}
                  </span>
                </div>
                <div className="rounded-xl bg-white border border-sand px-4 py-3">
                  <span className="font-mono text-xs font-bold text-gold-dark">{event.year}</span>
                  <p className="mt-1 text-sm text-espresso-600 leading-relaxed">{event.fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    default:
      return null;
  }
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ArticlePage({ article }: { article: Article }) {
  const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;
  const categoryColor = CATEGORY_COLORS[article.category] ?? "bg-gold/20 text-gold-dark";
  const isGeisha = article.id === "geysha-origen";
  const isTemperatura = article.id === "temperatura-agua";

  return (
    <main className="min-h-screen bg-cream">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-espresso-900">
        <div className="noise-grain absolute inset-0 opacity-40" aria-hidden />
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-gold/8 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-organic/10 blur-3xl" />

        {/* Illustration area */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:gap-12">

            {/* Text side */}
            <div className="pt-14 pb-10 lg:pb-16 lg:max-w-xl xl:max-w-2xl flex-shrink-0">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-espresso-400">
                <Link href="/" className="hover:text-espresso-200 transition">Inicio</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/revista" className="hover:text-espresso-200 transition">Revista</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-espresso-300 line-clamp-1">{categoryLabel}</span>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${categoryColor} mb-4`}>
                  {categoryLabel}
                </span>
                <h1 className="font-serif text-3xl font-semibold text-cream sm:text-4xl xl:text-5xl leading-[1.15]">
                  {article.title}
                </h1>
                {article.subtitle && (
                  <p className="mt-4 text-lg text-espresso-200/80 font-light leading-relaxed">
                    {article.subtitle}
                  </p>
                )}
                <p className="mt-5 text-espresso-300 leading-relaxed max-w-lg">
                  {article.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-espresso-400">
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold font-bold text-[10px]">SCA</span>
                      </div>
                      <div>
                        <p className="text-espresso-200 font-medium text-[11px]">{article.author.name}</p>
                        <p className="text-espresso-500 text-[10px]">{article.author.role}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Lectura {article.readTime}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Illustration side */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:flex-1 flex items-end justify-center pb-0 lg:pb-0 max-h-[280px] lg:max-h-[320px] overflow-hidden"
            >
              {isGeisha ? (
                <div className="w-full max-w-[480px]">
                  <GeishaIllustration />
                </div>
              ) : isTemperatura ? (
                <div className="w-full max-w-[500px]">
                  <TemperaturaIllustration />
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-espresso-700 to-organic/40 flex items-center justify-center rounded-t-2xl">
                  <span className="text-4xl">{article.category === "metodos" ? "☕" : "🌿"}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">

          {/* Main content */}
          <article className="max-w-[72ch]">
            <div className="space-y-5">
              {article.sections ? (
                article.sections.map((section, i) => (
                  <RenderSection key={i} section={section} index={i} />
                ))
              ) : (
                article.content.map((paragraph, i) => (
                  <p key={i} className="text-espresso-700 leading-[1.85] text-[1.0625rem]">
                    {paragraph}
                  </p>
                ))
              )}
            </div>

            {/* Back to revista */}
            <div className="mt-14 pt-8 border-t border-sand">
              <Link
                href="/revista"
                className="inline-flex items-center gap-2 text-sm font-medium text-espresso-500 hover:text-espresso-900 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a la Revista
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:pt-2">

            {/* Tasting wheel — only for Geisha article */}
            {isGeisha && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-sand bg-white p-5 shadow-sm"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">
                  Rueda Aromática
                </p>
                <div className="aspect-square">
                  <TastingWheelIllustration />
                </div>
                <p className="mt-3 text-xs text-espresso-400 text-center leading-relaxed">
                  Perfil aromático del Geisha Bella Vista · Catación SCA independiente 2024
                </p>
              </motion.div>
            )}

            {/* Route map — only for Geisha article */}
            {isGeisha && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-sand bg-white p-5 shadow-sm"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">
                  Ruta Botánica
                </p>
                <div className="aspect-[360/200]">
                  <EthiopiaMapIllustration />
                </div>
                <p className="mt-3 text-xs text-espresso-400 text-center leading-relaxed">
                  Del bosque de Kaffa a los Andes de Chanchamayo — 70 años de viaje
                </p>
              </motion.div>
            )}

            {/* Quick facts */}
            {isGeisha && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-sand bg-white p-5 shadow-sm"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">
                  Datos Clave
                </p>
                <ul className="space-y-3">
                  {[
                    ["Variedad", "Coffea arabica var. Geisha"],
                    ["Origen genético", "Kaffa, Etiopía"],
                    ["Finca", "Bella Vista, Perené"],
                    ["Altitud", "1.900 – 1.950 msnm"],
                    ["Proceso", "Honey 36 horas"],
                    ["Cosecha", "Julio – Agosto"],
                    ["Puntaje SCA", "87.2 pts"],
                    ["Producción anual", "~200 kg café verde"],
                    ["Productor", "Roberto Pariona, Q-Grader"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex justify-between gap-2 text-sm border-b border-sand/60 pb-2 last:border-0 last:pb-0">
                      <span className="text-espresso-400 flex-shrink-0">{k}</span>
                      <span className="text-espresso-800 font-medium text-right">{v}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Temperatura sidebar — chart + quick ref */}
            {isTemperatura && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-sand bg-white p-5 shadow-sm"
                >
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">
                    Temperatura por Método
                  </p>
                  <div className="aspect-[260/230]">
                    <TemperaturaSidebarIllustration />
                  </div>
                  <p className="mt-3 text-xs text-espresso-400 text-center leading-relaxed">
                    Referencia SCA para cafés arábica de especialidad de altura
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-sand bg-white p-5 shadow-sm"
                >
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">
                    Referencia Rápida
                  </p>
                  <ul className="space-y-3">
                    {[
                      ["Sin termómetro", "Espera 90 seg post-hervor"],
                      ["Geisha Bella Vista", "89 – 91 °C"],
                      ["Catuai San Ignacio", "91 – 93 °C"],
                      ["Blend Casa", "92 – 93 °C"],
                      ["Prensa Francesa", "93 – 95 °C"],
                      ["Aeropress", "85 – 88 °C"],
                      ["TDS ideal del agua", "125 – 175 ppm"],
                      ["Bloom mínimo Geisha", "45 segundos"],
                      ["Ventana óptima post-tueste", "7 – 21 días"],
                    ].map(([k, v]) => (
                      <li key={k} className="flex justify-between gap-2 text-sm border-b border-sand/60 pb-2 last:border-0 last:pb-0">
                        <span className="text-espresso-400 flex-shrink-0 text-xs">{k}</span>
                        <span className="text-espresso-800 font-medium text-right text-xs">{v}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </>
            )}

            {/* CTA — Club */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-espresso-800 p-6 text-center"
            >
              <div className="noise-grain absolute inset-0 rounded-2xl opacity-20" aria-hidden />
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold mb-2">
                {isTemperatura ? "Club · Flor de Altura" : "Aventurero · Club"}
              </p>
              <p className="font-serif text-lg text-cream leading-snug">
                {isTemperatura ? "El café que merece la técnica perfecta" : "Accede al Geisha antes que nadie"}
              </p>
              <p className="mt-2 text-xs text-espresso-300 leading-relaxed">
                {isTemperatura
                  ? "Recibe cada mes cafés de especialidad de la Selva Central con guía de preparación personalizada para cada variedad."
                  : "Los suscriptores del plan Aventurero tienen prioridad sobre la cosecha limitada de Geisha Bella Vista."}
              </p>
              <Link
                href="/club"
                className="mt-4 block rounded-full bg-gold py-2.5 text-sm font-bold text-espresso-900 hover:bg-gold-dark hover:text-cream transition"
              >
                Ver el Club
              </Link>
            </motion.div>

          </aside>
        </div>
      </div>
    </main>
  );
}
