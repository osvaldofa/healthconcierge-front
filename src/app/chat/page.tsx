'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import type { PatientSession } from '@/types';
import { ChatInterface } from '@/components/ChatInterface';

export default function ChatPage() {
  const router = useRouter();
  const [session, setSession] = useState<PatientSession | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace('/login');
      return;
    }
    setSession(s);
  }, [router]);

  if (!session) return null;

  return <ChatInterface session={session} />;
}
