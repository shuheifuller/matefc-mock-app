import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Card, MembershipBadge } from '../../components/primitives';
import { IconChevron } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { metaFor } from '../../lib/membership';
import { venueById } from '../../data/venues';
import { ageFromDob } from '../../lib/format';
import { MembershipCategory } from '../../types/domain';
import s from '../screen.module.css';

type Filter = 'all' | MembershipCategory;

export function RosterScreen() {
  const { t, tl } = useI18n();
  const { students } = useData();
  const nav = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const filterChips: { value: Filter; label: string }[] = [
    { value: 'all', label: t('coach.filterAll') },
    ...Object.values(MembershipCategory).map((cat) => ({
      value: cat,
      label: tl(metaFor(cat).short),
    })),
  ];

  const list = students.filter((st) => {
    if (filter !== 'all' && st.category !== filter) return false;
    if (q && !`${st.firstName} ${st.lastName}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <AppHeader title={t('coach.rosterTitle')}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('coach.search')}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 'var(--r-md)',
            padding: '10px 14px',
            fontSize: 14,
            marginBottom: 10,
            background: 'rgba(255,255,255,0.95)',
          }}
        />
        <div className={s.chipRow}>
          {filterChips.map((c) => (
            <button
              key={c.value}
              className={`${s.chip} ${filter === c.value ? s.chipActive : ''}`}
              onClick={() => setFilter(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </AppHeader>

      <div className={s.page}>
        <Card flush>
          {list.map((st) => (
            <button
              key={st.id}
              className={s.lrow}
              style={{
                width: '100%',
                border: 'none',
                background: 'var(--mfc-surface)',
                padding: '12px 16px',
                borderBottom: '1px solid var(--mfc-border)',
                alignItems: 'center',
              }}
              onClick={() => nav(`/coach/roster/${st.id}`)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={38} />
                <span style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: 700 }}>
                    {st.firstName} {st.lastName}
                  </span>
                  <span className={s.muted}>
                    {ageFromDob(st.dob)} {t('common.years')} · {venueById(st.homeVenueId)?.suburb ?? '—'}
                  </span>
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MembershipBadge category={st.category} />
                <IconChevron size={18} color="var(--mfc-muted)" />
              </span>
            </button>
          ))}
        </Card>
        <div className={s.muted} style={{ textAlign: 'center', fontSize: 12 }}>
          {list.length} / {students.length}
        </div>
      </div>
    </>
  );
}
