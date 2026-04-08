/* ═══════════════════════════════════════════════════════
   OJAS — Result.tsx (Updated)
   Detailed Prakriti Analysis & Tools
═══════════════════════════════════════════════════════ */

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DOSHA_EN } from '../data/prakriti';
import type { DoshaInfo } from '../data/prakriti';
import { ICONS } from '../data/icons';
import BMICalculator from './BMICalculator';
import FoodChecker from './FoodChecker';

interface DualTabCardProps {
  icon: string;
  title: string;
  domData: DoshaInfo;
  secData?: DoshaInfo;
  isDual: boolean;
  renderContent: (data: DoshaInfo) => React.ReactNode;
}

const DualTabCard: React.FC<DualTabCardProps> = ({ icon, title, domData, secData, isDual, renderContent }) => {
  const [activeTab, setActiveTab] = useState<'dom' | 'sec'>('dom');

  return (
    <div className="ana-card dual-tab-card">
      <div className="card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="card-icon" dangerouslySetInnerHTML={{ __html: icon }} />
          <h4 className="card-title">{title}</h4>
        </div>
      </div>

      {isDual && secData && (
        <div className="pill-tabs" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <button className={`pill-tab ${activeTab === 'dom' ? 'active' : ''}`} onClick={() => setActiveTab('dom')}>
             {domData.name} ({activeTab === 'dom' ? 'Primary' : 'Primary'})
          </button>
          <button className={`pill-tab ${activeTab === 'sec' ? 'active' : ''}`} onClick={() => setActiveTab('sec')}>
             {secData.name} (Secondary)
          </button>
        </div>
      )}

      <div className="card-body" style={{ marginTop: '1rem' }}>
        {renderContent(activeTab === 'dom' ? domData : (secData || domData))}
      </div>
    </div>
  );
};

const Result: React.FC = () => {
  const { t, userName, scores, setCurrentScreen } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'tools'>('overview');

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const domId = sorted[0][0];
  const secId = sorted[1][0];
  const domScore = sorted[0][1];
  const secScore = sorted[1][1];
  
  const isDual = (domScore - secScore) <= 2;
  const domData = DOSHA_EN[domId];
  const secData = DOSHA_EN[secId];
  const total = scores.v + scores.p + scores.k;

  const pct = (s: number) => Math.round((s / total) * 100);

  const handleRetake = () => setCurrentScreen('landing');

  return (
    <section id="screen-result" className={`screen active ${domData.bgClass}`}>
        <div className="res-nav">
          <div className="brand" dangerouslySetInnerHTML={{ __html: ICONS.lotus }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn--outline btn--sm" id="btn-retake" onClick={handleRetake}>
              <span dangerouslySetInnerHTML={{ __html: ICONS.rhythm }} /> {t('res.retake')}
            </button>
            <button className="btn btn--gold btn--sm" onClick={() => setCurrentScreen('dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>

      <div className="res-scroll">
        <div className={`res-hero res-theme--${domId}`}>
           <span className="res-dosha-icon" dangerouslySetInnerHTML={{ __html: domData.icon }} />
           <h2 className="res-name">{userName}, your Prakriti is {domData.name}</h2>
           <div className="res-element">{domData.element}</div>
           
           <div className="score-row">
             <div className="sc sc--v">Vata {pct(scores.v)}%</div>
             <div className="sc sc--p">Pitta {pct(scores.p)}%</div>
             <div className="sc sc--k">Kapha {pct(scores.k)}%</div>
           </div>

           <div className="traits">
             {domData.traits.map(trait => (
               <span key={trait} className={`trait ${domData.traitClass}`}>{trait}</span>
             ))}
           </div>
        </div>

        <div className="res-tabs">
          <button className={`res-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            {t('tab.overview')}
          </button>
          <button className={`res-tab-btn ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>
            {t('tab.insights')}
          </button>
          <button className={`res-tab-btn ${activeTab === 'tools' ? 'active' : ''}`} onClick={() => setActiveTab('tools')}>
            {t('tab.tools')}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="res-tab-panel active">
            <div className="breakdown">
              <h3 className="breakdown-title">{t('Dosha Score Breakdown')}</h3>
              <div className="b-row">
                <div className="b-label b-label--v">Vata</div>
                <div className="b-track"><div className="b-bar b-bar--v" style={{ width: `${pct(scores.v)}%` }}></div></div>
                <div className="b-pct">{pct(scores.v)}%</div>
              </div>
              <div className="b-row">
                <div className="b-label b-label--p">Pitta</div>
                <div className="b-track"><div className="b-bar b-bar--p" style={{ width: `${pct(scores.p)}%` }}></div></div>
                <div className="b-pct">{pct(scores.p)}%</div>
              </div>
              <div className="b-row">
                <div className="b-label b-label--k">Kapha</div>
                <div className="b-track"><div className="b-bar b-bar--k" style={{ width: `${pct(scores.k)}%` }}></div></div>
                <div className="b-pct">{pct(scores.k)}%</div>
              </div>
            </div>

            <div className="ana-card">
              <div className="card-head"><h4 className="card-title">{t('Why This Is Your Prakriti')}</h4></div>
              <p className="why-text">{domData.why}</p>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="res-tab-panel active">
            <DualTabCard 
              icon={ICONS.imbalance} 
              title={t('Signs of Imbalance')} 
              domData={domData} secData={secData} isDual={isDual}
              renderContent={(d) => (
                <div className="imbalance-grid">
                  {d.imbalance.map(item => <div key={item} className="ib-tag">{item}</div>)}
                </div>
              )}
            />
            <DualTabCard 
              icon={ICONS.rhythm} 
              title={t('Lifestyle — Vihāra')} 
              domData={domData} secData={secData} isDual={isDual}
              renderContent={(d) => (
                <div className="pa-cols">
                  <div className="pa-col favour">
                    <h4>{t('✓ Favour')}</h4>
                    <ul className="pa-list">{d.lifestyle.prefer.map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                  <div className="pa-col avoid">
                    <h4>{t('✕ Reduce / Avoid')}</h4>
                    <ul className="pa-list">{d.lifestyle.avoid.map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                </div>
              )}
            />
            <DualTabCard 
              icon={ICONS.exercise} 
              title={t('Exercise — Vyāyāma')} 
              domData={domData} secData={secData} isDual={isDual}
              renderContent={(d) => (
                <div className="pa-cols">
                  <div className="pa-col favour">
                    <h4>{t('✓ Favour')}</h4>
                    <ul className="pa-list">{d.exercise.prefer.map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                  <div className="pa-col avoid">
                    <h4>{t('✕ Reduce / Avoid')}</h4>
                    <ul className="pa-list">{d.exercise.avoid.map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                </div>
              )}
            />
            <DualTabCard 
              icon={ICONS.rhythm} 
              title={t('Daily Rhythm — Dinacharya')} 
              domData={domData} secData={secData} isDual={isDual}
              renderContent={(d) => (
                <div className="rhythm-panel">
                  {d.rhythm.map((r, i) => (
                    <div key={i} className="rhythm-item">
                      <div className="rhythm-time">{r.time}</div>
                      <div className="rhythm-action">{r.action}</div>
                    </div>
                  ))}
                </div>
              )}
            />
            <DualTabCard 
              icon={ICONS.kapha} 
              title={t('Classical Herbs — Dravyaguna')} 
              domData={domData} secData={secData} isDual={isDual}
              renderContent={(d) => (
                <div className="herb-panel">
                  {d.herbs.map((h, i) => (
                    <div key={i} className="herb-card">
                      <div className="herb-icon" dangerouslySetInnerHTML={{ __html: h.icon }} />
                      <div className="herb-info">
                        <strong>{h.name}</strong> <em>({h.sanskrit})</em>
                        <p>{h.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="res-tab-panel active">
            <BMICalculator />
            <FoodChecker />
          </div>
        )}
        
        <p className="disclaimer">{t('disclaimer')}</p>
      </div>
    </section>
  );
};

export default Result;
