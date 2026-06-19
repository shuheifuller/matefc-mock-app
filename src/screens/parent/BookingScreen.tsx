import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Button, Card, MembershipBadge } from '../../components/primitives';
import { IconCheck, IconClock } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { studentBookingEligibility, type BookingMode } from '../../lib/selectors';
import { classById } from '../../data/classes';
import { venueById } from '../../data/venues';
import s from '../screen.module.css';

export function BookingScreen() {
  const { classId } = useParams();
  const { t, tl } = useI18n();
  const { students, data } = useParent();
  const nav = useNavigate();

  const cls = classById(classId);

  // Only students who can participate: Unlimited, or holding a make-up credit.
  const eligible = students
    .map((st) => ({ st, e: studentBookingEligibility(st, data.makeupTokens) }))
    .filter((x) => x.e.eligible);

  const [studentId, setStudentId] = useState<string | null>(
    eligible.length === 1 ? eligible[0].st.id : null,
  );
  const [result, setResult] = useState<null | {
    name: string;
    mode: BookingMode;
    remaining: number;
  }>(null);

  const confirm = () => {
    const sel = eligible.find((x) => x.st.id === studentId);
    if (!sel) return;
    data.bookSpot(sel.st.id);
    setResult({
      name: `${sel.st.firstName} ${sel.st.lastName}`,
      mode: sel.e.mode,
      remaining: Math.max(0, sel.e.makeupCount - 1),
    });
  };

  // ---- Success view ----
  if (result) {
    const creditLine =
      result.mode === 'unlimited'
        ? t('booking.noCreditNeeded')
        : `${t('booking.makeupUsedPrefix')}${result.remaining}${t('booking.remainingSuffix')}`;
    return (
      <>
        <AppHeader title={t('booking.title')} showBack={false} />
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
          <div style={{ fontSize: 19, fontWeight: 800, marginTop: 8 }}>{t('booking.success')}</div>
          <div className={s.muted}>
            {result.name}
            {cls ? ` · ${tl(cls.title)}` : ''}
          </div>
          <div
            className={s.banner}
            style={{
              marginTop: 10,
              background: result.mode === 'unlimited' ? 'var(--mfc-sky)' : 'var(--mfc-cat-academy-bg)',
              color: result.mode === 'unlimited' ? 'var(--mfc-navy)' : '#7a5b00',
            }}
          >
            {creditLine}
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

  // ---- Selection view ----
  return (
    <>
      <AppHeader title={t('booking.title')} showBack />
      <div className={s.page}>
        {/* Lesson summary */}
        {cls && (
          <Card>
            <div className={s.label} style={{ marginBottom: 4 }}>{t('booking.lesson')}</div>
            <div style={{ fontWeight: 800, fontSize: 15.5 }}>{tl(cls.title)}</div>
            <div className={s.muted} style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
              <IconClock size={13} color="var(--mfc-muted)" />
              {cls.startTime} · {venueById(cls.venueId)?.name}
            </div>
          </Card>
        )}

        {/* Single action: select a student */}
        <div className={s.label}>{t('booking.selectStudent')}</div>
        <Card flush>
          {eligible.map(({ st, e }) => {
            const selected = st.id === studentId;
            const note =
              e.mode === 'unlimited'
                ? t('booking.unlimitedNote')
                : `${t('booking.makeupNote')} · ${e.makeupCount}${t('booking.availableSuffix')}`;
            return (
              <button
                key={st.id}
                className={s.lrow}
                style={{
                  width: '100%',
                  border: 'none',
                  background: selected ? 'var(--mfc-sky)' : 'var(--mfc-surface)',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--mfc-border)',
                  alignItems: 'center',
                }}
                onClick={() => setStudentId(st.id)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={38} />
                  <span style={{ textAlign: 'left' }}>
                    <span style={{ display: 'block', fontWeight: 700 }}>
                      {st.firstName} {st.lastName}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: e.mode === 'unlimited' ? 'var(--mfc-success)' : 'var(--mfc-warn)',
                      }}
                    >
                      {note}
                    </span>
                  </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MembershipBadge category={st.category} />
                  <Radio on={selected} />
                </span>
              </button>
            );
          })}
        </Card>

        <Button block variant="navy" disabled={!studentId} onClick={confirm}>
          {t('booking.confirm')}
        </Button>
      </div>
    </>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: `2px solid ${on ? 'var(--mfc-blue)' : 'var(--mfc-border)'}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
      }}
    >
      {on && (
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--mfc-blue)' }} />
      )}
    </span>
  );
}
