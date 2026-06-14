// Mock auth — for the prototype only. Real apps must never store plaintext
// passwords or authenticate client-side.

export interface ParentLogin {
  email: string;
  password: string;
  familyId: string;
}

export const PARENT_LOGINS: ParentLogin[] = [
  // The credential specified for the mock.
  { email: 'mika.tanaka@example.com', password: '1234', familyId: 'fam_tanaka' },
  // Additional demo accounts (same password) so every family stays reachable.
  { email: 'smithmatefctest@gmail.com', password: '1234', familyId: 'fam_smith' },
  { email: 'nguyenmatefctest@gmail.com', password: '1234', familyId: 'fam_nguyen' },
  { email: 'leematefctest@gmail.com', password: '1234', familyId: 'fam_lee' },
  { email: 'brownmatefctest@gmail.com', password: '1234', familyId: 'fam_brown' },
];

export const COACH_LOGIN = {
  email: 'admin@matefc.com',
  password: '1234',
  coachId: 'c1',
};

/** Email used by the mock SSO (Google/Facebook) buttons for the parent flow. */
export const DEFAULT_PARENT_LOGIN = PARENT_LOGINS[0];

export function matchParentLogin(email: string, password: string): ParentLogin | undefined {
  const e = email.trim().toLowerCase();
  return PARENT_LOGINS.find((l) => l.email === e && l.password === password);
}

export function matchCoachLogin(email: string, password: string): boolean {
  return email.trim().toLowerCase() === COACH_LOGIN.email && password === COACH_LOGIN.password;
}
