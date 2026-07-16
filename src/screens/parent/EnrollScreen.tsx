import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Button, Card, MembershipBadge } from '../../components/primitives';
import { IconCheck } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { metaFor } from '../../lib/membership';
import { planById, plans } from '../../data/plans';
import { ageFromDob, formatAUD } from '../../lib/format';
import { MembershipCategory } from '../../types/domain';
import s from '../screen.module.css';

export function EnrollScreen() {
  const { t, tl } = useI18n();
  const { students, data } = useParent();
  const nav = useNavigate();

  // A trial student, if present, is the natural conversion target.
  const trialStudent = students.find((st) => st.category === MembershipCategory.Trial);
  const [step, setStep] = useState(trialStudent ? 1 : 0);
  const [studentId, setStudentId] = useState<string | null>(trialStudent?.id ?? null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  // Captured at confirm time — after convertTrial() the student is no longer a
  // Trial, so recomputing isConvert on the success view would read false.
  const [wasConvert, setWasConvert] = useState(false);

  const student = students.find((st) => st.id === studentId);
  const isConvert = student?.category === MembershipCategory.Trial;
  const plan = planById(planId ?? '');

  const enrollablePlans = plans; // all catalog plans

  const confirm = () => {
    if (!studentId || !planId) return;
    setWasConvert(isConvert);
    if (isConvert) data.convertTrial(studentId, planId);
    else data.enrollExisting(studentId, planId);
    setDone(true);
  };

  if (done) {
    return (
      <>
        <AppHeader title={wasConvert ? t('enroll.convertTitle') : t('enroll.title')} showBack={false} />
        <div className={s.page} style={{ alignItems: 'center', textAlign: 'center', paddingTop: 40 }}>
          <span
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: 'var(--mfc-success-bg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconCheck size={40} color="var(--mfc-success)" />
          </span>
          <div style={{ fontSize: 19, fontWeight: 800, marginTop: 8 }}>
            {wasConvert ? t('enroll.successConvert') : t('enroll.success')}
          </div>
          <div className={s.muted}>
            {student?.firstName} · {plan && tl(plan.name)}
          </div>
          <div style={{ width: '100%', marginTop: 12 }}>
            <Button block onClick={() => nav(`/parent/students/${studentId}`)}>
              {t('common.done')}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={isConvert ? t('enroll.convertTitle') : t('enroll.title')} showBack />
      <div className={s.page}>
        <Stepper step={step} />

        {/* Step 0 — pick student */}
        {step === 0 && (
          <>
            <div className={s.label}>{t('enroll.pickStudent')}</div>
            <Card flush>
              {students.map((st) => (
                <button
                  key={st.id}
                  className={s.lrow}
                  style={selectRow(st.id === studentId)}
                  onClick={() => {
                    setStudentId(st.id);
                    setStep(1);
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={36} />
                    <span style={{ textAlign: 'left' }}>
                      <span style={{ display: 'block', fontWeight: 700 }}>
                        {st.firstName} {st.lastName}
                      </span>
                      <span className={s.muted}>{ageFromDob(st.dob)} {t('common.years')}</span>
                    </span>
                  </span>
                  <MembershipBadge category={st.category} />
                </button>
              ))}
            </Card>
          </>
        )}

        {/* Step 1 — pick plan */}
        {step === 1 && (
          <>
            <div className={s.label}>{t('enroll.pickPlan')}</div>
            <div className={s.stack}>
              {enrollablePlans.map((p) => {
                const meta = metaFor(p.category);
                const selected = p.id === planId;
                return (
                  <Card
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    style={{
                      border: selected ? '2px solid var(--mfc-blue)' : '2px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800 }}>{tl(p.name)}</div>
                      <div style={{ fontWeight: 800, color: 'var(--mfc-blue)' }}>
                        {p.monthlyPrice != null
                          ? `${formatAUD(p.monthlyPrice)}${t('common.perMonth')}`
                          : meta.perSessionPrice
                            ? `${formatAUD(meta.perSessionPrice.member)}${t('common.perSession')}`
                            : ''}
                      </div>
                    </div>
                    <div className={s.muted} style={{ marginTop: 4 }}>{tl(p.description)}</div>
                  </Card>
                );
              })}
            </div>
            <Button block disabled={!planId} onClick={() => setStep(2)}>
              {t('common.next')}
            </Button>
          </>
        )}

        {/* Step 2 — review */}
        {step === 2 && plan && (
          <>
            <div className={s.label}>{t('enroll.review')}</div>
            <Card>
              <div className={s.kv}><span>{t('enroll.pickStudent')}</span><span>{student?.firstName} {student?.lastName}</span></div>
              <div className={s.kv}><span>{t('students.plan')}</span><span>{tl(plan.name)}</span></div>
              <div style={{ height: 1, background: 'var(--mfc-border)', margin: '8px 0' }} />
              {plan.enrollmentFee > 0 && (
                <div className={s.kv}><span>{t('enroll.enrollmentFee')}</span><span>{formatAUD(plan.enrollmentFee)}</span></div>
              )}
              {plan.monthlyPrice != null && (
                <div className={s.kv}><span>{t('enroll.monthlyFee')}</span><span>{formatAUD(plan.monthlyPrice)}{t('common.perMonth')}</span></div>
              )}
              <div style={{ height: 1, background: 'var(--mfc-border)', margin: '8px 0' }} />
              <div className={s.kv} style={{ fontSize: 16 }}>
                <span style={{ fontWeight: 700 }}>{t('enroll.firstPayment')}</span>
                <span style={{ fontWeight: 800, color: 'var(--mfc-blue)' }}>
                  {formatAUD((plan.enrollmentFee ?? 0) + (plan.monthlyPrice ?? 0))}
                </span>
              </div>
              {plan.directDebitDayOfMonth && (
                <div className={s.muted} style={{ marginTop: 6 }}>💳 {t('enroll.directDebit')}</div>
              )}
            </Card>
            <Button block variant="navy" onClick={confirm}>
              {isConvert ? t('students.convertCta') : t('enroll.confirmEnroll')}
            </Button>
          </>
        )}
      </div>
    </>
  );
}

const selectRow = (selected: boolean) => ({
  width: '100%',
  border: 'none',
  background: selected ? 'var(--mfc-sky)' : 'var(--mfc-surface)',
  padding: '12px 16px',
  borderBottom: '1px solid var(--mfc-border)',
  alignItems: 'center' as const,
});

function Stepper({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 5,
            borderRadius: 999,
            background: i <= step ? 'var(--mfc-blue)' : 'var(--mfc-border)',
          }}
        />
      ))}
    </div>
  );
}
