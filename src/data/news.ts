import { NewsCategory, type NewsItem } from '../types/domain';

export const news: NewsItem[] = [
  {
    id: 'news_camp',
    category: NewsCategory.Camp,
    title: { en: 'July Holiday Soccer Camp — Book now!', ja: '7月 ホリデーサッカーキャンプ 受付中！' },
    body: {
      en: 'Join us July 7–9 at Sydney Japanese International School. Warm-up, agility, technical drills, sprint training, passing, a mentoring session and match play. $100 / 1 day, $180 / 2 days, $260 / 3 days.',
      ja: '7月7〜9日、シドニー日本人国際学校にて開催。ウォームアップ、アジリティ、技術練習、スプリント、パス、メンタリング、ゲームを実施。1日 $100 / 2日 $180 / 3日 $260。',
    },
    publishedAt: '2026-06-10T09:00:00',
    pinned: true,
    ctaScreen: '/parent/classes',
  },
  {
    id: 'news_mowbray',
    category: NewsCategory.NewClass,
    title: { en: 'New Tuesday class at Mowbray Public School', ja: 'モウブレー小学校で火曜クラス新設' },
    body: {
      en: 'Our new Tuesday class for ages 6–12 is now open at Mowbray Public School, 4:00 PM. Limited spots remaining.',
      ja: 'モウブレー小学校にて、6〜12歳向けの火曜クラス（16:00）を開講しました。残席わずか。',
    },
    publishedAt: '2026-06-02T10:00:00',
  },
  {
    id: 'news_term',
    category: NewsCategory.Announcement,
    title: { en: 'Winter term schedule confirmed', ja: 'ウィンタータームの予定が確定' },
    body: {
      en: 'All venues continue through winter. Sessions run rain or shine; weather cancellations earn make-up tokens.',
      ja: '全会場、冬季も継続します。雨天決行ですが、天候中止の場合は振替チケットを付与します。',
    },
    publishedAt: '2026-05-28T08:00:00',
  },
  {
    id: 'news_match',
    category: NewsCategory.Event,
    title: { en: 'Academy weekend match results', ja: 'アカデミー 週末マッチ結果' },
    body: {
      en: 'Great effort from our Academy squad on Saturday — a hard-fought 2–2 draw with strong defending and sharp counter-attacks.',
      ja: '土曜のアカデミーは奮闘し、堅守と鋭いカウンターで2-2のドロー。よく頑張りました。',
    },
    publishedAt: '2026-06-13T18:00:00',
  },
  {
    id: 'news_active_kids',
    category: NewsCategory.Announcement,
    title: { en: 'Active Kids Vouchers accepted', ja: 'Active Kids バウチャー利用可能' },
    body: {
      en: 'We accept NSW Active Kids Vouchers for children aged 4–14. Submit yours from the billing screen to receive your credit.',
      ja: '4〜14歳のお子様にNSW Active Kidsバウチャーをご利用いただけます。お支払い画面から提出ください。',
    },
    publishedAt: '2026-05-20T09:00:00',
  },
  {
    id: 'news_photos',
    category: NewsCategory.Event,
    title: { en: 'Team photo day — Saturday 27 June', ja: 'チーム写真撮影日 — 6月27日（土）' },
    body: {
      en: 'Bring your full MateFC kit to Wentworth Park on 27 June for our annual team photos.',
      ja: '6月27日、ウェントワース・パークにて年次チーム写真を撮影します。MateFCのユニフォーム一式をお持ちください。',
    },
    publishedAt: '2026-06-12T12:00:00',
  },
];
