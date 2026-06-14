import { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Badge, Button, Card } from '../../components/primitives';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { plans } from '../../data/plans';
import { classById } from '../../data/classes';
import { ageFromDob, formatDate } from '../../lib/format';
import { MembershipCategory, type TrialStatus } from '../../types/domain';
import s from '../screen.module.css';

export function TrialsScreen() {
  const { t, lang, tl } = useI18n();
  const data = useData();
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const statusLabel: Record<TrialStatus, string> = {
    scheduled: t('coach.trialScheduled'),
    attended: t('coach.trialAttendedS'),
    converted: t('coach.trialConverted'),
    declined: t('coach.trialDeclined'),
  };
  const statusColor: Record<TrialStatus, string> = {
    scheduled: 'var(--mfc-blue)',
    attended: 'var(--mfc-warn)',
    converted: 'var(--mfc-success)',
    declined: 'var(--mfc-muted)',
  };

  // Trial students plus those recently converted (still carry trial info)
  const trials = data.students.filter((st) => st.trial);

  return (
    <>
      <AppHeader title={t('coach.trialsTitle')} showLang={false} />
      <div className={s.page}>
        {trials.map((st) => {
          const trial = st.trial!;
          const converting = convertingId === st.id;
          const cls = classById(trial.trialClassId);
          return (
            <Card key={st.id} style={{ borderLeft: '4px solid var(--mfc-cat-trial)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{st.firstName} {st.lastName}</div>
                  <div className={s.muted}>{ageFromDob(st.dob)} {t('common.years')}</div>
                </div>
                <Badge color={statusColor[trial.status]} outline>
                  {statusLabel[trial.status]}
                </Badge>
              </div>

              <div className={s.kv} style={{ marginTop: 10 }}>
                <span>{t('schedule.title')}</span>
                <span>{formatDate(trial.trialDate, lang)} · {cls?.startTime}</span>
              </div>
              {trial.convertedToPlanId && (
                <div className={s.kv}>
                  <span>{t('students.plan')}</span>
                  <span>{tl(plans.find((p) => p.id === trial.convertedToPlanId)?.name)}</span>
                </div>
              )}

              {/* Actions */}
              {st.category === MembershipCategory.Trial && trial.status !== 'declined' && (
                <>
                  {!converting ? (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <Button sm variant="navy" onClick={() => setConvertingId(st.id)}>
                        {t('coach.convert')}
                      </Button>
                      <Button sm variant="ghost" onClick={() => { /* mock decline */ }}>
                        {t('coach.decline')}
                      </Button>
                    </div>
                  ) : (
                    <div style={{ marginTop: 12 }}>
                      <div className={s.label}>{t('enroll.pickPlan')}</div>
                      <div className={s.stackSm} style={{ marginTop: 6 }}>
                        {plans.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              data.convertTrial(st.id, p.id);
                              setConvertingId(null);
                            }}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%',
                              border: '1.5px solid var(--mfc-border)',
                              background: 'var(--mfc-surface)',
                              borderRadius: 'var(--r-sm)',
                              padding: '10px 12px',
                              fontWeight: 600,
                            }}
                          >
                            <span>{tl(p.name)}</span>
                            <span style={{ color: 'var(--mfc-blue)', fontWeight: 800 }}>
                              {p.monthlyPrice != null ? `$${p.monthlyPrice}` : '$/session'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
