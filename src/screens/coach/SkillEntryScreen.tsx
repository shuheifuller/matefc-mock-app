import { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { Avatar, Button, Card } from '../../components/primitives';
import { IconCheck } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { useSession } from '../../context/SessionContext';
import { MembershipCategory, type Pillar, type SkillProgress } from '../../types/domain';
import s from '../screen.module.css';

const TEMPLATE: SkillProgress['skills'] = [
  { key: 'attitude', label: { en: 'Attitude & Focus', ja: '姿勢・集中力' }, pillar: 'mind', level: 3 },
  { key: 'ball_control', label: { en: 'Ball Control', ja: 'ボールコントロール' }, pillar: 'skill', level: 3 },
  { key: 'passing', label: { en: 'Passing & Vision', ja: 'パス・視野' }, pillar: 'skill', level: 3 },
  { key: 'fitness', label: { en: 'Fitness', ja: '体力' }, pillar: 'body', level: 3 },
  { key: 'agility', label: { en: 'Agility & Speed', ja: '俊敏性・スピード' }, pillar: 'body', level: 3 },
];

export function SkillEntryScreen() {
  const { t, tl } = useI18n();
  const data = useData();
  const { coachId } = useSession();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [saved, setSaved] = useState(false);

  const start = (id: string) => {
    const existing = data.skillProgress.find((sp) => sp.studentId === id);
    const base: Record<string, number> = {};
    (existing?.skills ?? TEMPLATE).forEach((sk) => (base[sk.key] = sk.level));
    setLevels(base);
    setFeedback(existing ? tl(existing.feedback) : '');
    setStudentId(id);
    setSaved(false);
  };

  const save = () => {
    if (!studentId) return;
    const entry: SkillProgress = {
      studentId,
      updatedAt: '2026-06-14',
      coachId: coachId ?? 'c1',
      skills: TEMPLATE.map((sk) => ({ ...sk, level: levels[sk.key] ?? 3 })),
      feedback: { en: feedback, ja: feedback },
    };
    data.saveSkillProgress(entry);
    setSaved(true);
  };

  const eligible = data.students.filter((st) => st.category !== MembershipCategory.Trial);
  const pillarOrder: Pillar[] = ['mind', 'skill', 'body'];
  const pillarLabel: Record<Pillar, string> = {
    mind: t('progress.mind'),
    skill: t('progress.skill'),
    body: t('progress.body'),
  };

  if (!studentId) {
    return (
      <>
        <AppHeader title={t('coach.skillEntry')} showLang={false} />
        <div className={s.page}>
          <div className={s.label}>{t('coach.pickStudentSkills')}</div>
          <Card flush>
            {eligible.map((st) => (
              <button
                key={st.id}
                className={s.lrow}
                style={{ width: '100%', border: 'none', background: 'var(--mfc-surface)', padding: '12px 16px', borderBottom: '1px solid var(--mfc-border)', alignItems: 'center' }}
                onClick={() => start(st.id)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar label={`${st.firstName} ${st.lastName}`} color={st.avatarColor} size={36} />
                  <span style={{ fontWeight: 700 }}>{st.firstName} {st.lastName}</span>
                </span>
              </button>
            ))}
          </Card>
        </div>
      </>
    );
  }

  const student = data.students.find((st) => st.id === studentId)!;

  return (
    <>
      <AppHeader title={`${student.firstName} ${student.lastName}`} showBack smallTitle showLang={false} />
      <div className={s.page}>
        {saved && (
          <div className={s.banner} style={{ background: 'var(--mfc-success-bg)', color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconCheck size={18} color="var(--mfc-success)" /> {t('common.save')} ✓
          </div>
        )}
        {pillarOrder.map((pillar) => (
          <div key={pillar}>
            <div style={{ fontSize: 13, fontWeight: 800, color: `var(--mfc-pillar-${pillar})`, margin: '8px 0 4px' }}>
              {pillarLabel[pillar]}
            </div>
            <Card>
              <div className={s.stackSm}>
                {TEMPLATE.filter((sk) => sk.pillar === pillar).map((sk) => (
                  <div key={sk.key}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{tl(sk.label)}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map((n) => {
                        const active = (levels[sk.key] ?? 3) >= n;
                        return (
                          <button
                            key={n}
                            onClick={() => setLevels((prev) => ({ ...prev, [sk.key]: n }))}
                            style={{
                              flex: 1,
                              height: 34,
                              border: 'none',
                              borderRadius: 'var(--r-sm)',
                              background: active ? `var(--mfc-pillar-${pillar})` : 'var(--mfc-surface-2)',
                              color: active ? '#fff' : 'var(--mfc-muted)',
                              fontWeight: 800,
                            }}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}

        <div className={s.label}>{t('progress.coachFeedback')}</div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          placeholder="..."
          style={{
            width: '100%',
            border: '1.5px solid var(--mfc-border)',
            borderRadius: 'var(--r-md)',
            padding: 12,
            fontSize: 14,
            resize: 'vertical',
          }}
        />
        <Button block variant="navy" onClick={save}>{t('coach.saveSkills')}</Button>
      </div>
    </>
  );
}
