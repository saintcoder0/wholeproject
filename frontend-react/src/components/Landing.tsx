/* ═══════════════════════════════════════════════════════
   OJAS — Landing.tsx
   Landing screen and name input
═══════════════════════════════════════════════════════ */

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../data/icons';
import ParticleBackground from './ParticleBackground';

const Landing: React.FC = () => {
  const { t, userName, setUserName, setCurrentScreen, theme, setTheme, lang, setLang } = useAppContext();
  const [isNamePanelOpen, setIsNamePanelOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleEnter = () => {
    setIsNamePanelOpen(true);
  };

  const handleStart = () => {
    if (!userName.trim()) {
      setError(true);
      setTimeout(() => setError(false), 380);
      return;
    }
    setCurrentScreen('explainer');
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(lang === 'en' ? 'hi' : 'en');

  return (
    <section id="screen-landing" className="screen active">
      <ParticleBackground />
      <div className="land-bg">
        <div className="land-orb land-orb--1"></div>
        <div className="land-orb land-orb--2"></div>
        <div className="land-orb land-orb--3"></div>
      </div>

      <button id="dark-btn" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="land-splash">
        <div className="land-lotus">{ICONS.lotus}</div>
        <h1 className="brand-title">OJAS</h1>
        <div className="brand-sub">{t('brand.sub')}</div>
        
        <div className="dosha-pills">
          <div className="pill pill--vata">Vata</div>
          <div className="pill pill--pitta">Pitta</div>
          <div className="pill pill--kapha">Kapha</div>
        </div>

        <p className="land-desc" dangerouslySetInnerHTML={{ __html: t('land.desc') }} />

        <div className="land-features">
          <div className="feat">
            <span dangerouslySetInnerHTML={{ __html: ICONS.classical }} />
            <span>{t('feat.classical')}</span>
          </div>
          <div className="feat">
            <span dangerouslySetInnerHTML={{ __html: ICONS.diet }} />
            <span>{t('feat.diet')}</span>
          </div>
          <div className="feat">
            <span dangerouslySetInnerHTML={{ __html: ICONS.rhythm }} />
            <span>{t('feat.rhythm')}</span>
          </div>
        </div>

        <button className="btn btn--rose" id="btn-enter" onClick={handleEnter}>
          {t('btn.enter')}
        </button>

        <button 
          className="btn btn--outline" 
          style={{ marginTop: '1rem', width: '200px' }} 
          onClick={() => setCurrentScreen('auth')}
        >
          {t('Sign In / Dashboard')}
        </button>
      </div>

      {/* Name Panel */}
      <div className={`land-name-panel ${isNamePanelOpen ? 'open' : ''}`}>
        <button className="name-back-btn" onClick={() => setIsNamePanelOpen(false)}>
          {t('name.back')}
        </button>
        
        <div className="name-panel-inner">
          <div className="name-lotus">{ICONS.lotus}</div>
          <h2 className="name-title">{t('name.title')}</h2>
          <p className="name-sub">{t('name.sub')}</p>
          
          <input 
            type="text" 
            className={`name-field ${error ? 'shake' : ''}`}
            placeholder={t('name.placeholder')}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />
          
          <button className="btn btn--rose btn--full" onClick={handleStart}>
            {t('btn.start')}
          </button>
          
          <div className="name-hint">{t('name.hint')}</div>
        </div>
      </div>

      {/* Language Switcher */}
      <button 
        onClick={toggleLang}
        style={{
          position: 'fixed', bottom: '1rem', right: '1rem',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '0.4rem 0.8rem', cursor: 'pointer',
          fontSize: '0.75rem', fontWeight: 'bold'
        }}
      >
        {lang === 'en' ? 'हिन्दी' : 'English'}
      </button>
    </section>
  );
};

export default Landing;
