import type { ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import s from './BottomTabBar.module.css';

export interface TabItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  badge?: number;
}

export function BottomTabBar({ items }: { items: TabItem[] }) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className={s.bar}>
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + '/');
        const Icon = item.icon;
        return (
          <button
            key={item.to}
            className={`${s.tab} ${active ? s.tabActive : ''}`}
            onClick={() => nav(item.to)}
          >
            <span className={s.iconWrap}>
              <Icon size={23} color={active ? 'var(--mfc-blue)' : 'var(--mfc-muted)'} />
              {item.badge ? <span className={s.badge}>{item.badge}</span> : null}
            </span>
            <span className={s.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
