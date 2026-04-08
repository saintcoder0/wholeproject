/* ═══════════════════════════════════════════════════════
   OJAS — Dashboard.tsx (Enhanced)
   Premium user dashboard with stats, charts, greeting
═══════════════════════════════════════════════════════ */

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';
import Chatbot from './Chatbot';

const DOSHA_INFO: Record<string, { name: string; color: string; icon: string; element: string; tagline: string }> = {
  v: { name: 'Vata', color: 'var(--vata)',  icon: '🌬️', element: 'Air & Ether', tagline: 'Creative · Mobile · Quick' },
  p: { name: 'Pitta', color: 'var(--pitta)', icon: '🔥', element: 'Fire & Water', tagline: 'Sharp · Ambitious · Transformative' },
  k: { name: 'Kapha', color: 'var(--kapha)', icon: '🍃', element: 'Earth & Water', tagline: 'Stable · Enduring · Nourishing' },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const DonutChart: React.FC<{ v: number; p: number; k: number }> = ({ v, p, k }) => {
  const total = v + p + k || 1;
  const vPct = Math.round((v / total) * 100);
  const pPct = Math.round((p / total) * 100);
  const kPct = 100 - vPct - pPct;

  // SVG donut math
  const r = 42; const cx = 50; const cy = 50;
  const circ = 2 * Math.PI * r;

  const segments = [
    { pct: vPct, color: 'var(--vata)',  offset: 0 },
    { pct: pPct, color: 'var(--pitta)', offset: vPct },
    { pct: kPct, color: 'var(--kapha)', offset: vPct + pPct },
  ];

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', maxWidth: 180, display: 'block', margin: '0 auto' }}>
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth="12"
          strokeDasharray={`${(seg.pct / 100) * circ} ${circ}`}
          strokeDashoffset={`${-((seg.offset / 100) * circ - circ / 4)}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
      ))}
      <circle cx={cx} cy={cy} r="30" fill="var(--surface)" />
      <text x="50" y="47" textAnchor="middle" style={{ fontSize: 11, fill: 'var(--ink)', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
        Prakriti
      </text>
      <text x="50" y="60" textAnchor="middle" style={{ fontSize: 8.5, fill: 'var(--ink3)' }}>
        Balance
      </text>
    </svg>
  );
};

const StatBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink2)' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', color, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 50, background: 'var(--bg3)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 50,
          background: color,
          transition: 'width 1.4s cubic-bezier(.4,0,.2,1)',
          boxShadow: `0 0 8px ${color}60`,
        }} />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { userName, scores, isAuth, setIsAuth, setUserName, setCurrentScreen, backendUser, setScores } = useAppContext();
  const [, setLoading] = useState(true);

  if (!isAuth) {
    setCurrentScreen('auth');
    return null;
  }

  useEffect(() => {
    if (!isAuth) return;
    api.user.getResults()
      .then((res) => {
        if (res.quiz_completed) setScores(res.scores);
      })
      .catch((err) => console.error('Failed to load results:', err))
      .finally(() => setLoading(false));
  }, [isAuth]);

  const handleLogout = async () => {
    try { await api.auth.logout(); } catch {}
    setIsAuth(false);
    setUserName('');
    setCurrentScreen('auth');
  };

  const total = scores.v + scores.p + scores.k;
  const hasQuiz = total > 0;
  const sorted = hasQuiz ? Object.entries(scores).sort((a, b) => b[1] - a[1]) : [];
  const dominant = sorted[0]?.[0];
  const domInfo = dominant ? DOSHA_INFO[dominant] : null;
  const initials = getInitials(userName || 'Seeker');

  const quickStats = [
    { icon: '📋', label: 'Quiz Status', value: hasQuiz ? 'Completed' : 'Pending', accent: hasQuiz ? 'var(--kapha)' : 'var(--gold)' },
    { icon: '🔐', label: 'Auth Method', value: backendUser?.provider === 'password' ? 'Email' : 'Google', accent: 'var(--vata)' },
    { icon: '🌿', label: 'Dominant Dosha', value: domInfo?.name || '—', accent: domInfo?.color || 'var(--ink3)' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', zIndex: 1 }}>
      {/* Ambient background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 600, height: 600, top: -200, right: -200, borderRadius: '50%', background: domInfo?.color || 'var(--gold)', filter: 'blur(120px)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: -100, left: -100, borderRadius: '50%', background: 'var(--rose)', filter: 'blur(100px)', opacity: 0.05 }} />
      </div>

      {/* ── Top Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface2)', backdropFilter: 'blur(20px)',
        padding: '0.85rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🪷</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.06em' }}>OJAS</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginLeft: '0.4rem', padding: '0.15rem 0.55rem', background: 'rgba(184,137,42,.1)', borderRadius: 20 }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button className="btn btn--outline btn--sm" onClick={() => setCurrentScreen('landing')}>Home</button>
          <button className="btn btn--sm" style={{ background: 'var(--bg2)', color: 'var(--ink2)', border: '1px solid var(--border)' }} onClick={handleLogout}>Sign Out</button>
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: domInfo?.color || 'var(--gold)',
            color: '#fff', fontSize: '0.78rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 0 2px var(--surface), 0 0 0 4px ${domInfo?.color || 'var(--gold)'}40`,
            cursor: 'default',
          }}>
            {initials}
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem', position: 'relative', zIndex: 1 }}>

        {/* ── Greeting Header ── */}
        <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.6s ease both' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            {getGreeting()}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
            {userName || 'Seeker'} <span style={{ color: 'var(--gold)' }}>✦</span>
          </h1>
          {backendUser?.email && (
            <p style={{ color: 'var(--ink3)', fontSize: '0.85rem', marginTop: '0.3rem' }}>{backendUser.email}</p>
          )}
        </div>

        {/* ── Quick Stats Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {quickStats.map((s, i) => (
            <div key={i} className="ana-card" style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1.2rem 1.4rem', marginBottom: 0,
              borderLeft: `3px solid ${s.accent}`,
              animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            }}>
              <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>{s.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: s.accent }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '1.5rem' }}>

          {/* ── Left Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Dosha Profile Card */}
            <div className="ana-card" style={{ padding: '1.8rem', marginBottom: 0, textAlign: 'center', animation: 'fadeUp 0.5s ease 0.2s both' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--ink3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem' }}>Your Prakriti</div>

              {hasQuiz ? (
                <>
                  <DonutChart v={scores.v} p={scores.p} k={scores.k} />

                  <div style={{ marginTop: '1.2rem' }}>
                    <StatBar label={`🌬️ Vata`} value={scores.v} total={total} color="var(--vata)" />
                    <StatBar label={`🔥 Pitta`} value={scores.p} total={total} color="var(--pitta)" />
                    <StatBar label={`🍃 Kapha`} value={scores.k} total={total} color="var(--kapha)" />
                  </div>

                  {domInfo && (
                    <div style={{
                      marginTop: '1.2rem', padding: '1rem',
                      borderRadius: 14, background: 'var(--bg2)',
                      border: `1px solid ${domInfo.color}40`,
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{domInfo.icon}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: domInfo.color, fontWeight: 700 }}>{domInfo.name} Dominant</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink3)', marginTop: '0.2rem' }}>{domInfo.element}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink2)', marginTop: '0.5rem', fontStyle: 'italic' }}>{domInfo.tagline}</div>
                    </div>
                  )}

                  <button className="btn btn--gold btn--full btn--sm" style={{ marginTop: '1rem', maxWidth: '100%' }} onClick={() => setCurrentScreen('result')}>
                    View Full Analysis →
                  </button>
                </>
              ) : (
                <div style={{ padding: '1.5rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.8rem', opacity: 0.5 }}>🌀</div>
                  <p style={{ color: 'var(--ink3)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                    You haven't taken the Prakriti quiz yet. Discover your Ayurvedic constitution.
                  </p>
                  <button className="btn btn--rose btn--full btn--sm" style={{ maxWidth: '100%' }} onClick={() => setCurrentScreen('explainer')}>
                    Take the Quiz →
                  </button>
                </div>
              )}
            </div>

            {/* Account Card */}
            <div className="ana-card" style={{ padding: '1.5rem', marginBottom: 0, animation: 'fadeUp 0.5s ease 0.35s both' }}>
              <div className="card-head" style={{ marginBottom: '1rem' }}>
                <span className="card-icon">⚙️</span>
                <h3 className="card-title">Account</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--ink3)' }}>Name</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{userName || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--ink3)' }}>Provider</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{backendUser?.provider === 'password' ? '📧 Email' : '🌐 Google'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--ink3)' }}>Quiz</span>
                  <span style={{ color: hasQuiz ? 'var(--kapha)' : 'var(--gold)', fontWeight: 600 }}>{hasQuiz ? '✅ Done' : '⏳ Pending'}</span>
                </div>
              </div>
              <button
                className="btn btn--outline btn--full btn--sm"
                style={{ marginTop: '1.2rem', maxWidth: '100%', color: 'var(--rose)', borderColor: 'rgba(184,56,80,.35)' }}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* ── Right Column: Chatbot ── */}
          <div style={{ animation: 'fadeUp 0.5s ease 0.3s both' }}>
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
