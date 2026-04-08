import React from 'react';
import { useAppContext } from '../context/AppContext';
import Chatbot from './Chatbot';

const Dashboard: React.FC = () => {
  const { userName, scores, isAuth, setIsAuth, setCurrentScreen } = useAppContext();

  if (!isAuth) {
    setCurrentScreen('auth');
    return null;
  }

  const handleLogout = () => {
    setIsAuth(false);
    setCurrentScreen('auth');
  };

  return (
    <section id="screen-dashboard" className="screen active" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--ink)' }}>Hello, {userName || 'Seeker'}</h1>
        <button className="btn btn--outline" onClick={() => setCurrentScreen('landing')}>Home</button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="ana-card">
            <div className="card-head">
              <span className="card-icon">🌿</span>
              <h3 className="card-title">Your Profile</h3>
            </div>
            <div style={{ marginTop: '1.2rem' }}>
              <p style={{ color: 'var(--ink2)', marginBottom: '0.8rem' }}><strong>Status:</strong> Explorer</p>
              <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--gold)' }}>Current Dosha Scores</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>Vata: {scores.v}</span>
                  <span>Pitta: {scores.p}</span>
                  <span>Kapha: {scores.k}</span>
                </div>
                {(scores.v > 0 || scores.p > 0 || scores.k > 0) ? (
                  <button className="btn btn--gold btn--full btn--sm" style={{ marginTop: '1rem' }} onClick={() => setCurrentScreen('result')}>
                    View Full Results
                  </button>
                ) : (
                  <button className="btn btn--rose btn--full btn--sm" style={{ marginTop: '1rem' }} onClick={() => setCurrentScreen('explainer')}>
                    Take the Quiz
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="ana-card">
            <div className="card-head">
              <span className="card-icon">⚙️</span>
              <h3 className="card-title">Account Actions</h3>
            </div>
            <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button className="btn btn--outline btn--full" onClick={handleLogout}>Sign Out</button>
            </div>
          </div>

        </div>

        <div style={{ flex: '2 1 400px' }}>
          <Chatbot />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
