import { useNavigate } from 'react-router-dom';
import { PhoneFrame } from '../../components/PhoneFrame';
import { Avatar } from '../../components/primitives';
import { IconChevron, IconUsers } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useSession } from '../../context/SessionContext';
import { useData } from '../../context/DataContext';
import { adminCoach } from '../../data/coaches';
import s from './RoleSelectScreen.module.css';

export function RoleSelectScreen() {
  const { t, lang, setLang } = useI18n();
  const { signInParent, signInCoach } = useSession();
  const { families } = useData();
  const nav = useNavigate();

  const enterParent = (familyId: string, preferredLang: 'en' | 'ja') => {
    signInParent(familyId);
    setLang(preferredLang);
    nav('/parent');
  };
  const enterCoach = () => {
    signInCoach(adminCoach.id);
    nav('/coach');
  };

  return (
    <PhoneFrame statusOnNavy>
      <div className={s.wrap}>
        <div className={s.langRow}>
          <button className={s.langBtn} onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}>
            {lang === 'en' ? '日本語' : 'English'}
          </button>
        </div>

        <div className={s.hero}>
          <img className={s.logo} src={`${import.meta.env.BASE_URL}matefc-logo.svg`} alt="MateFC" />
          <div className={s.welcome}>{t('role.welcome')}</div>
          <div className={s.tagline}>{t('role.tagline')}</div>
        </div>

        <div className={s.choose}>{t('role.chooseAccount')}</div>

        <div className={s.card}>
          <div className={s.cardHead}>
            <span className={s.cardIcon}>
              <IconUsers size={22} color="#fff" />
            </span>
            <div>
              <div className={s.cardTitle}>{t('role.parents')}</div>
              <div className={s.cardDesc}>{t('role.parentsDesc')}</div>
            </div>
          </div>
          <div className={s.familyList}>
            {families.map((f) => (
              <button
                key={f.id}
                className={s.familyBtn}
                onClick={() => enterParent(f.id, f.preferredLang)}
              >
                <Avatar label={f.familyName} size={34} color="var(--mfc-blue)" />
                <div>
                  <div className={s.familyName}>{f.familyName} Family</div>
                  <div className={s.familySub}>
                    {f.studentIds.length} {t('role.students')} · {f.primaryContact.name}
                  </div>
                </div>
                <span className={s.familyChev}>
                  <IconChevron size={18} color="var(--mfc-muted)" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHead}>
            <span className={s.cardIcon} style={{ background: 'var(--mfc-cat-academy)' }}>
              <IconUsers size={22} color="#3a2c00" />
            </span>
            <div>
              <div className={s.cardTitle}>{t('role.coach')}</div>
              <div className={s.cardDesc}>{t('role.coachDesc')}</div>
            </div>
          </div>
          <button className={s.coachBtn} onClick={enterCoach}>
            {t('role.signInAs')} {adminCoach.name}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
