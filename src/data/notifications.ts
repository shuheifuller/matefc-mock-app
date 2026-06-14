import type { AppNotification } from '../types/domain';

export const notifications: AppNotification[] = [
  {
    id: 'no_1',
    forRole: 'parent',
    familyId: 'fam_smith',
    type: 'payment',
    title: { en: 'Payment overdue', ja: 'お支払いが期限超過' },
    body: { en: 'Your June invoice of $130 is overdue. Tap to pay now.', ja: '6月分 $130 のお支払いが期限を過ぎています。タップしてお支払いください。' },
    createdAt: '2026-06-14T07:30:00',
    read: false,
  },
  {
    id: 'no_2',
    forRole: 'both',
    type: 'schedule',
    title: { en: 'Wednesday class cancelled (weather)', ja: '水曜クラス中止（天候）' },
    body: { en: 'Naremburn Wed 17 June is cancelled. A make-up token has been added.', ja: 'ナレンバーン6月17日(水)は中止です。振替チケットを付与しました。' },
    createdAt: '2026-06-14T06:15:00',
    read: false,
  },
  {
    id: 'no_3',
    forRole: 'parent',
    familyId: 'fam_lee',
    type: 'trial',
    title: { en: 'Trial session reminder', ja: '体験レッスンのご案内' },
    body: { en: "Min's trial is on Mon 22 June at Chatswood, 4:30 PM. See you there!", ja: 'ミンの体験は6月22日(月) チャッツウッド 16:30です。お待ちしています！' },
    createdAt: '2026-06-13T15:00:00',
    read: false,
  },
  {
    id: 'no_4',
    forRole: 'parent',
    familyId: 'fam_tanaka',
    type: 'makeup',
    title: { en: 'Make-up token earned', ja: '振替チケットを付与' },
    body: { en: 'A weather make-up token is now available for Sora.', ja: 'ソラに天候振替チケットが付与されました。' },
    createdAt: '2026-05-21T19:00:00',
    read: true,
  },
  {
    id: 'no_5',
    forRole: 'parent',
    familyId: 'fam_brown',
    type: 'birthday',
    title: { en: 'Happy birthday, Lucas! 🎉', ja: 'ルーカス、お誕生日おめでとう！🎉' },
    body: { en: 'The whole MateFC team wishes Lucas a fantastic birthday.', ja: 'MateFC一同、ルーカスの誕生日をお祝いします。' },
    createdAt: '2026-06-14T08:00:00',
    read: false,
  },
  {
    id: 'no_6',
    forRole: 'both',
    type: 'news',
    title: { en: 'July Holiday Camp open', ja: '7月ホリデーキャンプ受付開始' },
    body: { en: 'Bookings are open for the July 7–9 holiday camp.', ja: '7月7〜9日のホリデーキャンプの予約を開始しました。' },
    createdAt: '2026-06-10T09:05:00',
    read: true,
  },
  // Coach-facing
  {
    id: 'no_7',
    forRole: 'coach',
    type: 'trial',
    title: { en: 'New trial booked', ja: '新しい体験予約' },
    body: { en: 'Min Lee booked a trial for Mon 22 June (Chatswood).', ja: 'ミン・リーが6月22日(月)チャッツウッドの体験を予約しました。' },
    createdAt: '2026-06-13T14:55:00',
    read: false,
  },
];

export const notificationsForRoleFamily = (
  role: 'parent' | 'coach',
  familyId?: string,
) =>
  notifications.filter((n) => {
    if (n.forRole !== role && n.forRole !== 'both') return false;
    if (role === 'parent' && n.familyId && n.familyId !== familyId) return false;
    return true;
  });
