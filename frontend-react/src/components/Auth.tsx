/* ═══════════════════════════════════════════════════════
   OJAS — Auth.tsx  (Enhanced)
   Premium login / signup experience
═══════════════════════════════════════════════════════ */

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const Auth: React.FC = () => {
  const { setUserName, setIsAuth, setCurrentScreen } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setNameInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const nameVal = isLogin ? email : name;
    if (!nameVal.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setUserName(nameVal.trim());
    setIsAuth(true);
    setCurrentScreen('dashboard');
  };

  return (
    <section id="screen-auth" className={`screen active auth-screen ${mounted ? 'auth-mounted' : ''}`}>
      {/* Background orbs */}
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />
      <div className="auth-orb auth-orb--3" />

      {/* Back button */}
      <button className="auth-back" onClick={() => setCurrentScreen('home')}>
        ← Back
      </button>

      <div className="auth-card">
        {/* Lotus logo */}
        <div className="auth-logo">
          <span className="auth-lotus">🪷</span>
          <span className="auth-brand-name">OJAS</span>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Start Your Journey'}</h2>
          <p className="auth-sub">
            {isLogin
              ? 'Sign in to access your Prakriti dashboard and history.'
              : 'Create an account to save your results and track your balance.'}
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                className="auth-input"
                placeholder="Arjun Kumar"
                value={name}
                onChange={e => setNameInput(e.target.value)}
                autoFocus={!isLogin}
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">{isLogin ? 'Username or Email' : 'Email Address'}</label>
            <input
              type="text"
              className="auth-input"
              placeholder={isLogin ? 'your@email.com' : 'your@email.com'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus={isLogin}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn--gold btn--full auth-submit">
            {isLogin ? 'Sign In to Dashboard →' : 'Create My Account →'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or continue as</span>
          <span className="auth-divider-line" />
        </div>

        {/* Guest quiz link */}
        <button className="auth-guest" onClick={() => setCurrentScreen('landing')}>
          🪷 Take the quiz without an account
        </button>

        {/* Toggle */}
        <p className="auth-toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button className="auth-toggle-link" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Auth;
