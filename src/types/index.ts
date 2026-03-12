export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type: 'text' | 'voice';
}

export interface InteractRequest {
  Prompt: string;
  JsonHistory?: string;
  PatientId?: string;
  PatientName?: string;
}

export interface InteractResponse {
  resposta: string;
}

export interface PatientSession {
  patientId: string;
  patientName: string;
  email: string;
}

export interface LoginRequest {
  Email: string;
}

export interface LoginResponse {
  id: string;
  nome: string;
}
