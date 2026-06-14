import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Button, Card, MembershipBadge, ProgressBar, StatTile } from '../../components/primitives';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { metaFor } from '../../lib/membership';
import { planById } from '../../data/plans';
import { venueById } from '../../data/venues';
import { classById } from '../../data/classes';
import { classIdsForStudents, upcomingSessionsForClasses, attendanceRate } from '../../lib/selectors';
import { ageFromDob, formatAUD, formatDate } from '../../lib/format';
import { MembershipCategory } from '../../types/domain';
import s from '../screen.module.css';

export function StudentDetailScreen() {
  const { id } = useParams();
  const { t, lang, tl } = useI18n();
  const { data } = useParent();
  const nav = useNavigate();

  const st = data.students.find((x) => x.id === id);
  if (!st) return <AppHeader title="—" showBack />;

  const meta = metaFor(st.category);
  const plan = planById(st.planId);
  const isAcademy = st.category === MembershipCategory.Academy;
  const isTrial = st.category === MembershipCategory.Trial;

  const classIds = classIdsForStudents(data.enrollments, [st.id]);
  const upcoming = upcomingSessionsForClasses(data.sessions, classIds).slice(0, 3);
  const records = data.attendance.filter((a) => a.studentId === st.id);
  const rate = attendanceRate(records);
  const tokens = data.makeupTokens.filter((m) => m.studentId === st.id && !m.used);
  const skills = data.skillProgress.find((sp) => sp.studentId === st.id);

  return (
    <>
      <AppHeader title={`${st.firstName} ${st.lastName}`} showBack smallTitle />
      <div className={s.page}>
        {/* Identity */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={60} />
            <div style={{ flex: 1 }}>
              <div className={s.heroName}>{st.firstName} {st.lastName}</div>
              <div className={s.muted} style={{ marginBottom: 6 }}>
                {ageFromDob(st.dob)} {t('common.years')} · {venueById(st.homeVenueId)?.name ?? '—'}
              </div>
              <MembershipBadge category={st.category} />
            </div>
          </div>
        </Card>

        {/* Academy / Trial banner */}
        {isAcademy && (
          <div className={s.banner} style={{ background: 'var(--mfc-cat-academy-bg)', color: '#7a5b00' }}>
            ⭐ {t('students.academyBanner')}
          </div>
        )}
        {isTrial && (
          <div className={s.banner} style={{ background: 'var(--mfc-success-bg)', color: '#166534' }}>
            ⚽ {t('students.trialBanner')}
            {st.trial && (
              <div style={{ fontWeight: 500, marginTop: 4 }}>
                {formatDate(st.trial.trialDate, lang)} · {classById(st.trial.trialClassId)?.startTime}
              </div>
            )}
          </div>
        )}

        {/* Plan card */}
        <div className={s.label}>{t('students.plan')}</div>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{tl(meta.label)}</div>
            {plan?.monthlyPrice != null && (
              <div style={{ fontWeight: 800, color: 'var(--mfc-blue)' }}>
                {formatAUD(plan.monthlyPrice)}
                <span className={s.muted}>{t('common.perMonth')}</span>
              </div>
            )}
            {meta.perSessionPrice && (
              <div style={{ fontWeight: 800, color: 'var(--mfc-blue)' }}>
                {formatAUD(meta.perSessionPrice.member)}
                <span className={s.muted}>{t('common.perSession')}</span>
              </div>
            )}
          </div>
          <ul style={{ margin: '10px 0 0', paddingLeft: 18, color: 'var(--mfc-muted)', fontSize: 13, lineHeight: 1.6 }}>
            {meta.rules.map((r, i) => (
              <li key={i}>{tl(r)}</li>
            ))}
          </ul>
          {isTrial && (
            <div style={{ marginTop: 12 }}>
              <Button block variant="primary" onClick={() => nav('/parent/enroll')}>
                {t('students.convertCta')}
              </Button>
            </div>
          )}
        </Card>

        {/* Stats */}
        {!isTrial && (
          <div className={s.rowWrap}>
            <StatTile value={`${rate}%`} label={t('attendance.rate')} color="var(--mfc-success)" />
            <StatTile value={tokens.length} label={t('students.makeupTokens')} color="var(--mfc-warn)" />
          </div>
        )}

        {/* Next sessions */}
        {upcoming.length > 0 && (
          <>
            <div className={s.label}>{t('students.nextSessions')}</div>
            <Card flush>
              {upcoming.map((se) => {
                const cls = classById(se.classId);
                const cancelled = se.status === 'cancelled_weather';
                return (
                  <div
                    key={se.id}
                    className={s.lrow}
                    style={{ padding: '12px 16px', borderBottom: '1px solid var(--mfc-border)' }}
                  >
                    <span>
                      <span style={{ display: 'block', fontWeight: 600 }}>{cls && tl(cls.title)}</span>
                      <span className={s.muted}>
                        {formatDate(se.date, lang)} · {cls?.startTime}
                      </span>
                    </span>
                    {cancelled && (
                      <span style={{ color: 'var(--mfc-warn)', fontSize: 12, fontWeight: 700 }}>
                        {t('schedule.weatherCancelled')}
                      </span>
                    )}
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {/* Skill summary */}
        {skills && (
          <>
            <div className={s.label}>{t('students.skillSummary')}</div>
            <Card>
              <div className={s.stackSm}>
                {skills.skills.map((sk) => (
                  <div key={sk.key}>
                    <div className={s.kv} style={{ padding: 0, marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>{tl(sk.label)}</span>
                      <span style={{ fontSize: 13 }}>{sk.level}/5</span>
                    </div>
                    <ProgressBar value={sk.level} pillar={sk.pillar} />
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
