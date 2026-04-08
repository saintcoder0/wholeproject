/* ═══════════════════════════════════════════════════════
   OJAS — api.ts
   Centralized API client. Reads JWT from localStorage and
   attaches it as Bearer token on every authenticated request.
═══════════════════════════════════════════════════════ */

const BASE_URL = 'http://localhost:8000';

function getToken(): string | null {
  return localStorage.getItem('ojas_token');
}

interface RequestOptions extends RequestInit {
  auth?: boolean; // whether to attach Bearer token
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers = {}, ...rest } = options;

  const mergedHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      (mergedHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: mergedHeaders,
    credentials: 'include', // send session cookies too
    ...rest,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).detail || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth endpoints ────────────────────────────────────

export interface UserPublic {
  uid: string;
  name: string;
  email?: string;
  photo_url?: string;
  provider: string;
  scores: { v: number; p: number; k: number };
  dominant_dosha?: string;
  quiz_completed: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserPublic;
}

export const api = {
  auth: {
    register: (name: string, email: string, password: string) =>
      request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ name, email, password }),
      }),

    login: (email: string, password: string) =>
      request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email, password }),
      }),

    firebase: (id_token: string) =>
      request<AuthResponse>('/api/auth/firebase', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ id_token }),
      }),

    logout: () =>
      request<{ message: string }>('/api/auth/logout', {
        method: 'POST',
      }),

    me: () => request<UserPublic>('/api/auth/me'),
  },

  user: {
    saveResults: (scores: { v: number; p: number; k: number }) =>
      request<UserPublic>('/api/user/results', {
        method: 'POST',
        body: JSON.stringify({ scores }),
      }),

    getResults: () =>
      request<{ scores: { v: number; p: number; k: number }; dominant_dosha?: string; quiz_completed: boolean }>(
        '/api/user/results'
      ),
  },
};
