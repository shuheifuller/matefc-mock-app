import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/primitives';
import { NotificationRow } from '../../components/NotificationRow';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import s from '../screen.module.css';

export function NotificationsScreen() {
  const { t } = useI18n();
  const { family, notifications, unread, data } = useParent();

  const sorted = [...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <AppHeader
        title={t('notif.title')}
        showBack
        showLang={false}
      />
      {unread > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 16px 0' }}>
          <button
            onClick={() => data.markAllNotificationsRead('parent', family.id)}
            style={{ background: 'none', border: 'none', color: 'var(--mfc-blue)', fontWeight: 700, fontSize: 13 }}
          >
            {t('notif.markRead')}
          </button>
        </div>
      )}
      <div className={`${s.page} ${s.pageFlush}`} style={{ gap: 0, paddingTop: 12 }}>
        {sorted.length === 0 ? (
          <EmptyState text={t('notif.empty')} />
        ) : (
          sorted.map((n) => <NotificationRow key={n.id} n={n} />)
        )}
      </div>
    </>
  );
}
