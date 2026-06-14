import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Badge, Button, Card, MembershipBadge, ProgressBar, StatTile } from '../../components/primitives';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { metaFor } from '../../lib/membership';
import { planById } from '../../data/plans';
import { venueById } from '../../data/venues';
import { familyById } from '../../data/families';
import { attendanceRate } from '../../lib/selectors';
import { ageFromDob, formatAUD, formatDate } from '../../lib/format';
import { MembershipCategory } from '../../types/domain';
import s from '../screen.module.css';

export function MemberDetailScreen() {
  const { id } = useParams();
  const { t, lang, tl } = useI18n();
  const data = useData();
  const nav = useNavigate();

  const st = data.students.find((x) => x.id === id);
  if (!st) return <AppHeader title="—" showBack />;

  const meta = metaFor(st.category);
  const plan = planById(st.planId);
  const family = familyById(st.familyId);
  const records = data.attendance.filter((a) => a.studentId === st.id);
  const rate = attendanceRate(records);
  const skills = data.skillProgress.find((sp) => sp.studentId === st.id);
  const isTrial = st.category === MembershipCategory.Trial;

  return (
    <>
      <AppHeader title={`${st.firstName} ${st.lastName}`} showBack smallTitle showLang={false} />
      <div className={s.page}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={56} />
            <div style={{ flex: 1 }}>
              <div className={s.heroName}>{st.firstName} {st.lastName}</div>
              <div className={s.muted} style={{ marginBottom: 6 }}>
                {ageFromDob(st.dob)} {t('common.years')} · {venueById(st.homeVenueId)?.suburb ?? '—'}
              </div>
              <MembershipBadge category={st.category} />
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--mfc-border)', margin: '12px 0' }} />
          <div className={s.kv}><span>{t('students.plan')}</span><span>{tl(meta.label)}</span></div>
          {plan?.monthlyPrice != null && (
            <div className={s.kv}><span>{t('enroll.monthlyFee')}</span><span>{formatAUD(plan.monthlyPrice)}{t('common.perMonth')}</span></div>
          )}
          {st.enrolledSince && (
            <div className={s.kv}><span>{t('students.memberSince')}</span><span>{formatDate(st.enrolledSince, lang)}</span></div>
          )}
          <div className={s.kv}><span>{t('profile.contact')}</span><span>{family?.primaryContact.name}</span></div>
          <div className={s.kv}><span>&nbsp;</span><span>{family?.primaryContact.phone}</span></div>
        </Card>

        {isTrial && st.trial && (
          <Card style={{ borderLeft: '4px solid var(--mfc-cat-trial)' }}>
            <div className={s.label}>{t('nav.trials')}</div>
            <div className={s.kv}><span>{t('schedule.title')}</span><span>{formatDate(st.trial.trialDate, lang)}</span></div>
            <div className={s.kv}>
              <span>Status</span>
              <Badge color="var(--mfc-cat-trial)" outline>{st.trial.status}</Badge>
            </div>
            {st.trial.status === 'scheduled' && (
              <div style={{ marginTop: 10 }}>
                <Button block sm onClick={() => nav('/coach/trials')}>{t('coach.convert')}</Button>
              </div>
            )}
          </Card>
        )}

        {!isTrial && (
          <div className={s.rowWrap}>
            <StatTile value={`${rate}%`} label={t('attendance.rate')} color="var(--mfc-success)" />
            <StatTile value={records.length} label={t('attendance.title')} color="var(--mfc-blue)" />
          </div>
        )}

        {skills && (
          <>
            <div className={s.label}>{t('students.skillSummary')}</div>
            <Card>
              <div className={s.stackSm}>
                {skills.skills.map((sk) => (
                  <div key={sk.key}>
                    <div className={s.kv} style={{ padding: 0, marginBottom: 3 }}>
                      <span style={{ fontSize: 13 }}>{tl(sk.label)}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{sk.level}/5</span>
                    </div>
                    <ProgressBar value={sk.level} pillar={sk.pillar} />
                  </div>
                ))}
              </div>
              <Button block variant="secondary" sm onClick={() => nav('/coach/skills')}>
                {t('coach.skillEntry')}
              </Button>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
