/* ═══════════════════════════════════════════════════════
   OJAS — App.tsx
   Main router and screen controller
═══════════════════════════════════════════════════════ */

import React from 'react';
import { useAppContext } from './context/AppContext';
import HomePage from './components/HomePage';
import Landing from './components/Landing';
import Explainer from './components/Explainer';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const { currentScreen } = useAppContext();

  return (
    <main>
      {currentScreen === 'home' && <HomePage />}
      {currentScreen === 'landing' && <Landing />}
      {currentScreen === 'explainer' && <Explainer />}
      {currentScreen === 'quiz' && <Quiz />}
      {currentScreen === 'result' && <Result />}
      {currentScreen === 'auth' && <Auth />}
      {currentScreen === 'dashboard' && <Dashboard />}
    </main>
  );
};

export default App;
