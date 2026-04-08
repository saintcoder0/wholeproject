/* ═══════════════════════════════════════════════════════
   OJAS — BMICalculator.tsx
   Ayurvedic-Adjusted BMI & Health Profiler
═══════════════════════════════════════════════════════ */

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const BMICalculator: React.FC = () => {
  const { t, scores } = useAppContext();
  const [isMetric, setIsMetric] = useState(true);
  const [age, setAge] = useState<number>(() => Number(localStorage.getItem('ojas_bmi_age')) || 0);
  const [gender, setGender] = useState<'male' | 'female'>(() => (localStorage.getItem('ojas_bmi_gender') as 'male' | 'female') || 'male');
  const [activity] = useState<number>(() => Number(localStorage.getItem('ojas_bmi_activity')) || 1.55);
  
  // Metric
  const [kg, setKg] = useState<number>(() => Number(localStorage.getItem('ojas_bmi_kg')) || 0);
  const [cm, setCm] = useState<number>(() => Number(localStorage.getItem('ojas_bmi_cm')) || 0);
  
  // Imperial
  const [lbs, setLbs] = useState<number>(() => Number(localStorage.getItem('ojas_bmi_lbs')) || 0);
  const [ft, setFt] = useState<number>(() => Number(localStorage.getItem('ojas_bmi_ft')) || 0);
  const [inch, setInch] = useState<number>(() => Number(localStorage.getItem('ojas_bmi_in')) || 0);

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('ojas_bmi_age', String(age));
    localStorage.setItem('ojas_bmi_gender', gender);
    localStorage.setItem('ojas_bmi_activity', String(activity));
    localStorage.setItem('ojas_bmi_kg', String(kg));
    localStorage.setItem('ojas_bmi_cm', String(cm));
    localStorage.setItem('ojas_bmi_lbs', String(lbs));
    localStorage.setItem('ojas_bmi_ft', String(ft));
    localStorage.setItem('ojas_bmi_in', String(inch));
  }, [age, gender, activity, kg, cm, lbs, ft, inch]);

  const calculate = () => {
    let w, h;
    if (isMetric) {
      w = kg;
      h = cm / 100;
    } else {
      w = lbs * 0.453592;
      h = ((ft * 12) + inch) * 0.0254;
    }

    if (!w || !h || w <= 0 || h <= 0) return;

    const bmi = w / (h * h);
    const tot = scores.v + scores.p + scores.k;
    
    // Dosha shift logic from original result.js
    const vPct = scores.v / tot;
    const kPct = scores.k / tot;
    const shift = (vPct * -2.0) + (kPct * 2.5);
    
    const underThreshold = 18.5 + shift;
    const overThreshold = 25.0 + shift;
    
    let status = '';
    let color = '';
    
    if (bmi < underThreshold) { status = 'Underweight'; color = 'var(--vata)'; }
    else if (bmi < overThreshold) { status = 'Healthy / Sama'; color = 'var(--kapha)'; }
    else { status = 'Overweight'; color = 'var(--pitta)'; }

    setResult({ bmi, status, color, shift });
  };

  return (
    <div className="ana-card" id="bmi-card">
      <div className="card-head" style={{ marginBottom: '.9rem' }}>
        <span className="card-icon">⚖️</span>
        <h3 className="card-title">{t('Prakriti-Adjusted BMI & Health')}</h3>
      </div>
      
      <p style={{ fontSize: '.82rem', color: 'var(--ink2)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
        Adjusted by your unique Dosha profile.
      </p>
      
      <div className="pill-tabs" style={{ width: '100%', marginBottom: '1.2rem' }}>
        <button className={`pill-tab ${isMetric ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setIsMetric(true)}>{t('Metric')}</button>
        <button className={`pill-tab ${!isMetric ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setIsMetric(false)}>{t('Imperial')}</button>
      </div>
      
      <div className="bmi-input-grid">
        <div className="bmi-field-group">
          <label className="bmi-label">{t('Age')}</label>
          <input type="number" className="bmi-input" value={age || ''} onChange={e => setAge(Number(e.target.value))} />
        </div>
        <div className="bmi-field-group">
          <label className="bmi-label">{t('Gender')}</label>
          <select className="bmi-input bmi-select" value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}>
            <option value="male">{t('Male')}</option>
            <option value="female">{t('Female')}</option>
          </select>
        </div>
      </div>

      {isMetric ? (
        <div className="bmi-input-grid" style={{ marginTop: '0.5rem' }}>
          <div className="bmi-field-group">
            <label className="bmi-label">Weight (kg)</label>
            <input type="number" className="bmi-input" value={kg || ''} onChange={e => setKg(Number(e.target.value))} />
          </div>
          <div className="bmi-field-group">
            <label className="bmi-label">Height (cm)</label>
            <input type="number" className="bmi-input" value={cm || ''} onChange={e => setCm(Number(e.target.value))} />
          </div>
        </div>
      ) : (
        <div className="bmi-input-grid" style={{ marginTop: '0.5rem' }}>
          <div className="bmi-field-group--full">
            <label className="bmi-label">Weight (lbs)</label>
            <input type="number" className="bmi-input" value={lbs || ''} onChange={e => setLbs(Number(e.target.value))} />
          </div>
          <div className="bmi-field-group">
            <label className="bmi-label">Height (ft)</label>
            <input type="number" className="bmi-input" value={ft || ''} onChange={e => setFt(Number(e.target.value))} />
          </div>
          <div className="bmi-field-group">
            <label className="bmi-label">Height (in)</label>
            <input type="number" className="bmi-input" value={inch || ''} onChange={e => setInch(Number(e.target.value))} />
          </div>
        </div>
      )}

      <button className="btn btn--gold btn--full" style={{ marginTop: '1rem' }} onClick={calculate}>
        {t('bmi.calc.btn')}
      </button>
      
      {result && (
        <div id="bmi-output" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{result.bmi.toFixed(1)}</div>
          <div style={{ color: result.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{result.status}</div>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Dosha adjustment: {result.shift.toFixed(1)}</p>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
