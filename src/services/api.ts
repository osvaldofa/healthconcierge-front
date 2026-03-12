import type { InteractRequest, InteractResponse, LoginRequest, LoginResponse, Message, PatientSession } from '@/types';

const API_BASE = '';

export async function login(email: string): Promise<LoginResponse> {
  const payload: LoginRequest = { Email: email };
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Login falhou: ${res.status}`);
  return res.json();
}

export async function sendTextMessage(
  prompt: string,
  history: Message[],
  session: PatientSession
): Promise<InteractResponse> {
  const payload: InteractRequest = {
    Prompt: prompt,
    JsonHistory: JSON.stringify(
      history.map((m) => ({ role: m.role, content: m.content }))
    ),
    PatientId: session.patientId,
    PatientName: session.patientName,
  };

  const res = await fetch(`${API_BASE}/api/atendimento/interagir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function sendVoiceMessage(
  wavFile: File,
  history: Message[],
  session: PatientSession
): Promise<string> {
  const formData = new FormData();
  formData.append('file', wavFile, 'audio.wav');
  formData.append('Prompt', '');
  formData.append(
    'JsonHistory',
    JSON.stringify(history.map((m) => ({ role: m.role, content: m.content })))
  );
  formData.append('PatientId', session.patientId ?? '');
  formData.append('PatientName', session.patientName ?? '');

  const res = await fetch(`${API_BASE}/api/atendimento/upload-interacao`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  // Backend pode retornar string pura ou JSON — tratar ambos
  const text = await res.text();
  try {
    const json = JSON.parse(text) as { resposta?: string };
    return json.resposta ?? text;
  } catch {
    return text;
  }
}
