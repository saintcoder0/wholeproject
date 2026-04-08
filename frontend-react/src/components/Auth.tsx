/* ═══════════════════════════════════════════════════════
   OJAS — Auth.tsx  (Enhanced)
   Premium login / signup experience
═══════════════════════════════════════════════════════ */

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { api } from '../lib/api';

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'missing-api-key';

const Auth: React.FC = () => {
  const { setUserName, setIsAuth, setCurrentScreen, setToken, setBackendUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setNameInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setError('Please fill in all fields.');
        return;
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all fields.');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
    }

    try {
      setLoading(true);
      const data = isLogin
        ? await api.auth.login(email, password)
        : await api.auth.register(name, email, password);

      setToken(data.access_token);
      setBackendUser(data.user);
      setUserName(data.user.name);
      setIsAuth(true);
      setCurrentScreen('dashboard');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      if (!import.meta.env.VITE_FIREBASE_API_KEY) {
        setError('Firebase Config Missing! Please set VITE_FIREBASE_* variables in .env');
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const data = await api.auth.firebase(idToken);
      setToken(data.access_token);
      setBackendUser(data.user);
      setUserName(data.user.name);
      setIsAuth(true);
      setCurrentScreen('dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'An error occurred during Google sign-in.');
    } finally {
      setLoading(false);
    }
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

          <button type="submit" className="btn btn--gold btn--full auth-submit" disabled={loading}>
            {loading ? '⏳ Please wait...' : isLogin ? 'Sign In to Dashboard →' : 'Create My Account →'}
          </button>
        </form>

        {/* Google sign-in — only shown when Firebase is configured */}
        {isFirebaseConfigured && (
          <>
            <div className="auth-divider">
              <span className="auth-divider-line" />
              <span className="auth-divider-text">or continue with</span>
              <span className="auth-divider-line" />
            </div>
            <button
              type="button"
              className="btn btn--full"
              style={{ marginBottom: '1rem', background: '#fff', color: '#333', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <span>🌐</span> Sign in with Google
            </button>
          </>
        )}

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
