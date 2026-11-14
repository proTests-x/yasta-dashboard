"use client";

import { useRef } from "react";

export function VectorField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    fieldRef.current?.style.setProperty("--pointer-x", `${x}%`);
    fieldRef.current?.style.setProperty("--pointer-y", `${y}%`);
  }

  return (
    <div ref={fieldRef} className="vector-field" aria-hidden="true" onPointerMove={handlePointerMove}>
      <div className="vector-field__light" />
      <svg className="vector-field__map" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="signal-blue" x1="0" x2="1">
            <stop offset="0" stopColor="#0088ff" stopOpacity="0" />
            <stop offset=".46" stopColor="#18a0fb" stopOpacity=".72" />
            <stop offset="1" stopColor="#56c5ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="signal-orange" x1="0" x2="1">
            <stop offset="0" stopColor="#ff7800" stopOpacity="0" />
            <stop offset=".55" stopColor="#ff8a1d" stopOpacity=".9" />
            <stop offset="1" stopColor="#ffb05f" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="node-fill">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".3" stopColor="#45b9ff" />
            <stop offset="1" stopColor="#45b9ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="vector-field__grid">
          {Array.from({ length: 10 }, (_, index) => (
            <path key={`h-${index}`} d={`M0 ${90 + index * 78} H1440`} />
          ))}
          {Array.from({ length: 18 }, (_, index) => (
            <path key={`v-${index}`} d={`M${40 + index * 84} 0 V900`} />
          ))}
        </g>
        <path className="signal signal--blue" d="M-120 730 C180 650 260 280 570 360 S930 790 1560 220" />
        <path className="signal signal--soft" d="M-90 560 C250 610 290 90 710 250 S1050 680 1520 390" />
        <path className="signal signal--orange" d="M-60 800 C290 810 405 440 780 505 S1110 660 1510 120" />
        <g className="vector-field__nodes">
          <circle cx="563" cy="357" r="8" />
          <circle cx="786" cy="507" r="6" />
          <circle cx="1032" cy="600" r="9" />
          <circle cx="1195" cy="467" r="5" />
        </g>
      </svg>
      <div className="vector-field__noise" />
    </div>
  );
}
