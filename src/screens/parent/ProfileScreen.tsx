import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Button, Card, SegmentedControl } from '../../components/primitives';
import { useI18n } from '../../i18n/I18nContext';
import { useSession } from '../../context/SessionContext';
import { useParent } from './useParent';
import { metaFor } from '../../lib/membership';
import { weekdayLabel, formatAUD } from '../../lib/format';
import { plans } from '../../data/plans';
import type { Lang } from '../../types/domain';
import s from '../screen.module.css';

export function ProfileScreen() {
  const { t, lang, setLang, tl } = useI18n();
  const { signOut } = useSession();
  const { family, students, data } = useParent();
  const nav = useNavigate();

  const signOutGo = () => {
    signOut();
    nav('/');
  };

  return (
    <>
      <AppHeader title={t('profile.title')} showLang={false} curved />
      <div className={s.page}>
        {/* Account */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar label={family.familyName} size={48} color="var(--mfc-blue)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{family.familyName} {t('dash.family')}</div>
              <div className={s.muted}>{family.primaryContact.name}</div>
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--mfc-border)', margin: '12px 0' }} />
          <div className={s.kv}><span>{t('profile.contact')}</span><span>{family.primaryContact.email}</span></div>
          <div className={s.kv}><span>&nbsp;</span><span>{family.primaryContact.phone}</span></div>
          <div className={s.kv}><span>{t('dash.myStudents')}</span><span>{students.map((st) => st.firstName).join(', ')}</span></div>
        </Card>

        {/* Language */}
        <div className={s.label}>{t('profile.language')}</div>
        <Card>
          <SegmentedControl<Lang>
            full
            value={lang}
            onChange={setLang}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ja', label: '日本語' },
            ]}
          />
        </Card>

        {/* Reference — venues */}
        <div className={s.label}>{t('profile.venues')}</div>
        <Card flush>
          {data.venues.map((v) => (
            <div key={v.id} className={s.lrow} style={{ padding: '11px 16px', borderBottom: '1px solid var(--mfc-border)', alignItems: 'center' }}>
              <span>
                <span style={{ display: 'block', fontWeight: 600, fontSize: 14 }}>
                  {v.name} {v.isNew && <span style={{ color: 'var(--mfc-blue)', fontSize: 11, fontWeight: 800 }}>NEW</span>}
                </span>
                <span className={s.muted}>{v.weekdays.map((w) => weekdayLabel(w, lang)).join(' · ')}</span>
              </span>
            </div>
          ))}
        </Card>

        {/* Reference — plans */}
        <div className={s.label}>{t('profile.plans')}</div>
        <Card flush>
          {plans.map((p) => {
            const meta = metaFor(p.category);
            return (
              <div key={p.id} className={s.lrow} style={{ padding: '11px 16px', borderBottom: '1px solid var(--mfc-border)', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{tl(p.name)}</span>
                <span style={{ fontWeight: 700, color: 'var(--mfc-blue)' }}>
                  {p.monthlyPrice != null
                    ? `${formatAUD(p.monthlyPrice)}${t('common.perMonth')}`
                    : meta.perSessionPrice
                      ? `${formatAUD(meta.perSessionPrice.member)}${t('common.perSession')}`
                      : ''}
                </span>
              </div>
            );
          })}
        </Card>

        <div style={{ marginTop: 8 }}>
          <Button block variant="ghost" onClick={signOutGo}>
            {t('profile.switchRole')}
          </Button>
        </div>
      </div>
    </>
  );
}
