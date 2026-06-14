import { AppHeader } from '../../components/AppHeader';
import { Avatar, Badge, Card, StatTile } from '../../components/primitives';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { attendanceRate } from '../../lib/selectors';
import { sessionById } from '../../data/sessions';
import { classById } from '../../data/classes';
import { formatDate } from '../../lib/format';
import type { AttendanceStatus } from '../../types/domain';
import s from '../screen.module.css';

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  present: 'var(--mfc-success)',
  absent: 'var(--mfc-error)',
  excused: 'var(--mfc-muted)',
  makeup: 'var(--mfc-blue)',
  weather_cancelled: 'var(--mfc-warn)',
};

export function AttendanceScreen() {
  const { t, lang, tl } = useI18n();
  const { students, data } = useParent();

  const statusLabel: Record<AttendanceStatus, string> = {
    present: t('attendance.present'),
    absent: t('attendance.absent'),
    excused: t('attendance.excused'),
    makeup: t('attendance.makeup'),
    weather_cancelled: t('attendance.weather'),
  };

  return (
    <>
      <AppHeader title={t('attendance.title')} showBack bellTo="/parent/notifications" />
      <div className={s.page}>
        {students
          .filter((st) => data.attendance.some((a) => a.studentId === st.id))
          .map((st) => {
            const records = data.attendance
              .filter((a) => a.studentId === st.id)
              .sort((a, b) => (sessionById(b.sessionId)?.date ?? '').localeCompare(sessionById(a.sessionId)?.date ?? ''));
            const rate = attendanceRate(records);
            const tokens = data.makeupTokens.filter((m) => m.studentId === st.id);
            const personalLeft = tokens.filter((m) => m.reason === 'personal' && !m.used).length;
            const weatherTokens = tokens.filter((m) => m.reason === 'weather' && !m.used).length;

            return (
              <div key={st.id}>
                <div className={s.groupTitle}>
                  <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={24} />
                  {st.firstName} {st.lastName}
                </div>
                <div className={s.rowWrap} style={{ marginBottom: 8 }}>
                  <StatTile value={`${rate}%`} label={t('attendance.rate')} color="var(--mfc-success)" />
                  <StatTile value={personalLeft} label={t('attendance.personalTokens')} color="var(--mfc-warn)" />
                  <StatTile value={weatherTokens} label={t('attendance.weatherTokens')} color="var(--mfc-blue)" />
                </div>
                <Card flush>
                  {records.map((r) => {
                    const se = sessionById(r.sessionId);
                    const cls = classById(se?.classId);
                    return (
                      <div
                        key={r.id}
                        className={s.lrow}
                        style={{ padding: '11px 16px', borderBottom: '1px solid var(--mfc-border)', alignItems: 'center' }}
                      >
                        <span>
                          <span style={{ display: 'block', fontWeight: 600, fontSize: 14 }}>{cls && tl(cls.title)}</span>
                          <span className={s.muted}>{se && formatDate(se.date, lang)}</span>
                        </span>
                        <Badge color={STATUS_COLOR[r.status]} outline>
                          {statusLabel[r.status]}
                        </Badge>
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
      </div>
    </>
  );
}
