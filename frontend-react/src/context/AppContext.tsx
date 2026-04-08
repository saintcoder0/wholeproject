/* ═══════════════════════════════════════════════════════
   OJAS — AppContext.tsx
   Global state management — includes JWT token storage
   and session restoration on page reload via /api/auth/me
═══════════════════════════════════════════════════════ */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, type UserPublic } from '../lib/api';

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
  token: string | null;
  setToken: (t: string | null) => void;
  backendUser: UserPublic | null;
  setBackendUser: (u: UserPublic | null) => void;
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
  const [isAuth, setIsAuthState] = useState<boolean>(false);
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('ojas_token'));
  const [backendUser, setBackendUser] = useState<UserPublic | null>(null);

  // ── Persist theme ─────────────────────────────────────
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

  // ── Restore session from JWT on page reload ──────────
  useEffect(() => {
    const storedToken = localStorage.getItem('ojas_token');
    if (!storedToken) return;

    api.auth.me()
      .then((user) => {
        setBackendUser(user);
        setUserNameState(user.name);
        setIsAuthState(true);
        // Also restore saved scores if quiz was completed
        if (user.quiz_completed) {
          setScores(user.scores);
        }
      })
      .catch(() => {
        // Token is invalid/expired — clear everything
        localStorage.removeItem('ojas_token');
        setTokenState(null);
        setIsAuthState(false);
      });
  }, []);

  // ── Setters ───────────────────────────────────────────
  const setLang = (l: Language) => setLangState(l);
  const setTheme = (t: Theme) => setThemeState(t);
  const setUserName = (n: string) => setUserNameState(n);

  const setIsAuth = (a: boolean) => {
    setIsAuthState(a);
    if (!a) {
      // On logout, clear token and user
      localStorage.removeItem('ojas_token');
      setTokenState(null);
      setBackendUser(null);
    }
  };

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) {
      localStorage.setItem('ojas_token', t);
    } else {
      localStorage.removeItem('ojas_token');
    }
  };

  const t = (key: string) => {
    return (translations[lang] as any)?.[key] || (translations['en'] as any)?.[key] || key;
  };

  return (
    <AppContext.Provider value={{
      lang, setLang,
      theme, setTheme,
      userName, setUserName,
      scores, setScores,
      currentScreen, setCurrentScreen,
      isAuth, setIsAuth,
      token, setToken,
      backendUser, setBackendUser,
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
