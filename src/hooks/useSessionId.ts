import { useState, useEffect } from 'react';

function generateSessionId(): string {
  return `nr_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

export function useSessionId() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const existing = localStorage.getItem('nr_session_id');
    if (existing) {
      setSessionId(existing);
    } else {
      const newId = generateSessionId();
      localStorage.setItem('nr_session_id', newId);
      setSessionId(newId);
    }
  }, []);

  return sessionId;
}
