/* ═══════════════════════════════════════════════════════
   OJAS — AppContext.tsx
   Global state management
═══════════════════════════════════════════════════════ */

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';
type Theme = 'light' | 'dark';
type Screen = 'home' | 'landing' | 'explainer' | 'quiz' | 'result' | 'auth' | 'dashboard';

interface Scores {
  v: number;
  p: number;
  k: number;
}

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  userName: string;
  setUserName: (n: string) => void;
  scores: Scores;
  setScores: (s: Scores) => void;
  currentScreen: Screen;
  setCurrentScreen: (s: Screen) => void;
  isAuth: boolean;
  setIsAuth: (a: boolean) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

import { translations } from '../data/i18n';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('ojas_lang') as Language) || 'en');
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('ojas_theme') as Theme) || 'light');
  const [userName, setUserNameState] = useState(() => localStorage.getItem('ojas_user_name') || '');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [scores, setScores] = useState<Scores>({ v: 0, p: 0, k: 0 });
  const [isAuth, setIsAuth] = useState<boolean>(() => localStorage.getItem('ojas_auth') === 'true');

  useEffect(() => {
    localStorage.setItem('ojas_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('ojas_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ojas_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('ojas_auth', String(isAuth));
  }, [isAuth]);

  const setLang = (l: Language) => setLangState(l);
  const setTheme = (t: Theme) => setThemeState(t);
  const setUserName = (n: string) => setUserNameState(n);

  const t = (key: string) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider value={{
      lang, setLang,
      theme, setTheme,
      userName, setUserName,
      scores, setScores,
      currentScreen, setCurrentScreen,
      isAuth, setIsAuth,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
