/* ═══════════════════════════════════════════════════════
   OJAS — ParticleBackground.tsx
   Custom canvas animation for landing screen
═══════════════════════════════════════════════════════ */

import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, currentScreen } = useAppContext();
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W: number, H: number;
    let pts: Particle[] = [];
    const count = 55;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    class Particle {
      x = 0; y = 0; r = 0; vx = 0; vy = 0; a = 0; life = 0; max = 0; pink = false;
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.6 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.26;
        this.vy = -(Math.random() * 0.42 + 0.14);
        this.a = Math.random() * 0.38 + 0.1;
        this.life = 0;
        this.max = Math.random() * 260 + 120;
        this.pink = Math.random() > 0.5;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life++;
        if (this.life > this.max || this.y < -8) this.reset();
      }
    }

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      pts = [];
      for (let i = 0; i < count; i++) {
        const p = new Particle();
        p.life = Math.random() * p.max;
        pts.push(p);
      }
    };

    const draw = () => {
      if (prefersReducedMotion.matches || currentScreen !== 'landing') return;
      ctx.clearRect(0, 0, W, H);
      const isDark = theme === 'dark';
      
      pts.forEach(p => {
        p.update();
        const prog = p.life / p.max;
        const alpha = prog < 0.2 ? prog / 0.2 : prog > 0.8 ? (1 - prog) / 0.2 : 1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        // Colors from original app.js
        const col = p.pink
          ? (isDark ? '220,100,130' : '184,56,80')
          : (isDark ? '210,168,80'  : '184,137,42');
          
        ctx.fillStyle = `rgba(${col},${p.a * alpha})`;
        ctx.fill();
      });
      requestRef.current = requestAnimationFrame(draw);
    };

    init();
    window.addEventListener('resize', resize);
    requestRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [theme, currentScreen]);

  return (
    <canvas 
      ref={canvasRef} 
      id="particle-canvas"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
};

export default ParticleBackground;
