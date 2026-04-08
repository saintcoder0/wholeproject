/* ═══════════════════════════════════════════════════════
   OJAS — Quiz.tsx
   18-question Prakriti Analysis
═══════════════════════════════════════════════════════ */

import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { QUESTIONS_EN } from '../data/prakriti';
import type { Question } from '../data/prakriti';
import { translations } from '../data/i18n';
import { api } from '../lib/api';

const Quiz: React.FC = () => {
  const { t, lang, setScores, setCurrentScreen, isAuth } = useAppContext();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<('v' | 'p' | 'k')[]>([]);
  const [isExiting, setIsExiting] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState<string | null>(null);

  const questions = (translations[lang] ? QUESTIONS_EN : QUESTIONS_EN) as Question[];
  // Note: I'll need to make sure QUESTIONS_HI is also available or questions mapping is correct

  const currentQuestion = questions[currentQIndex];

  const handleAnswer = useCallback((dosha: 'v' | 'p' | 'k') => {
    // Show flash
    const emojis = { v: '🌬️', p: '🔥', k: '🍃' };
    setShowFlash(emojis[dosha]);
    setTimeout(() => setShowFlash(null), 500);

    // Update answers
    const newAnswers = [...userAnswers];
    newAnswers[currentQIndex] = dosha;
    setUserAnswers(newAnswers);

    // Transition to next or result
    if (currentQIndex < questions.length - 1) {
      setIsExiting('exit-l');
      setTimeout(() => {
        setCurrentQIndex(prev => prev + 1);
        setIsExiting('enter');
      }, 280);
    } else {
      // Calculate final scores
      const finalScores = newAnswers.reduce((acc, d) => {
        acc[d]++;
        return acc;
      }, { v: 0, p: 0, k: 0 });
      
      setScores(finalScores);

      // Save to MongoDB if user is logged in
      if (isAuth) {
        api.user.saveResults(finalScores)
          .catch((err) => console.error('Failed to save quiz results:', err));
      }

      setCurrentScreen('result');
    }
  }, [currentQIndex, questions.length, setScores, setCurrentScreen, userAnswers]);

  const handleBack = () => {
    if (currentQIndex > 0) {
      setIsExiting('exit-r');
      setTimeout(() => {
        setCurrentQIndex(prev => prev - 1);
        setIsExiting('enter');
      }, 280);
    } else {
      setCurrentScreen('explainer');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFlash) return;
      if (e.key.toLowerCase() === 'a') handleAnswer(currentQuestion.opts[0].d);
      if (e.key.toLowerCase() === 'b') handleAnswer(currentQuestion.opts[1].d);
      if (e.key.toLowerCase() === 'c') handleAnswer(currentQuestion.opts[2].d);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, handleAnswer, showFlash]);

  const progress = ((currentQIndex + 1) / questions.length) * 100;

  return (
    <section id="screen-quiz" className="screen active">
      <div className="quiz-topbar">
        <div className="quiz-counter">Q {currentQIndex + 1} / {questions.length}</div>
        <div className="dosha-live">
          {/* Live scores could be added here if desired */}
        </div>
      </div>

      <div className="quiz-progress">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="quiz-nav-row">
        <button className="btn-back" onClick={handleBack}>
          {t('quiz.back')}
        </button>
      </div>

      <div className="quiz-stage">
        <div className="q-ghost q-ghost--1"></div>
        <div className="q-ghost q-ghost--2"></div>

        <div className={`q-card ${isExiting || 'enter'}`}>
          <div className="q-meta">
            <div className="q-icon-wrap" dangerouslySetInnerHTML={{ __html: currentQuestion.icon }} />
            <div className="q-category">{currentQuestion.cat}</div>
          </div>

          <h3 className="q-text">{currentQuestion.text}</h3>

          <div className="q-options">
            {currentQuestion.opts.map((opt, i) => (
              <button 
                key={i}
                className="opt" 
                data-d={opt.d}
                onClick={() => handleAnswer(opt.d)}
              >
                <div className="opt-letter">{String.fromCharCode(65 + i)}</div>
                <span>{opt.t}</span>
              </button>
            ))}
          </div>

          {currentQuestion.fact && <div className="q-fact">{currentQuestion.fact}</div>}
        </div>
      </div>

      <div className="quiz-kb-hint" dangerouslySetInnerHTML={{ __html: t('quiz.hint') }} />

      {showFlash && <div className="answer-flash">{showFlash}</div>}
    </section>
  );
};

export default Quiz;
