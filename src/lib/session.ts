import type { PatientSession } from '@/types';

const SESSION_KEY = 'health_concierge_session';

export function saveSession(session: PatientSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): PatientSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PatientSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
