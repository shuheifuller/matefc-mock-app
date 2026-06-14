import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Card, MembershipBadge, SectionTitle } from '../../components/primitives';
import { NewsCard } from '../../components/NewsCard';
import { IconBall, IconCalendar, IconCard, IconChevron, IconClock, IconStar } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { classIdsForStudents, upcomingSessionsForClasses } from '../../lib/selectors';
import { classById } from '../../data/classes';
import { venueById } from '../../data/venues';
import { ageFromDob, formatAUD, formatDate, isBirthdayThisWeek } from '../../lib/format';
import s from '../screen.module.css';

export function DashboardScreen() {
  const { t, lang, tl } = useI18n();
  const { family, students, unread, data } = useParent();
  const nav = useNavigate();

  const classIds = classIdsForStudents(data.enrollments, students.map((st) => st.id));
  const upcoming = upcomingSessionsForClasses(data.sessions, classIds);
  const nextSession = upcoming.find((se) => se.status === 'scheduled');
  const nextClass = nextSession ? classById(nextSession.classId) : undefined;

  const familyInvoices = data.invoices.filter((i) => i.familyId === family.id);
  const dueInvoice = familyInvoices.find((i) => i.status === 'due' || i.status === 'overdue');

  const pinnedNews = [...data.news].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned)).slice(0, 2);
  const birthdayKids = students.filter((st) => isBirthdayThisWeek(st.dob));

  return (
    <>
      <AppHeader
        title={`${t('dash.hello')}, ${family.primaryContact.name.split(' ')[0]}`}
        subtitle={`${family.familyName} ${t('dash.family')}`}
        bellTo="/parent/notifications"
        unread={unread}
        curved
      />

      <div className={s.page}>
        {/* Payment due */}
        <Card
          onClick={() => nav('/parent/billing')}
          style={{
            background: dueInvoice
              ? dueInvoice.status === 'overdue'
                ? 'var(--mfc-error-bg)'
                : 'var(--mfc-warn-bg)'
              : 'var(--mfc-success-bg)',
          }}
        >
          <div className={s.kv} style={{ marginBottom: 2 }}>
            <span className={s.label} style={{ color: 'inherit' }}>
              {dueInvoice ? t(`billing.${dueInvoice.status}`) : t('dash.noPayment')}
            </span>
            <IconCard size={20} color="var(--mfc-navy)" />
          </div>
          {dueInvoice ? (
            <>
              <div className={s.heroName} style={{ color: 'var(--mfc-navy)' }}>
                {formatAUD(dueInvoice.total)}
              </div>
              <div className={s.muted}>
                {t('billing.dueOn')} {formatDate(dueInvoice.dueDate, lang)} ·{' '}
                {family.autopayEnabled ? t('dash.autopayOn') : t('dash.autopayOff')}
              </div>
            </>
          ) : (
            <div className={s.muted}>{t('billing.autopay')} ✓</div>
          )}
        </Card>

        {/* Next session */}
        {nextSession && nextClass && (
          <Card onClick={() => nav('/parent/schedule')}>
            <div className={s.label} style={{ marginBottom: 6 }}>
              {t('dash.nextSession')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'var(--mfc-sky)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '0 0 auto',
                }}
              >
                <IconCalendar size={22} color="var(--mfc-blue)" />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{tl(nextClass.title)}</div>
                <div className={s.muted} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <IconClock size={13} color="var(--mfc-muted)" />
                  {formatDate(nextSession.date, lang)} · {nextClass.startTime} ·{' '}
                  {venueById(nextClass.venueId)?.suburb}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Birthday */}
        {birthdayKids.map((st) => (
          <Card key={st.id} style={{ background: '#fae8ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 26 }}>🎉</span>
              <div>
                <div style={{ fontWeight: 800, color: '#86198f' }}>{t('dash.happyBirthday')}</div>
                <div className={s.muted}>{st.firstName} {st.lastName}</div>
              </div>
            </div>
          </Card>
        ))}

        {/* My students */}
        <SectionTitle
          title={t('dash.myStudents')}
          action={
            <button onClick={() => nav('/parent/students')}>{t('common.seeAll')}</button>
          }
        />
        <Card flush>
          {students.map((st) => (
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
                <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={38} />
                <span style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: 700 }}>
                    {st.firstName} {st.lastName}
                  </span>
                  <span className={s.muted}>
                    {ageFromDob(st.dob)} {t('common.years')}
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

        {/* Quick links */}
        <div className={s.rowWrap} style={{ marginTop: 4 }}>
          <QuickLink icon={<IconCalendar size={20} color="var(--mfc-blue)" />} label={t('attendance.title')} onClick={() => nav('/parent/attendance')} />
          <QuickLink icon={<IconStar size={20} color="var(--mfc-blue)" />} label={t('progress.title')} onClick={() => nav('/parent/progress')} />
          <QuickLink icon={<IconBall size={20} color="var(--mfc-blue)" />} label={t('classes.title')} onClick={() => nav('/parent/classes')} />
        </div>

        {/* News */}
        <SectionTitle title={t('dash.news')} action={<button onClick={() => nav('/parent/news')}>{t('common.seeAll')}</button>} />
        <div className={s.stack}>
          {pinnedNews.map((n) => (
            <NewsCard key={n.id} item={n} onClick={() => nav('/parent/news')} />
          ))}
        </div>
      </div>
    </>
  );
}

function QuickLink({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: 'var(--mfc-surface)',
        border: 'none',
        borderRadius: 'var(--r-md)',
        boxShadow: 'var(--shadow-card)',
        padding: '14px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {icon}
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--mfc-text)' }}>{label}</span>
    </button>
  );
}
