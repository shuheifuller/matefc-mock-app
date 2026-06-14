import type { SkillProgress } from '../types/domain';

const mkSkills = (mind: number, ball: number, pass: number, fitness: number, agility: number) => [
  { key: 'attitude', label: { en: 'Attitude & Focus', ja: '姿勢・集中力' }, pillar: 'mind' as const, level: mind },
  { key: 'ball_control', label: { en: 'Ball Control', ja: 'ボールコントロール' }, pillar: 'skill' as const, level: ball },
  { key: 'passing', label: { en: 'Passing & Vision', ja: 'パス・視野' }, pillar: 'skill' as const, level: pass },
  { key: 'fitness', label: { en: 'Fitness', ja: '体力' }, pillar: 'body' as const, level: fitness },
  { key: 'agility', label: { en: 'Agility & Speed', ja: '俊敏性・スピード' }, pillar: 'body' as const, level: agility },
];

export const skillProgress: SkillProgress[] = [
  {
    studentId: 'st_tanaka_a',
    updatedAt: '2026-06-08',
    coachId: 'c1',
    skills: mkSkills(5, 5, 4, 4, 5),
    feedback: {
      en: 'Sora reads the game beautifully and leads by example. Keep sharpening weak-foot passing.',
      ja: 'ソラは試合をよく読み、手本となる存在です。逆足のパス精度をさらに磨きましょう。',
    },
  },
  {
    studentId: 'st_tanaka_b',
    updatedAt: '2026-06-05',
    coachId: 'c4',
    skills: mkSkills(3, 3, 2, 4, 4),
    feedback: {
      en: 'Hina is full of energy. Focus on first-touch control under pressure.',
      ja: 'ヒナはとても元気です。プレッシャー下でのファーストタッチを重点的に。',
    },
  },
  {
    studentId: 'st_nguyen_a',
    updatedAt: '2026-06-13',
    coachId: 'c2',
    skills: mkSkills(5, 5, 5, 4, 4),
    feedback: {
      en: 'Kai is a standout in the Academy — composed on the ball and a great teammate in matches.',
      ja: 'カイはアカデミーでも際立つ存在。ボール扱いが落ち着いており、試合でも好チームメイトです。',
    },
  },
  {
    studentId: 'st_smith',
    updatedAt: '2026-06-02',
    coachId: 'c3',
    skills: mkSkills(4, 2, 3, 3, 3),
    feedback: {
      en: 'Oliver listens well and is improving every week. Practice dribbling at home.',
      ja: 'オリバーは話をよく聞き、毎週成長しています。家でのドリブル練習を続けましょう。',
    },
  },
];

export const skillProgressForStudent = (studentId: string) =>
  skillProgress.find((s) => s.studentId === studentId);
