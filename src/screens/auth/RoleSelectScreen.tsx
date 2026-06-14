import { useNavigate } from 'react-router-dom';
import { PhoneFrame } from '../../components/PhoneFrame';
import { IconChevron, IconUsers } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import s from './RoleSelectScreen.module.css';

export function RoleSelectScreen() {
  const { t, lang, setLang } = useI18n();
  const nav = useNavigate();

  return (
    <PhoneFrame statusOnNavy>
      <div className={s.wrap}>
        <div className={s.langRow}>
          <button className={s.langBtn} onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}>
            {lang === 'en' ? '日本語' : 'English'}
          </button>
        </div>

        <div className={s.hero}>
          <img className={s.logo} src={`${import.meta.env.BASE_URL}matefc-logo.png`} alt="MateFC" />
          <div className={s.welcome}>{t('role.welcome')}</div>
          <div className={s.tagline}>{t('role.tagline')}</div>
        </div>

        <div className={s.choose}>{t('role.chooseAccount')}</div>

        <button className={s.roleCard} onClick={() => nav('/login/parent')}>
          <span className={s.cardIcon}>
            <IconUsers size={22} color="#fff" />
          </span>
          <span className={s.roleText}>
            <span className={s.cardTitle}>{t('role.parents')}</span>
            <span className={s.cardDesc}>{t('role.parentsDesc')}</span>
          </span>
          <IconChevron size={20} color="rgba(255,255,255,0.6)" />
        </button>

        <button className={s.roleCard} onClick={() => nav('/login/coach')}>
          <span className={s.cardIcon} style={{ background: 'var(--mfc-cat-academy)' }}>
            <IconUsers size={22} color="#3a2c00" />
          </span>
          <span className={s.roleText}>
            <span className={s.cardTitle}>{t('role.coach')}</span>
            <span className={s.cardDesc}>{t('role.coachDesc')}</span>
          </span>
          <IconChevron size={20} color="rgba(255,255,255,0.6)" />
        </button>
      </div>
    </PhoneFrame>
  );
}
