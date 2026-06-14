import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Button, Card, SegmentedControl } from '../../components/primitives';
import { IconChevron } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useSession } from '../../context/SessionContext';
import { useData } from '../../context/DataContext';
import { coachById } from '../../data/coaches';
import type { Lang } from '../../types/domain';
import s from '../screen.module.css';

export function CoachProfileScreen() {
  const { t, lang, setLang, tl } = useI18n();
  const { coachId, signOut } = useSession();
  const data = useData();
  const nav = useNavigate();

  const coach = coachById(coachId ?? '');

  const signOutGo = () => {
    signOut();
    nav('/');
  };

  const links: { label: string; to: string }[] = [
    { label: t('coach.announce'), to: '/coach/announcements' },
    { label: t('coach.skillEntry'), to: '/coach/skills' },
    { label: t('coach.trialsTitle'), to: '/coach/trials' },
  ];

  return (
    <>
      <AppHeader title={t('profile.title')} showLang={false} curved />
      <div className={s.page}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar label={coach?.name ?? 'C'} size={48} color={coach?.avatarColor} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{coach?.name}</div>
              <div className={s.muted}>{coach && tl(coach.roleTitle)}</div>
            </div>
          </div>
          {coach?.bio && (
            <div style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 12, color: 'var(--mfc-muted)' }}>
              {tl(coach.bio)}
            </div>
          )}
        </Card>

        <div className={s.label}>{t('profile.account')}</div>
        <Card flush>
          {links.map((l) => (
            <button
              key={l.to}
              className={s.lrow}
              style={{ width: '100%', border: 'none', background: 'var(--mfc-surface)', padding: '14px 16px', borderBottom: '1px solid var(--mfc-border)', alignItems: 'center' }}
              onClick={() => nav(l.to)}
            >
              <span style={{ fontWeight: 600 }}>{l.label}</span>
              <IconChevron size={18} color="var(--mfc-muted)" />
            </button>
          ))}
        </Card>

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

        <div className={s.label}>{t('profile.reference')} · {t('nav.roster')}</div>
        <Card>
          <div className={s.kv}><span>{t('coach.regularCount')}</span><span>{data.coaches.length} coaches</span></div>
          <div className={s.kv}><span>{t('profile.venues')}</span><span>{data.venues.length}</span></div>
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
