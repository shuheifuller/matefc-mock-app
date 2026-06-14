import { MembershipCategory, type LessonPlan } from '../types/domain';
import { MEMBERSHIP_META } from '../lib/membership';

const makeup = { personalPerYear: 4, weather: 'unlimited' as const };

export const plans: LessonPlan[] = [
  {
    id: 'plan_casual',
    category: MembershipCategory.RegularCasual,
    name: MEMBERSHIP_META[MembershipCategory.RegularCasual].label,
    enrollmentFee: 0,
    description: {
      en: 'Drop in and pay per session — no monthly commitment.',
      ja: '都度参加・都度払い。月会費はありません。',
    },
    rules: MEMBERSHIP_META[MembershipCategory.RegularCasual].rules,
  },
  {
    id: 'plan_once',
    category: MembershipCategory.RegularOnceWeekly,
    name: MEMBERSHIP_META[MembershipCategory.RegularOnceWeekly].label,
    monthlyPrice: 130,
    enrollmentFee: 50,
    directDebitDayOfMonth: 10,
    description: { en: 'One session each week at your home venue.', ja: 'ホーム会場で週1回のレッスン。' },
    rules: MEMBERSHIP_META[MembershipCategory.RegularOnceWeekly].rules,
    makeupAllowance: makeup,
  },
  {
    id: 'plan_twice',
    category: MembershipCategory.RegularTwiceWeekly,
    name: MEMBERSHIP_META[MembershipCategory.RegularTwiceWeekly].label,
    monthlyPrice: 180,
    enrollmentFee: 50,
    directDebitDayOfMonth: 10,
    description: { en: 'Two sessions each week to accelerate development.', ja: '週2回で着実にレベルアップ。' },
    rules: MEMBERSHIP_META[MembershipCategory.RegularTwiceWeekly].rules,
    makeupAllowance: makeup,
  },
  {
    id: 'plan_unlimited',
    category: MembershipCategory.RegularUnlimited,
    name: MEMBERSHIP_META[MembershipCategory.RegularUnlimited].label,
    monthlyPrice: 230,
    enrollmentFee: 50,
    directDebitDayOfMonth: 10,
    description: { en: 'Train as much as you like across all venues.', ja: '全会場で通い放題。' },
    rules: MEMBERSHIP_META[MembershipCategory.RegularUnlimited].rules,
    makeupAllowance: makeup,
  },
  {
    id: 'plan_academy',
    category: MembershipCategory.Academy,
    name: MEMBERSHIP_META[MembershipCategory.Academy].label,
    monthlyPrice: 280,
    enrollmentFee: 50,
    directDebitDayOfMonth: 10,
    description: {
      en: 'Selective high-performance pathway with weekend matches.',
      ja: '選抜制・週末マッチ付きのハイパフォーマンスコース。',
    },
    rules: MEMBERSHIP_META[MembershipCategory.Academy].rules,
    makeupAllowance: makeup,
  },
];

export const planById = (id?: string) => plans.find((p) => p.id === id);
export const planForCategory = (cat: MembershipCategory) =>
  plans.find((p) => p.category === cat);
