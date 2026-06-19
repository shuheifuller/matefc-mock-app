import type { Coach } from '../types/domain';

export const coaches: Coach[] = [
  {
    id: 'c1',
    name: 'Yuzo Tashiro',
    roleTitle: { en: 'Head Coach / Director', ja: 'ヘッドコーチ / 代表' },
    bio: {
      en: 'Former J-League forward. Former Japan international. Leads MateFC.',
      ja: '元JリーグFW・元日本代表。MateFCを統括。',
    },
    avatarColor: '#0a1f44',
    isAdmin: true,
  },
  {
    id: 'c2',
    name: 'Akira Sato',
    roleTitle: { en: 'Academy Coach', ja: 'アカデミーコーチ' },
    bio: { en: 'NPL-licensed coach leading the Academy pathway.', ja: 'NPLライセンス保持。アカデミーを指導。' },
    avatarColor: '#d4a017',
  },
  {
    id: 'c3',
    name: 'Liam Carter',
    roleTitle: { en: 'Senior Coach', ja: 'シニアコーチ' },
    avatarColor: '#2563eb',
  },
  { id: 'c4', name: 'Yuki Tanaka', roleTitle: { en: 'Coach', ja: 'コーチ' }, avatarColor: '#60a5fa' },
  { id: 'c5', name: 'Sophie Brown', roleTitle: { en: 'Coach', ja: 'コーチ' }, avatarColor: '#16a34a' },
  { id: 'c6', name: 'Daichi Ito', roleTitle: { en: 'Coach', ja: 'コーチ' }, avatarColor: '#8b5cf6' },
  { id: 'c7', name: 'Marco Rossi', roleTitle: { en: 'Coach', ja: 'コーチ' }, avatarColor: '#f97316' },
  { id: 'c8', name: 'Hana Kobayashi', roleTitle: { en: "Coach / Women's Football", ja: 'コーチ / 女子サッカー' }, avatarColor: '#db2777' },
  { id: 'c9', name: 'Tom Nguyen', roleTitle: { en: 'Goalkeeper Coach', ja: 'GKコーチ' }, avatarColor: '#0891b2' },
];

export const coachById = (id?: string) => coaches.find((c) => c.id === id);
export const adminCoach = coaches.find((c) => c.isAdmin)!;
