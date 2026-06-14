import type { Invoice } from '../types/domain';

export const invoices: Invoice[] = [
  // Tanaka — two students, autopay on
  {
    id: 'inv_tanaka_jun',
    familyId: 'fam_tanaka',
    periodLabel: { en: 'June 2026', ja: '2026年6月' },
    lineItems: [
      { label: { en: 'Sora — Unlimited', ja: 'ソラ — 通い放題' }, amount: 230 },
      { label: { en: 'Hina — Twice a Week', ja: 'ヒナ — 週2回' }, amount: 180 },
    ],
    total: 410,
    currency: 'AUD',
    dueDate: '2026-06-10',
    status: 'paid',
    paidVia: 'direct_debit',
  },
  {
    id: 'inv_tanaka_jul',
    familyId: 'fam_tanaka',
    periodLabel: { en: 'July 2026', ja: '2026年7月' },
    lineItems: [
      { label: { en: 'Sora — Unlimited', ja: 'ソラ — 通い放題' }, amount: 230 },
      { label: { en: 'Hina — Twice a Week', ja: 'ヒナ — 週2回' }, amount: 180 },
    ],
    total: 410,
    currency: 'AUD',
    dueDate: '2026-07-10',
    status: 'upcoming',
  },
  // Smith — autopay off, overdue
  {
    id: 'inv_smith_jun',
    familyId: 'fam_smith',
    periodLabel: { en: 'June 2026', ja: '2026年6月' },
    lineItems: [{ label: { en: 'Oliver — Once a Week', ja: 'オリバー — 週1回' }, amount: 130 }],
    total: 130,
    currency: 'AUD',
    dueDate: '2026-06-10',
    status: 'overdue',
  },
  // Nguyen — Academy + casual, Active Kids voucher applied
  {
    id: 'inv_nguyen_jun',
    familyId: 'fam_nguyen',
    periodLabel: { en: 'June 2026', ja: '2026年6月' },
    lineItems: [
      { label: { en: 'Kai — Academy Course', ja: 'カイ — アカデミーコース' }, amount: 280 },
      { label: { en: 'Mia — Casual (2 sessions)', ja: 'ミア — カジュアル（2回）' }, amount: 60 },
      { label: { en: 'Active Kids Voucher', ja: 'Active Kids バウチャー' }, amount: -50 },
    ],
    total: 290,
    currency: 'AUD',
    dueDate: '2026-06-18',
    status: 'due',
  },
  // Brown — paid
  {
    id: 'inv_brown_jun',
    familyId: 'fam_brown',
    periodLabel: { en: 'June 2026', ja: '2026年6月' },
    lineItems: [{ label: { en: 'Lucas — Once a Week', ja: 'ルーカス — 週1回' }, amount: 130 }],
    total: 130,
    currency: 'AUD',
    dueDate: '2026-06-10',
    status: 'paid',
    paidVia: 'direct_debit',
  },
];

export const invoicesForFamily = (familyId: string) =>
  invoices.filter((i) => i.familyId === familyId);
