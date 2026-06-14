import { MembershipCategory, type Family, type Student } from '../types/domain';

export const families: Family[] = [
  {
    id: 'fam_tanaka',
    familyName: 'Tanaka',
    primaryContact: { name: 'Mika Tanaka', email: 'mika.tanaka@example.com', phone: '+61 412 100 200' },
    studentIds: ['st_tanaka_a', 'st_tanaka_b'],
    autopayEnabled: true,
    preferredLang: 'ja',
  },
  {
    id: 'fam_smith',
    familyName: 'Smith',
    primaryContact: { name: 'James Smith', email: 'james.smith@example.com', phone: '+61 413 222 333' },
    studentIds: ['st_smith'],
    autopayEnabled: false,
    preferredLang: 'en',
  },
  {
    id: 'fam_nguyen',
    familyName: 'Nguyen',
    primaryContact: { name: 'Linh Nguyen', email: 'linh.nguyen@example.com', phone: '+61 414 333 444' },
    studentIds: ['st_nguyen_a', 'st_nguyen_b'],
    autopayEnabled: true,
    activeKidsVoucher: { applied: true, amount: 50 },
    preferredLang: 'en',
  },
  {
    id: 'fam_lee',
    familyName: 'Lee',
    primaryContact: { name: 'Soo-jin Lee', email: 'soojin.lee@example.com', phone: '+61 415 444 555' },
    studentIds: ['st_lee'],
    autopayEnabled: false,
    preferredLang: 'en',
  },
  {
    id: 'fam_brown',
    familyName: 'Brown',
    primaryContact: { name: 'Emma Brown', email: 'emma.brown@example.com', phone: '+61 416 555 666' },
    studentIds: ['st_brown'],
    autopayEnabled: true,
    preferredLang: 'en',
  },
];

export const students: Student[] = [
  {
    id: 'st_tanaka_a',
    familyId: 'fam_tanaka',
    firstName: 'Sora',
    lastName: 'Tanaka',
    dob: '2013-04-12', // ~13
    category: MembershipCategory.RegularUnlimited,
    planId: 'plan_unlimited',
    homeVenueId: 'v_chatswood',
    enrolledSince: '2024-02-05',
    avatarColor: '#0a1f44',
  },
  {
    id: 'st_tanaka_b',
    familyId: 'fam_tanaka',
    firstName: 'Hina',
    lastName: 'Tanaka',
    dob: '2017-09-02', // ~8
    category: MembershipCategory.RegularTwiceWeekly,
    planId: 'plan_twice',
    homeVenueId: 'v_naremburn',
    enrolledSince: '2025-02-10',
    avatarColor: '#2563eb',
  },
  {
    id: 'st_smith',
    familyId: 'fam_smith',
    firstName: 'Oliver',
    lastName: 'Smith',
    dob: '2016-11-20', // ~9
    category: MembershipCategory.RegularOnceWeekly,
    planId: 'plan_once',
    homeVenueId: 'v_mowbray',
    enrolledSince: '2026-03-03',
    avatarColor: '#60a5fa',
  },
  {
    id: 'st_nguyen_a',
    familyId: 'fam_nguyen',
    firstName: 'Kai',
    lastName: 'Nguyen',
    dob: '2012-07-30', // ~13
    category: MembershipCategory.Academy,
    planId: 'plan_academy',
    homeVenueId: 'v_wentworth',
    enrolledSince: '2024-08-17',
    avatarColor: '#d4a017',
  },
  {
    id: 'st_nguyen_b',
    familyId: 'fam_nguyen',
    firstName: 'Mia',
    lastName: 'Nguyen',
    dob: '2018-01-15', // ~8
    category: MembershipCategory.RegularCasual,
    planId: 'plan_casual',
    homeVenueId: 'v_wentworth',
    enrolledSince: '2025-10-04',
    avatarColor: '#16a34a',
  },
  {
    id: 'st_lee',
    familyId: 'fam_lee',
    firstName: 'Min',
    lastName: 'Lee',
    dob: '2017-05-22', // ~9
    category: MembershipCategory.Trial,
    homeVenueId: 'v_chatswood',
    trial: {
      trialDate: '2026-06-22',
      trialClassId: 'cls_chatswood_mon',
      status: 'scheduled',
    },
    avatarColor: '#0891b2',
  },
  {
    id: 'st_brown',
    familyId: 'fam_brown',
    firstName: 'Lucas',
    lastName: 'Brown',
    dob: '2017-06-18', // birthday this week (today 2026-06-14)
    category: MembershipCategory.RegularOnceWeekly,
    planId: 'plan_once',
    homeVenueId: 'v_naremburn',
    enrolledSince: '2025-02-14',
    avatarColor: '#8b5cf6',
  },
];

export const studentById = (id?: string) => students.find((s) => s.id === id);
export const familyById = (id?: string) => families.find((f) => f.id === id);
