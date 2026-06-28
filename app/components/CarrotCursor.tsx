'use client';
import { useEffect, useState } from 'react';

export default function CarrotCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 28,
        height: 28,
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-4px, -4px)',
        userSelect: 'none',
      }}
    >
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Carrot body */}
        <path d="M6 24 L14 4 L22 24 Z" fill="#FF6B2B" stroke="#E55A1C" strokeWidth="1"/>
        {/* Carrot lines */}
        <line x1="10" y1="12" x2="18" y2="14" stroke="#E55A1C" strokeWidth="0.8"/>
        <line x1="9" y1="17" x2="19" y2="19" stroke="#E55A1C" strokeWidth="0.8"/>
        {/* Carrot top greens */}
        <path d="M14 4 C12 0 8 1 10 3" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M14 4 C14 0 18 1 16 3" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M14 4 C11 -1 14 -2 14 2" stroke="#66BB6A" strokeWidth="1" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
  );
}
