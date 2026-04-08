/* ═══════════════════════════════════════════════════════
   OJAS — FoodChecker.tsx
   AI-powered food compatibility analyzer
═══════════════════════════════════════════════════════ */

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FOOD_DB } from '../data/foodDb';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const FoodChecker: React.FC = () => {
  const { scores } = useAppContext();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'brief' | 'detailed'>('brief');

  const domId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const doshaName = domId === 'v' ? 'Vata' : (domId === 'p' ? 'Pitta' : 'Kapha');

  const analyzeFood = async (foodName: string) => {
    setLoading(true);
    setResult(null);

    // 1. Check local DB first
    const local = FOOD_DB.find(f => f.name.toLowerCase() === foodName.toLowerCase());
    if (local) {
      // For local results, we'll still call the AI for the "brief" and "detailed" text to maintain UX
      // Actually, for simplicity and speed, let's just use the AI for everything but prioritize the DB for "V/P/K" values if they differ.
    }

    try {
      const prompt = `You are an expert Ayurvedic practitioner. Analyze the food "${foodName}" for a person whose dominant dosha is ${doshaName}. 
      Return ONLY a valid JSON object with EXACTLY this structure, no markdown formatting:
      {
        "vata": "+" or "-" or "0",
        "pitta": "+" or "-" or "0",
        "kapha": "+" or "-" or "0",
        "brief": "A 1-2 sentence brief insight on why this is good/bad specifically for ${doshaName} dosha.",
        "detailed": "A detailed 3-4 sentence explanation covering the food's Rasa (taste), Virya (energy), Vipaka (post-digestive effect), and Gunas (qualities), and exactly how it impacts ${doshaName}."
      }`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      setResult(JSON.parse(cleanText));
    } catch (e) {
      console.error(e);
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) analyzeFood(query);
  };

  const getBadge = (res: any) => {
    const effect = res[domId === 'v' ? 'vata' : (domId === 'p' ? 'pitta' : 'kapha')];
    if (effect === '-') return { label: `Beneficial for ${doshaName}`, class: 'badge-green', emoji: '🟢' };
    if (effect === '+') return { label: `Avoid if ${doshaName}`, class: 'badge-red', emoji: '🔴' };
    return { label: `Neutral for ${doshaName}`, class: 'badge-amber', emoji: '🟡' };
  };

  return (
    <div className="ana-card" id="food-checker-card">
      <div className="card-head" style={{ marginBottom: '1.5rem' }}>
        <span className="card-icon">🍎</span>
        <h3 className="card-title">Food Compatibility</h3>
      </div>
      
      <div className="food-search-wrapper" style={{ position: 'relative', display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
        <input 
          type="text" 
          className="food-search-input name-field" 
          style={{ flex: 1, padding: '0.85rem 1.2rem', textAlign: 'left' }}
          placeholder="Search any food (e.g. Kombucha)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn--gold btn-food-analyze" onClick={handleSearch} disabled={loading}>
          {loading ? '...' : 'Analyze'}
        </button>
      </div>

      <div id="food-suggestions" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['Turmeric', 'Ghee', 'Honey', 'Ginger', 'Milk', 'Quinoa'].map(f => (
          <button key={f} className="food-chip" onClick={() => { setQuery(f); analyzeFood(f); }}>{f}</button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
          <div className="pulsing-dots">
            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--ink3)' }}>Consulting ancient texts...</div>
        </div>
      )}

      {result && !result.error && (
        <div className="result-card-anim" style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div className={`compat-badge ${getBadge(result).class}`} style={{ marginBottom: '0.85rem' }}>
              {getBadge(result).emoji} {getBadge(result).label}
            </div>
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.85rem', color: 'var(--ink)', margin: 0 }}>
              {query}
            </h4>
          </div>

          <div className="pill-tabs" style={{ marginBottom: '1.2rem' }}>
            <button className={`pill-tab ${activeTab === 'brief' ? 'active' : ''}`} onClick={() => setActiveTab('brief')}>Quick Read</button>
            <button className={`pill-tab ${activeTab === 'detailed' ? 'active' : ''}`} onClick={() => setActiveTab('detailed')}>Deep Dive</button>
          </div>

          <div className="food-panel" style={{ display: 'block', background: 'var(--bg2)', padding: '1.4rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '.88rem', color: 'var(--ink2)', lineHeight: 1.65 }}>
            {activeTab === 'brief' ? result.brief : result.detailed}
          </div>
        </div>
      )}

      {result?.error && (
        <div style={{ color: '#ef4444', padding: '1rem', textAlign: 'center' }}>Error communicating with AI.</div>
      )}
    </div>
  );
};

export default FoodChecker;
