import {
  MembershipCategory,
  MembershipGroup,
  type MembershipCategoryMeta,
} from '../types/domain';

// Single source of truth for everything category-specific: label, group,
// pricing, rules, and badge color. Screens read from here so Academy and Trial
// render as their own sections/badges rather than ordinary plan rows.
export const MEMBERSHIP_META: Record<MembershipCategory, MembershipCategoryMeta> = {
  [MembershipCategory.RegularCasual]: {
    category: MembershipCategory.RegularCasual,
    group: MembershipGroup.Regular,
    label: { en: 'Casual', ja: 'カジュアル' },
    short: { en: 'Casual', ja: 'カジュアル' },
    badgeColor: 'var(--mfc-cat-casual)',
    perSessionPrice: { member: 30, nonMember: 40 },
    sessionsPerWeek: 0,
    rules: [
      { en: 'Pay per session, no monthly commitment', ja: '都度払い・月会費なし' },
      { en: '$30 / session for members, $40 for non-members', ja: '1回 会員$30 / 非会員$40' },
      { en: 'Book any class subject to availability', ja: '空き状況に応じて予約可能' },
    ],
  },
  [MembershipCategory.RegularOnceWeekly]: {
    category: MembershipCategory.RegularOnceWeekly,
    group: MembershipGroup.Regular,
    label: { en: 'Once a Week', ja: '週1回' },
    short: { en: '1×/wk', ja: '週1' },
    badgeColor: 'var(--mfc-cat-once)',
    monthlyPrice: 130,
    sessionsPerWeek: 1,
    rules: [
      { en: '1 session per week', ja: '週1回のレッスン' },
      { en: '$130 / month (Feb–Nov)', ja: '月額 $130（2〜11月）' },
      { en: '4 make-up sessions per year + weather make-ups', ja: '振替 年4回＋天候中止分' },
    ],
  },
  [MembershipCategory.RegularTwiceWeekly]: {
    category: MembershipCategory.RegularTwiceWeekly,
    group: MembershipGroup.Regular,
    label: { en: 'Twice a Week', ja: '週2回' },
    short: { en: '2×/wk', ja: '週2' },
    badgeColor: 'var(--mfc-cat-twice)',
    monthlyPrice: 180,
    sessionsPerWeek: 2,
    rules: [
      { en: '2 sessions per week', ja: '週2回のレッスン' },
      { en: '$180 / month (Feb–Nov)', ja: '月額 $180（2〜11月）' },
      { en: '4 make-up sessions per year + weather make-ups', ja: '振替 年4回＋天候中止分' },
    ],
  },
  [MembershipCategory.RegularUnlimited]: {
    category: MembershipCategory.RegularUnlimited,
    group: MembershipGroup.Regular,
    label: { en: 'Unlimited', ja: '通い放題' },
    short: { en: 'Unlimited', ja: '放題' },
    badgeColor: 'var(--mfc-cat-unlimited)',
    monthlyPrice: 230,
    sessionsPerWeek: 'unlimited',
    rules: [
      { en: 'Attend any session, any venue, any day', ja: 'どの会場・曜日でも参加し放題' },
      { en: '$230 / month (Feb–Nov)', ja: '月額 $230（2〜11月）' },
      { en: 'Best value for committed players', ja: '本気で取り組む選手に最適' },
    ],
  },
  [MembershipCategory.Academy]: {
    category: MembershipCategory.Academy,
    group: MembershipGroup.Academy,
    label: { en: 'Academy Course', ja: 'アカデミーコース' },
    short: { en: 'Academy', ja: 'アカデミー' },
    badgeColor: 'var(--mfc-cat-academy)',
    badgeBg: 'var(--mfc-cat-academy-bg)',
    monthlyPrice: 280,
    sessionsPerWeek: 2,
    rules: [
      { en: 'Selective, high-performance pathway', ja: '選抜制のハイパフォーマンス・コース' },
      { en: 'Special technical & tactical lessons', ja: '特別な技術・戦術レッスン' },
      { en: 'Weekend competitive matches included', ja: '週末の公式マッチを含む' },
      { en: 'Separate from regular lesson membership', ja: '通常レッスン会員とは別カテゴリー' },
    ],
  },
  [MembershipCategory.Trial]: {
    category: MembershipCategory.Trial,
    group: MembershipGroup.Trial,
    label: { en: 'Trial Member', ja: '体験メンバー' },
    short: { en: 'Trial', ja: '体験' },
    badgeColor: 'var(--mfc-cat-trial)',
    rules: [
      { en: 'Join one session to try before enrolling', ja: '入会前に1回体験参加' },
      { en: 'No monthly fee during trial', ja: '体験期間中の月会費なし' },
      { en: 'Convert to any plan to become a member', ja: 'プランを選んで会員に移行可能' },
    ],
  },
};

export function metaFor(category: MembershipCategory): MembershipCategoryMeta {
  return MEMBERSHIP_META[category];
}

export function groupOf(category: MembershipCategory): MembershipGroup {
  return MEMBERSHIP_META[category].group;
}

/** Categories a trial member can convert into (regular plans + academy). */
export const CONVERTIBLE_CATEGORIES: MembershipCategory[] = [
  MembershipCategory.RegularOnceWeekly,
  MembershipCategory.RegularTwiceWeekly,
  MembershipCategory.RegularUnlimited,
  MembershipCategory.RegularCasual,
  MembershipCategory.Academy,
];

export const GROUP_ORDER: MembershipGroup[] = [
  MembershipGroup.Regular,
  MembershipGroup.Academy,
  MembershipGroup.Trial,
];

export const GROUP_LABEL: Record<MembershipGroup, { en: string; ja: string }> = {
  [MembershipGroup.Regular]: { en: 'Regular Members', ja: '通常会員' },
  [MembershipGroup.Academy]: { en: 'Academy Course', ja: 'アカデミーコース' },
  [MembershipGroup.Trial]: { en: 'Trial Members', ja: '体験メンバー' },
};
