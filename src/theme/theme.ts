// TS mirror of the most-used theme tokens, for inline styles / dynamic values.
export const colors = {
  navy: 'var(--mfc-navy)',
  blue: 'var(--mfc-blue)',
  blue600: 'var(--mfc-blue-600)',
  blue400: 'var(--mfc-blue-400)',
  sky: 'var(--mfc-sky)',
  bg: 'var(--mfc-bg)',
  surface: 'var(--mfc-surface)',
  border: 'var(--mfc-border)',
  text: 'var(--mfc-text)',
  muted: 'var(--mfc-muted)',
  success: 'var(--mfc-success)',
  warn: 'var(--mfc-warn)',
  error: 'var(--mfc-error)',
} as const;

export const pillarColor = {
  mind: 'var(--mfc-pillar-mind)',
  skill: 'var(--mfc-pillar-skill)',
  body: 'var(--mfc-pillar-body)',
} as const;
