import { AppHeader } from '../../components/AppHeader';
import { Avatar, Card, EmptyState, ProgressBar } from '../../components/primitives';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { coachById } from '../../data/coaches';
import { formatDate } from '../../lib/format';
import type { Pillar } from '../../types/domain';
import s from '../screen.module.css';

export function ProgressScreen() {
  const { t, lang, tl } = useI18n();
  const { students, data } = useParent();

  const pillarLabel: Record<Pillar, string> = {
    mind: t('progress.mind'),
    skill: t('progress.skill'),
    body: t('progress.body'),
  };
  const pillarOrder: Pillar[] = ['mind', 'skill', 'body'];

  const withProgress = students.filter((st) => data.skillProgress.some((p) => p.studentId === st.id));

  return (
    <>
      <AppHeader title={t('progress.title')} showBack bellTo="/parent/notifications" />
      <div className={s.page}>
        {withProgress.length === 0 && <EmptyState text={t('progress.noData')} />}
        {withProgress.map((st) => {
          const prog = data.skillProgress.find((p) => p.studentId === st.id)!;
          const coach = coachById(prog.coachId);
          return (
            <div key={st.id}>
              <div className={s.groupTitle}>
                <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={24} />
                {st.firstName} {st.lastName}
              </div>
              <Card>
                {pillarOrder.map((pillar) => {
                  const skills = prog.skills.filter((sk) => sk.pillar === pillar);
                  if (skills.length === 0) return null;
                  return (
                    <div key={pillar} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: `var(--mfc-pillar-${pillar})`, marginBottom: 6 }}>
                        {pillarLabel[pillar]}
                      </div>
                      <div className={s.stackSm}>
                        {skills.map((sk) => (
                          <div key={sk.key}>
                            <div className={s.kv} style={{ padding: 0, marginBottom: 3 }}>
                              <span style={{ fontSize: 13 }}>{tl(sk.label)}</span>
                              <span style={{ fontSize: 13, fontWeight: 700 }}>{sk.level}/5</span>
                            </div>
                            <ProgressBar value={sk.level} pillar={sk.pillar} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div style={{ height: 1, background: 'var(--mfc-border)', margin: '4px 0 10px' }} />
                <div className={s.label}>{t('progress.coachFeedback')}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 4 }}>{tl(prog.feedback)}</div>
                <div className={s.muted} style={{ marginTop: 8 }}>
                  {t('progress.updatedBy')}: {coach?.name} · {formatDate(prog.updatedAt, lang)}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}
