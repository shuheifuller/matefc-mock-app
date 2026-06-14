import type { CSSProperties, ReactNode } from 'react';
import { metaFor } from '../lib/membership';
import type { MembershipCategory, Pillar } from '../types/domain';
import { useI18n } from '../i18n/I18nContext';
import { pillarColor } from '../theme/theme';
import s from './primitives.module.css';

export function Card({
  children,
  flush,
  style,
  className,
  onClick,
}: {
  children: ReactNode;
  flush?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`${s.card} ${flush ? s.cardFlush : ''} ${className ?? ''}`}
      style={{ ...style, cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className={s.sectionTitle}>
      <h2>{title}</h2>
      {action}
    </div>
  );
}

export function Badge({
  children,
  color = 'var(--mfc-blue)',
  bg,
  outline,
}: {
  children: ReactNode;
  color?: string;
  bg?: string;
  outline?: boolean;
}) {
  const style: CSSProperties = outline
    ? { color, background: 'transparent', border: `1.5px solid ${color}` }
    : { color: bg ? color : '#fff', background: bg ?? color };
  return (
    <span className={s.badge} style={style}>
      {children}
    </span>
  );
}

export function MembershipBadge({ category }: { category: MembershipCategory }) {
  const { tl } = useI18n();
  const meta = metaFor(category);
  const outline = !meta.badgeBg && meta.group === 'TRIAL';
  return (
    <Badge color={meta.badgeColor} bg={meta.badgeBg} outline={outline}>
      {tl(meta.short)}
    </Badge>
  );
}

type BtnVariant = 'primary' | 'navy' | 'secondary' | 'ghost';
export function Button({
  children,
  variant = 'primary',
  block,
  sm,
  disabled,
  onClick,
  type = 'button',
}: {
  children: ReactNode;
  variant?: BtnVariant;
  block?: boolean;
  sm?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const map: Record<BtnVariant, string> = {
    primary: s.btnPrimary,
    navy: s.btnNavy,
    secondary: s.btnSecondary,
    ghost: s.btnGhost,
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${s.btn} ${map[variant]} ${block ? s.btnBlock : ''} ${sm ? s.btnSm : ''}`}
    >
      {children}
    </button>
  );
}

export function Avatar({
  label,
  color = 'var(--mfc-navy)',
  size = 40,
}: {
  label: string;
  color?: string;
  size?: number;
}) {
  const initials = label
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className={s.avatar}
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  full,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  full?: boolean;
}) {
  return (
    <div className={`${s.segment} ${full ? s.segmentFull : ''}`}>
      {options.map((o) => (
        <button
          key={o.value}
          className={`${s.segmentItem} ${value === o.value ? s.segmentItemActive : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function StatTile({
  value,
  label,
  color = 'var(--mfc-navy)',
}: {
  value: ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <div className={s.stat}>
      <div className={s.statValue} style={{ color }}>
        {value}
      </div>
      <div className={s.statLabel}>{label}</div>
    </div>
  );
}

const pillarVar: Record<Pillar, string> = pillarColor;
export function ProgressBar({
  value,
  max = 5,
  pillar,
  color,
}: {
  value: number;
  max?: number;
  pillar?: Pillar;
  color?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = color ?? (pillar ? pillarVar[pillar] : 'var(--mfc-blue)');
  return (
    <div className={s.progress}>
      <div className={s.progressFill} style={{ width: `${pct}%`, background: fill }} />
    </div>
  );
}

export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
}) {
  const Comp: 'button' | 'div' = onClick ? 'button' : 'div';
  return (
    <Comp className={s.row} onClick={onClick}>
      {leading}
      <div className={s.rowMain}>
        <div className={s.rowTitle}>{title}</div>
        {subtitle && <div className={s.rowSub}>{subtitle}</div>}
      </div>
      {trailing}
    </Comp>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className={s.empty}>{text}</div>;
}
