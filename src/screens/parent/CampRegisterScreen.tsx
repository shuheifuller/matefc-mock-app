import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Button, Card, EmptyState } from '../../components/primitives';
import { IconCheck } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { classById } from '../../data/classes';
import { venueById } from '../../data/venues';
import { ageFromDob, formatAUD, formatShortDate } from '../../lib/format';
import s from '../screen.module.css';

type DayChoice = 'one' | 'two' | 'three';

export function CampRegisterScreen() {
  const { classId } = useParams();
  const { t, lang, tl } = useI18n();
  const { students } = useParent();
  const nav = useNavigate();

  const camp = classById(classId);

  const [studentId, setStudentId] = useState<string | null>(
    students.length === 1 ? students[0].id : null,
  );
  const [days, setDays] = useState<DayChoice | null>(null);
  const [result, setResult] = useState<null | { name: string; label: string; price: number }>(null);

  if (!camp || !camp.campPricing) {
    return (
      <>
        <AppHeader title={t('camp.title')} showBack />
        <div className={s.page}>
          <EmptyState text={t('booking.classNotFound')} />
        </div>
      </>
    );
  }

  const options: { key: DayChoice; label: string; price: number }[] = [
    { key: 'one', label: t('camp.oneDay'), price: camp.campPricing.oneDay },
    { key: 'two', label: t('camp.twoDays'), price: camp.campPricing.twoDay },
    { key: 'three', label: t('camp.threeDays'), price: camp.campPricing.threeDay },
  ];
  const chosen = options.find((o) => o.key === days);
  const student = students.find((st) => st.id === studentId);

  const confirm = () => {
    if (!student || !chosen) return;
    setResult({
      name: `${student.firstName} ${student.lastName}`,
      label: chosen.label,
      price: chosen.price,
    });
  };

  // ---- Success ----
  if (result) {
    return (
      <>
        <AppHeader title={t('camp.title')} showBack={false} />
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
          <div style={{ fontSize: 19, fontWeight: 800, marginTop: 8 }}>{t('camp.success')}</div>
          <div className={s.muted}>
            {result.name} · {tl(camp.title)}
          </div>
          <div
            className={s.banner}
            style={{ marginTop: 10, background: 'var(--mfc-cat-academy-bg)', color: '#7a5b00' }}
          >
            {result.label} · {formatAUD(result.price)}
          </div>
          <div style={{ width: '100%', marginTop: 12 }}>
            <Button block onClick={() => nav('/parent/classes')}>
              {t('common.done')}
            </Button>
          </div>
        </div>
      </>
    );
  }

  // ---- Registration form ----
  return (
    <>
      <AppHeader title={t('camp.title')} showBack />
      <div className={s.page}>
        <Card>
          <div style={{ fontWeight: 800, fontSize: 15.5 }}>{tl(camp.title)}</div>
          <div className={s.muted} style={{ marginTop: 4 }}>
            {t('camp.dates')}: {(camp.campDates ?? []).map((d) => formatShortDate(d, lang)).join(' – ')}
          </div>
          <div className={s.muted} style={{ marginTop: 2 }}>
            {venueById(camp.venueId)?.name} · {t('classes.ages')} {camp.ageRange.min}–{camp.ageRange.max}
          </div>
        </Card>

        {/* Select student */}
        <div className={s.label}>{t('booking.selectStudent')}</div>
        <Card flush>
          {students.map((st) => {
            const selected = st.id === studentId;
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
                    <span className={s.muted}>{ageFromDob(st.dob)} {t('common.years')}</span>
                  </span>
                </span>
                <Dot on={selected} />
              </button>
            );
          })}
        </Card>

        {/* Select days */}
        <div className={s.label}>{t('camp.selectDays')}</div>
        <div className={s.stackSm}>
          {options.map((o) => {
            const selected = o.key === days;
            return (
              <button
                key={o.key}
                onClick={() => setDays(o.key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  border: `2px solid ${selected ? 'var(--mfc-blue)' : 'var(--mfc-border)'}`,
                  background: 'var(--mfc-surface)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                  fontWeight: 700,
                }}
              >
                <span>{o.label}</span>
                <span style={{ color: 'var(--mfc-blue)', fontWeight: 800 }}>{formatAUD(o.price)}</span>
              </button>
            );
          })}
        </div>

        {chosen && (
          <Card>
            <div className={s.kv} style={{ fontSize: 16 }}>
              <span style={{ fontWeight: 700 }}>{t('camp.total')}</span>
              <span style={{ fontWeight: 800, color: 'var(--mfc-blue)' }}>{formatAUD(chosen.price)}</span>
            </div>
          </Card>
        )}

        <Button block variant="navy" disabled={!studentId || !days} onClick={confirm}>
          {t('camp.confirm')}
        </Button>
      </div>
    </>
  );
}

function Dot({ on }: { on: boolean }) {
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
      {on && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--mfc-blue)' }} />}
    </span>
  );
}
