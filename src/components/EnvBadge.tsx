import { ENV_LABEL } from '../lib/env';

/** Small pre-production marker (e.g. "BETA"). Renders nothing when unset. */
export function EnvBadge({ small }: { small?: boolean }) {
  if (!ENV_LABEL) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--mfc-cat-academy)',
        color: '#3a2c00',
        fontSize: small ? 9.5 : 10.5,
        fontWeight: 800,
        letterSpacing: '0.08em',
        padding: small ? '2px 6px' : '3px 8px',
        borderRadius: 999,
        lineHeight: 1,
        textTransform: 'uppercase',
      }}
    >
      {ENV_LABEL}
    </span>
  );
}
