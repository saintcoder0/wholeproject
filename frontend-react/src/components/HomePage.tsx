/* ═══════════════════════════════════════════════════════
   OJAS — HomePage.tsx
   Full marketing landing page
═══════════════════════════════════════════════════════ */

import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import './extra.css';

const HomePage: React.FC = () => {
  const { setCurrentScreen, theme, setTheme } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sticky nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animated particle canvas (hero)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,137,42,${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const features = [
    { icon: '🌬️', title: 'Vata Analysis', desc: 'Understand your Air & Ether constitution — creativity, movement, and nervous system patterns.', color: 'var(--vata)' },
    { icon: '🔥', title: 'Pitta Analysis', desc: 'Explore your Fire & Water nature — metabolism, ambition, digestion, and transformation.', color: 'var(--pitta)' },
    { icon: '🍃', title: 'Kapha Analysis', desc: 'Discover your Earth & Water foundation — endurance, stability, and immunity strengths.', color: 'var(--kapha)' },
  ];

  const benefits = [
    { icon: '📜', label: 'Classical Texts', desc: 'Rooted in Charaka & Sushruta Samhita' },
    { icon: '⚖️', label: 'BMI + Dosha', desc: 'Prakriti-adjusted health metrics' },
    { icon: '🍎', label: 'Food Compass', desc: 'AI-powered food compatibility' },
    { icon: '🌿', label: 'Herb Guide', desc: 'Dravyaguna classical herb profiles' },
    { icon: '🕐', label: 'Dinacharya', desc: 'Personalised daily rhythm plan' },
    { icon: '🌦️', label: 'Seasonal Guide', desc: 'Ritucharya year-round balance' },
  ];

  const steps = [
    { num: '01', title: 'Answer 18 Questions', desc: 'Covering body, physiology, and psychology — the CCRAS/AYUSH validated framework.' },
    { num: '02', title: 'Discover Your Prakriti', desc: 'Get your personalised dosha profile with dual-dosha detection and score breakdown.' },
    { num: '03', title: 'Live in Balance', desc: 'Follow your custom diet, lifestyle, herb, and daily rhythm recommendations.' },
  ];

  return (
    <div className="hp-wrapper">
      {/* ── Nav ── */}
      <nav className={`hp-nav ${scrolled ? 'hp-nav--scrolled' : ''}`}>
        <div className="hp-nav-inner">
          <div className="hp-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            🪷 <span>OJAS</span>
          </div>
          <div className="hp-nav-links">
            <button className="hp-nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</button>
            <button className="hp-nav-link" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How It Works</button>
            <button
              className="hp-nav-dark"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="btn btn--outline btn--sm" onClick={() => setCurrentScreen('auth')}>Sign In</button>
            <button className="btn btn--rose btn--sm" onClick={() => setCurrentScreen('landing')}>Start Free →</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hp-hero">
        <canvas ref={canvasRef} className="hp-hero-canvas" />
        <div className="hp-hero-orb hp-hero-orb--1" />
        <div className="hp-hero-orb hp-hero-orb--2" />
        <div className="hp-hero-orb hp-hero-orb--3" />

        <div className="hp-hero-content">
          <div className="hp-hero-badge">🪷 Ancient Wisdom · Modern Precision</div>
          <h1 className="hp-hero-title">
            Know Your<br />
            <span className="hp-hero-gradient">Prakriti</span>
          </h1>
          <p className="hp-hero-sub">
            The world's most detailed AI-powered Ayurvedic constitution analyser.
            Discover your <em>Vata, Pitta, and Kapha</em> balance — rooted in classical texts, personalised for your modern life.
          </p>
          <div className="hp-hero-cta">
            <button className="btn btn--rose" style={{ fontSize: '1rem', padding: '1rem 2.6rem' }} onClick={() => setCurrentScreen('landing')}>
              Begin My Analysis →
            </button>
            <button className="btn btn--outline" style={{ fontSize: '1rem' }} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              How It Works
            </button>
          </div>
          <div className="hp-hero-stats">
            <div className="hp-stat"><span className="hp-stat-num">18</span><span className="hp-stat-label">Questions</span></div>
            <div className="hp-stat-div" />
            <div className="hp-stat"><span className="hp-stat-num">3</span><span className="hp-stat-label">Doshas</span></div>
            <div className="hp-stat-div" />
            <div className="hp-stat"><span className="hp-stat-num">∞</span><span className="hp-stat-label">Insights</span></div>
          </div>
        </div>

        <div className="hp-hero-scroll-indicator">
          <div className="hp-scroll-dot" />
        </div>
      </section>

      {/* ── Dosha Cards ── */}
      <section id="features" className="hp-section">
        <div className="hp-section-inner">
          <div className="hp-section-label">Your Constitution</div>
          <h2 className="hp-section-title">The Three Pillars of Life</h2>
          <p className="hp-section-sub">Each human constitution is a unique blend of the three fundamental energies described in classical Ayurveda.</p>

          <div className="hp-dosha-grid">
            {features.map(f => (
              <div key={f.title} className="hp-dosha-card">
                <div className="hp-dosha-icon" style={{ color: f.color }}>{f.icon}</div>
                <h3 className="hp-dosha-name" style={{ color: f.color }}>{f.title}</h3>
                <p className="hp-dosha-desc">{f.desc}</p>
                <div className="hp-dosha-accent" style={{ background: f.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="hp-section hp-section--alt">
        <div className="hp-section-inner">
          <div className="hp-section-label">The Process</div>
          <h2 className="hp-section-title">Three Steps to Balance</h2>

          <div className="hp-steps">
            {steps.map((s, i) => (
              <div key={s.num} className="hp-step">
                <div className="hp-step-num">{s.num}</div>
                {i < steps.length - 1 && <div className="hp-step-line" />}
                <div className="hp-step-content">
                  <h3 className="hp-step-title">{s.title}</h3>
                  <p className="hp-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits Grid ── */}
      <section className="hp-section">
        <div className="hp-section-inner">
          <div className="hp-section-label">What You Get</div>
          <h2 className="hp-section-title">Everything You Need</h2>
          <p className="hp-section-sub">A complete Ayurvedic life guide, not just a dosha quiz.</p>

          <div className="hp-benefits-grid">
            {benefits.map(b => (
              <div key={b.label} className="hp-benefit-card">
                <div className="hp-benefit-icon">{b.icon}</div>
                <div>
                  <div className="hp-benefit-label">{b.label}</div>
                  <div className="hp-benefit-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="hp-cta-banner">
        <div className="hp-cta-orb" />
        <div className="hp-section-inner" style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="hp-cta-title">Begin Your Journey Today</h2>
          <p className="hp-cta-sub">Free. Rooted in 5,000-year-old wisdom. Takes just 5 minutes.</p>
          <div className="hp-hero-cta">
            <button className="btn btn--rose" style={{ fontSize: '1rem', padding: '1rem 2.6rem' }} onClick={() => setCurrentScreen('landing')}>
              Discover My Prakriti →
            </button>
            <button className="btn btn--outline" style={{ fontSize: '1rem' }} onClick={() => setCurrentScreen('auth')}>
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-brand">🪷 OJAS</div>
          <p className="hp-footer-copy">
            Based on <em>Charaka Samhita</em> and <em>Sushruta Samhita</em> — for educational awareness only. Not medical advice.
          </p>
          <div className="hp-footer-links">
            <button className="hp-footer-link" onClick={() => setCurrentScreen('landing')}>Take the Quiz</button>
            <button className="hp-footer-link" onClick={() => setCurrentScreen('auth')}>Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
