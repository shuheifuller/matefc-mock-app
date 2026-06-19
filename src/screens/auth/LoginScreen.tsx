import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PhoneFrame } from '../../components/PhoneFrame';
import { IconBack, IconGlobe } from '../../components/Icons';
import { EnvBadge } from '../../components/EnvBadge';
import { useI18n } from '../../i18n/I18nContext';
import { useSession } from '../../context/SessionContext';
import { familyById } from '../../data/families';
import {
  COACH_LOGIN,
  DEFAULT_PARENT_LOGIN,
  PARENT_LOGINS,
  matchCoachLogin,
  matchParentLogin,
} from '../../data/credentials';
import type { Lang } from '../../types/domain';
import s from './LoginScreen.module.css';

export function LoginScreen() {
  const { role } = useParams<{ role: string }>();
  const { t, lang, setLang } = useI18n();
  const { signInParent, signInCoach } = useSession();
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showMore, setShowMore] = useState(false);

  if (role !== 'parent' && role !== 'coach') return <Navigate to="/" replace />;
  const isParent = role === 'parent';

  const enterParent = (familyId: string) => {
    const fam = familyById(familyId);
    signInParent(familyId);
    if (fam) setLang(fam.preferredLang as Lang);
    nav('/parent');
  };

  const submit = () => {
    if (isParent) {
      const m = matchParentLogin(email, password);
      if (m) return enterParent(m.familyId);
    } else if (matchCoachLogin(email, password)) {
      signInCoach(COACH_LOGIN.coachId);
      return nav('/coach');
    }
    setError(true);
  };

  // Mock SSO — signs into the default demo account for the role.
  const sso = () => {
    if (isParent) enterParent(DEFAULT_PARENT_LOGIN.familyId);
    else {
      signInCoach(COACH_LOGIN.coachId);
      nav('/coach');
    }
  };

  const fill = (e: string) => {
    setEmail(e);
    setPassword('1234');
    setError(false);
  };

  const demoEmail = isParent ? DEFAULT_PARENT_LOGIN.email : COACH_LOGIN.email;
  const otherParentLogins = PARENT_LOGINS.filter((l) => l.email !== DEFAULT_PARENT_LOGIN.email);

  return (
    <PhoneFrame statusOnNavy>
      <div className={s.wrap}>
        <div className={s.topRow}>
          <button className={s.backBtn} onClick={() => nav('/')} aria-label="Back">
            <IconBack size={20} />
          </button>
          <button className={s.langBtn} onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}>
            <IconGlobe size={14} /> {lang === 'en' ? '日本語' : 'EN'}
          </button>
        </div>

        <div className={s.hero}>
          <img className={s.logo} src={`${import.meta.env.BASE_URL}matefc-logo.png`} alt="MateFC" />
          <div className={s.title}>
            {isParent ? t('login.parentTitle') : t('login.coachTitle')} <EnvBadge />
          </div>
          <div className={s.subtitle}>{isParent ? t('role.parentsDesc') : t('role.coachDesc')}</div>
        </div>

        <div className={s.field}>
          <label className={s.label}>{t('login.email')}</label>
          <input
            className={`${s.input} ${error ? s.inputError : ''}`}
            type="email"
            autoComplete="email"
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
          />
        </div>

        <div className={s.field}>
          <label className={s.label}>{t('login.password')}</label>
          <input
            className={`${s.input} ${error ? s.inputError : ''}`}
            type="password"
            autoComplete="current-password"
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>

        {error && <div className={s.error}>{t('login.error')}</div>}

        <button className={s.signInBtn} onClick={submit}>
          {t('login.signIn')}
        </button>
        <button className={s.forgot}>{t('login.forgot')}</button>

        <div className={s.divider}>{t('login.or')}</div>

        <button className={`${s.sso} ${s.ssoGoogle}`} onClick={sso}>
          <GoogleIcon /> {t('login.google')}
        </button>
        <button className={`${s.sso} ${s.ssoFacebook}`} onClick={sso}>
          <FacebookIcon /> {t('login.facebook')}
        </button>

        {/* Demo helper */}
        <div className={s.demo}>
          <div className={s.demoHead}>
            <span className={s.demoLabel}>{t('login.demoHint')}</span>
            <button className={s.demoFill} onClick={() => fill(demoEmail)}>
              {t('login.useDemo')}
            </button>
          </div>
          <div className={s.demoCred}>
            {demoEmail}
            <br />
            {t('login.password')}: 1234
          </div>

          {isParent && (
            <>
              <button className={s.moreToggle} onClick={() => setShowMore((v) => !v)}>
                {showMore ? '▾' : '▸'} {t('login.moreDemo')}
              </button>
              {showMore && (
                <div className={s.moreList}>
                  {otherParentLogins.map((l) => (
                    <button key={l.email} className={s.moreItem} onClick={() => fill(l.email)}>
                      <span className={s.moreEmail}>{l.email}</span>
                      <span className={s.moreName}>{familyById(l.familyId)?.familyName}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={s.mockNote}>{t('login.mockNote')}</div>
      </div>
    </PhoneFrame>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87V12h3.33l-.53 3.47h-2.8v8.38A12 12 0 0 0 24 12Z" />
    </svg>
  );
}
