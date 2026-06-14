import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Button, Card } from '../../components/primitives';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { classById } from '../../data/classes';
import { venueById } from '../../data/venues';
import { enrollmentsForClass } from '../../data/enrollments';
import { formatDate } from '../../lib/format';
import { type AttendanceStatus } from '../../types/domain';
import s from '../screen.module.css';

const OPTIONS: { value: AttendanceStatus; key: string; color: string }[] = [
  { value: 'present', key: 'attendance.present', color: 'var(--mfc-success)' },
  { value: 'absent', key: 'attendance.absent', color: 'var(--mfc-error)' },
  { value: 'excused', key: 'attendance.excused', color: 'var(--mfc-muted)' },
  { value: 'makeup', key: 'attendance.makeup', color: 'var(--mfc-blue)' },
];

export function SessionAttendanceScreen() {
  const { sessionId } = useParams();
  const { t, lang, tl } = useI18n();
  const data = useData();
  const nav = useNavigate();

  const session = data.sessions.find((se) => se.id === sessionId);
  if (!session) return <AppHeader title="—" showBack />;
  const cls = classById(session.classId);
  const venue = venueById(cls?.venueId);
  const cancelled = session.status === 'cancelled_weather';

  const roster = enrollmentsForClass(session.classId)
    .map((e) => data.students.find((st) => st.id === e.studentId))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const statusOf = (studentId: string): AttendanceStatus | undefined =>
    data.attendance.find((a) => a.sessionId === session.id && a.studentId === studentId)?.status;

  return (
    <>
      <AppHeader title={cls ? tl(cls.title) : t('coach.attendanceFor')} showBack smallTitle showLang={false} />
      <div className={s.page}>
        <Card>
          <div className={s.kv}><span>{t('schedule.title')}</span><span>{formatDate(session.date, lang)} · {cls?.startTime}</span></div>
          <div className={s.kv}><span>{t('profile.venues')}</span><span>{venue?.name}</span></div>
        </Card>

        {cancelled && (
          <div className={s.banner} style={{ background: 'var(--mfc-warn-bg)', color: '#92400e' }}>
            ⛈️ {t('schedule.weatherCancelled')}
          </div>
        )}

        {roster.map((st) => {
          const current = statusOf(st.id);
          return (
            <Card key={st.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={34} />
                <div style={{ fontWeight: 700 }}>{st.firstName} {st.lastName}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {OPTIONS.map((o) => {
                  const active = current === o.value;
                  return (
                    <button
                      key={o.value}
                      onClick={() => data.markAttendance(session.id, st.id, o.value)}
                      style={{
                        flex: 1,
                        border: `1.5px solid ${active ? o.color : 'var(--mfc-border)'}`,
                        background: active ? o.color : 'var(--mfc-surface)',
                        color: active ? '#fff' : 'var(--mfc-muted)',
                        borderRadius: 'var(--r-sm)',
                        padding: '8px 4px',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {t(o.key)}
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}

        {!cancelled && (
          <Button
            block
            variant="ghost"
            onClick={() => {
              data.weatherCancelSession(session.id);
              nav(-1);
            }}
          >
            ⛈️ {t('coach.weatherCancelAll')}
          </Button>
        )}
      </div>
    </>
  );
}
