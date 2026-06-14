import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '../types/domain';

interface Session {
  role: Role | null;
  familyId: string | null; // active family when role === 'parent'
  coachId: string | null; // active coach when role === 'coach'
}

interface SessionValue extends Session {
  signInParent: (familyId: string) => void;
  signInCoach: (coachId: string) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ role: null, familyId: null, coachId: null });

  const value = useMemo<SessionValue>(
    () => ({
      ...session,
      signInParent: (familyId) => setSession({ role: 'parent', familyId, coachId: null }),
      signInCoach: (coachId) => setSession({ role: 'coach', familyId: null, coachId }),
      signOut: () => setSession({ role: null, familyId: null, coachId: null }),
    }),
    [session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
