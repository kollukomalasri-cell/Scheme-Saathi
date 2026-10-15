import type { Match, Profile, Scheme } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export const getSchemes = (params = '') => request<Scheme[]>(`/api/schemes${params}`);
export const getScheme = (slug: string) => request<Scheme>(`/api/schemes/${encodeURIComponent(slug)}`);
export const getMatches = (profile: Profile) => request<Match[]>('/api/eligibility/match', { method: 'POST', body: JSON.stringify(profile) });
export const askChat = (message: string, language: 'en' | 'te') => request<{ reply: string; suggestions: string[] }>('/api/chat', { method: 'POST', body: JSON.stringify({ message, language }) });
