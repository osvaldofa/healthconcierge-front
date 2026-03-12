'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '@/lib/session';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    saveSession({ patientId: email, patientName: email, email });
    router.push('/chat');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">
          Health Concierge
        </h1>
        <p className="text-gray-500 text-center mb-8 text-lg">
          Seu assistente de saúde
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="email" className="text-lg font-medium text-gray-700">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="seu@email.com"
            className="border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={!email}
            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl py-4 text-xl mt-2 transition-colors"
          >
            Acessar
          </button>
        </form>
      </div>
    </main>
  );
}
