/* ═══════════════════════════════════════════════════════
   OJAS — Explainer.tsx
   Pre-quiz intro
═══════════════════════════════════════════════════════ */

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../data/icons';

const Explainer: React.FC = () => {
  const { t, setCurrentScreen } = useAppContext();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleStartQuiz = () => {
    setCurrentScreen('quiz');
  };

  const handleBack = () => {
    setCurrentScreen('landing');
  };

  return (
    <section id="screen-explainer" className={`screen ${animate ? 'active' : ''}`}>
       <button className="name-back-btn" onClick={handleBack} style={{ position: 'absolute', top: '1.2rem', left: '1.4rem' }}>
          {t('name.back')}
        </button>

      <div className={`explainer-content ${animate ? 'animate' : ''}`}>
        <h2 className="explainer-title">{t('explainer.title')}</h2>
        <p className="explainer-desc">{t('explainer.desc')}</p>

        <div className="explainer-doshas">
          <div className="explainer-dosha" id="exp-vata">
            <div className="explainer-icon" dangerouslySetInnerHTML={{ __html: ICONS.vata }} />
            <div>
              <h3>Vata</h3>
              <p>{t('exp.vata.desc')}</p>
            </div>
          </div>
          <div className="explainer-dosha" id="exp-pitta">
            <div className="explainer-icon" dangerouslySetInnerHTML={{ __html: ICONS.pitta }} />
            <div>
              <h3>Pitta</h3>
              <p>{t('exp.pitta.desc')}</p>
            </div>
          </div>
          <div className="explainer-dosha" id="exp-kapha">
            <div className="explainer-icon" dangerouslySetInnerHTML={{ __html: ICONS.kapha }} />
            <div>
              <h3>Kapha</h3>
              <p>{t('exp.kapha.desc')}</p>
            </div>
          </div>
        </div>

        <button 
          className="btn btn--rose" 
          id="btn-start-quiz" 
          onClick={handleStartQuiz}
          style={{ opacity: animate ? 1 : 0, transition: 'all 0.6s ease 1.2s' }}
        >
          {t('btn.start.quiz')}
        </button>
      </div>
    </section>
  );
};

export default Explainer;
