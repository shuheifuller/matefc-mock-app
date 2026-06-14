import { AppHeader } from '../../components/AppHeader';
import { Card, EmptyState } from '../../components/primitives';
import { IconClock } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { classIdsForStudents, weekSessions } from '../../lib/selectors';
import { classById } from '../../data/classes';
import { venueById } from '../../data/venues';
import { formatDate } from '../../lib/format';
import type { Session } from '../../types/domain';
import s from '../screen.module.css';

export function ScheduleScreen() {
  const { t, lang, tl } = useI18n();
  const { students, data } = useParent();

  const classIds = classIdsForStudents(data.enrollments, students.map((st) => st.id));
  const sessions = weekSessions(data.sessions).filter((se) => classIds.includes(se.classId));

  // group by date
  const byDate = new Map<string, Session[]>();
  for (const se of sessions) {
    byDate.set(se.date, [...(byDate.get(se.date) ?? []), se]);
  }

  return (
    <>
      <AppHeader title={t('schedule.title')} subtitle={t('schedule.thisWeek')} bellTo="/parent/notifications" />
      <div className={s.page}>
        <div className={s.banner} style={{ background: 'var(--mfc-sky)', color: 'var(--mfc-navy)', fontWeight: 500 }}>
          ℹ️ {t('schedule.cancelNote')}
        </div>

        {byDate.size === 0 && <EmptyState text={t('schedule.noSessions')} />}

        {Array.from(byDate.entries()).map(([date, list]) => (
          <div key={date}>
            <div className={s.groupTitle}>{formatDate(date, lang)}</div>
            <Card flush>
              {list.map((se) => {
                const cls = classById(se.classId);
                const venue = venueById(cls?.venueId);
                const cancelled = se.status === 'cancelled_weather';
                return (
                  <div
                    key={se.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--mfc-border)',
                      opacity: cancelled ? 0.7 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        borderRadius: 2,
                        background: cancelled ? 'var(--mfc-warn)' : 'var(--mfc-blue)',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{cls && tl(cls.title)}</div>
                      <div className={s.muted} style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                        <IconClock size={13} color="var(--mfc-muted)" />
                        {cls?.startTime} · {venue?.name}
                      </div>
                      {cancelled && (
                        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: 'var(--mfc-warn)' }}>
                          ⛈️ {t('schedule.weatherCancelled')} · {t('schedule.makeupAvailable')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
