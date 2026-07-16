import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Card, StatTile } from '../../components/primitives';
import { IconChevron, IconClock } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { useSession } from '../../context/SessionContext';
import { coachById } from '../../data/coaches';
import { venueById } from '../../data/venues';
import { classById } from '../../data/classes';
import { enrollmentsForClass } from '../../data/enrollments';
import { groupOf } from '../../lib/membership';
import { MembershipGroup } from '../../types/domain';
import { TODAY } from '../../data';
import { formatDate } from '../../lib/format';
import s from '../screen.module.css';

export function CoachDashboardScreen() {
  const { t, lang, tl } = useI18n();
  const { coachId } = useSession();
  const data = useData();
  const nav = useNavigate();

  const coach = coachById(coachId ?? '');

  // category counts across all students
  const counts = {
    regular: data.students.filter((st) => groupOf(st.category) === MembershipGroup.Regular).length,
    academy: data.students.filter((st) => groupOf(st.category) === MembershipGroup.Academy).length,
    trial: data.students.filter((st) => groupOf(st.category) === MembershipGroup.Trial).length,
  };

  // upcoming sessions (today onward), nearest first
  const upcoming = data.sessions
    .filter((se) => se.date >= TODAY && se.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <>
      <AppHeader
        title={`${t('dash.hello')}, ${coach?.name.split(' ')[0] ?? 'Coach'}`}
        subtitle={coach && tl(coach.roleTitle)}
        curved
      />
      <div className={s.page}>
        {/* Category breakdown — Regular vs Academy vs Trial */}
        <div className={s.label}>{t('coach.byCategory')}</div>
        <div className={s.rowWrap}>
          <StatTile value={counts.regular} label={t('coach.regularCount')} color="var(--mfc-blue)" />
          <StatTile value={counts.academy} label={t('coach.academyCount')} color="var(--mfc-cat-academy)" />
          <StatTile value={counts.trial} label={t('coach.trialCount')} color="var(--mfc-cat-trial)" />
        </div>

        {/* Sessions */}
        <div className={s.label}>{t('coach.todaySessions')}</div>
        <Card flush>
          {upcoming.map((se) => {
            const cls = classById(se.classId);
            const venue = venueById(cls?.venueId);
            const enrolled = enrollmentsForClass(se.classId).length;
            const cancelled = se.status === 'cancelled_weather';
            return (
              <button
                key={se.id}
                className={s.lrow}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'var(--mfc-surface)',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--mfc-border)',
                  alignItems: 'center',
                }}
                onClick={() => nav(`/coach/attendance/${se.id}`)}
              >
                <span style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: 700, fontSize: 14.5 }}>{cls && tl(cls.title)}</span>
                  <span className={s.muted} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IconClock size={13} color="var(--mfc-muted)" />
                    {formatDate(se.date, lang)} · {cls?.startTime} · {venue?.suburb}
                  </span>
                  {cancelled && (
                    <span style={{ color: 'var(--mfc-warn)', fontWeight: 700, fontSize: 12 }}>
                      ⛈️ {t('schedule.weatherCancelled')}
                    </span>
                  )}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--mfc-muted)', whiteSpace: 'nowrap' }}>
                    {enrolled} {t('coach.enrolled')}
                  </span>
                  <IconChevron size={18} color="var(--mfc-muted)" />
                </span>
              </button>
            );
          })}
        </Card>
      </div>
    </>
  );
}
