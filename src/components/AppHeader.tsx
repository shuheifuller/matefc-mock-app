import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { IconBack, IconBell, IconGlobe } from './Icons';
import s from './AppHeader.module.css';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  bellTo?: string;
  unread?: number;
  showLang?: boolean;
  smallTitle?: boolean;
  curved?: boolean;
  /** Extra content rendered below the title row (filters, segmented control). */
  children?: ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  showBack,
  bellTo,
  unread = 0,
  showLang = true,
  smallTitle,
  curved,
  children,
}: AppHeaderProps) {
  const nav = useNavigate();
  const { lang, toggleLang } = useI18n();

  return (
    <header className={`${s.header} ${curved ? s.headerCurved : ''}`}>
      <div className={s.topRow}>
        {showBack && (
          <button className={`${s.iconBtn} ${s.backBtn}`} onClick={() => nav(-1)} aria-label="Back">
            <IconBack size={22} />
          </button>
        )}
        <div className={`${s.title} ${smallTitle ? s.titleSmall : ''}`}>{title}</div>
        {showLang && (
          <button className={s.langBtn} onClick={toggleLang}>
            <IconGlobe size={15} />
            {lang === 'en' ? 'EN' : '日本'}
          </button>
        )}
        {bellTo && (
          <button className={s.iconBtn} onClick={() => nav(bellTo)} aria-label="Notifications">
            <IconBell size={19} />
            {unread > 0 && <span className={s.dot}>{unread}</span>}
          </button>
        )}
      </div>
      {subtitle && <div className={s.subtitle}>{subtitle}</div>}
      {children && <div className={s.slot}>{children}</div>}
    </header>
  );
}
