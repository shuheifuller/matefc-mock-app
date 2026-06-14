import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Card, MembershipBadge } from '../../components/primitives';
import { IconChevron } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { GROUP_LABEL, GROUP_ORDER, groupOf } from '../../lib/membership';
import { venueById } from '../../data/venues';
import { ageFromDob } from '../../lib/format';
import type { MembershipGroup } from '../../types/domain';
import s from '../screen.module.css';

export function StudentsScreen() {
  const { t, lang } = useI18n();
  const { students } = useParent();
  const nav = useNavigate();

  return (
    <>
      <AppHeader title={t('students.title')} showBack bellTo="/parent/notifications" />
      <div className={s.page}>
        {GROUP_ORDER.map((group) => {
          const inGroup = students.filter((st) => groupOf(st.category) === group);
          if (inGroup.length === 0) return null;
          return (
            <div key={group}>
              <div className={s.groupTitle}>{GROUP_LABEL[group as MembershipGroup][lang]}</div>
              <Card flush>
                {inGroup.map((st) => (
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
                    onClick={() => nav(`/parent/students/${st.id}`)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={40} />
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
            </div>
          );
        })}
      </div>
    </>
  );
}
