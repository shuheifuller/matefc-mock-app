import type { AppNotification, NotificationType } from '../types/domain';
import { useI18n } from '../i18n/I18nContext';
import { relativeTime } from '../lib/format';
import s from './feed.module.css';

const ICONS: Record<NotificationType, { emoji: string; bg: string }> = {
  payment: { emoji: '💳', bg: '#fee2e2' },
  schedule: { emoji: '🌧️', bg: '#e0f2fe' },
  news: { emoji: '📣', bg: '#e8f0fe' },
  trial: { emoji: '⚽', bg: '#dcfce7' },
  makeup: { emoji: '🔁', bg: '#fef3c7' },
  birthday: { emoji: '🎉', bg: '#fae8ff' },
};

export function NotificationRow({ n }: { n: AppNotification }) {
  const { lang, tl } = useI18n();
  const icon = ICONS[n.type];
  return (
    <div className={`${s.notif} ${n.read ? '' : s.notifUnread}`}>
      <span className={s.notifIcon} style={{ background: icon.bg }}>
        {icon.emoji}
      </span>
      <div className={s.notifMain}>
        <div className={s.notifTitle}>{tl(n.title)}</div>
        <div className={s.notifText}>{tl(n.body)}</div>
        <div className={s.notifTime}>{relativeTime(n.createdAt, lang)}</div>
      </div>
      {!n.read && <span className={s.unreadDot} />}
    </div>
  );
}
