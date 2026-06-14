import {
  MembershipCategory,
  type Enrollment,
  type Family,
  type Student,
} from '../types/domain';

// Generated mock roster so each lesson has a realistic 25–30 attendants on the
// coach/admin screens. These students are NOT login-reachable — the five demo
// families in families.ts remain the only sign-in accounts.

const FIRST = [
  'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Lucas', 'Henry', 'Leo', 'Jack',
  'Ethan', 'Mason', 'Charlie', 'Aiden', 'Hugo', 'Max', 'Felix', 'Theo', 'Arlo', 'Eli',
  'Riley', 'Hudson', 'Archer', 'Sebastian', 'Levi', 'Isaac', 'Harvey', 'George', 'Oscar',
  'Sora', 'Haru', 'Ren', 'Yuto', 'Riku', 'Kaito', 'Mei', 'Hana', 'Yuki', 'Aoi', 'Sakura',
  'Mia', 'Ava', 'Chloe', 'Ella', 'Grace', 'Zoe', 'Ruby', 'Isla', 'Amelia', 'Olivia',
];
const LAST = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Lee', 'Nguyen', 'Chen', 'Wang',
  'Kim', 'Park', 'Tanaka', 'Sato', 'Suzuki', 'Ito', 'Yamamoto', 'Anderson', 'Thompson', 'Walker',
  'Wright', 'Robinson', 'Patel', 'Singh', 'Murphy', 'Kelly', 'Ryan', 'Martin', 'Clarke', 'Hall',
  'Young', 'King', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Cooper', 'Reed', 'Bell',
];
const PARENT_FIRST = [
  'Sarah', 'David', 'Emma', 'Michael', 'Jessica', 'Daniel', 'Laura', 'Kenji', 'Aiko', 'Hiroshi',
  'Linh', 'Wei', 'Priya', 'Raj', 'Aoife', 'Sean', 'Kate', 'Paul', 'Mei', 'Takashi',
];
const AVATAR = [
  '#0a1f44', '#2563eb', '#60a5fa', '#16a34a', '#d4a017', '#8b5cf6', '#f97316', '#0891b2', '#db2777', '#0d9488',
];

const REGULAR_CYCLE: MembershipCategory[] = [
  MembershipCategory.RegularOnceWeekly,
  MembershipCategory.RegularTwiceWeekly,
  MembershipCategory.RegularOnceWeekly,
  MembershipCategory.RegularUnlimited,
  MembershipCategory.RegularTwiceWeekly,
  MembershipCategory.RegularOnceWeekly,
  MembershipCategory.RegularCasual,
  MembershipCategory.RegularOnceWeekly,
  MembershipCategory.RegularTwiceWeekly,
  MembershipCategory.RegularUnlimited,
  MembershipCategory.RegularOnceWeekly,
  MembershipCategory.RegularTwiceWeekly,
];

const PLAN_FOR: Partial<Record<MembershipCategory, string>> = {
  [MembershipCategory.RegularCasual]: 'plan_casual',
  [MembershipCategory.RegularOnceWeekly]: 'plan_once',
  [MembershipCategory.RegularTwiceWeekly]: 'plan_twice',
  [MembershipCategory.RegularUnlimited]: 'plan_unlimited',
  [MembershipCategory.Academy]: 'plan_academy',
};

interface ClassSpec {
  classId: string;
  venueId: string;
  add: number; // additional students to generate for this class
  ageMin: number;
  ageMax: number;
  academy?: boolean;
  alsoClassId?: string; // second class these students also attend
}

// Existing demo enrollments per class are small; `add` tops each up to ~25–30.
const SPECS: ClassSpec[] = [
  { classId: 'cls_chatswood_mon', venueId: 'v_chatswood', add: 26, ageMin: 4, ageMax: 14 },
  { classId: 'cls_mowbray_tue', venueId: 'v_mowbray', add: 26, ageMin: 6, ageMax: 12 },
  { classId: 'cls_naremburn_wed', venueId: 'v_naremburn', add: 27, ageMin: 4, ageMax: 15 },
  { classId: 'cls_naremburn_fri', venueId: 'v_naremburn', add: 26, ageMin: 4, ageMax: 15 },
  { classId: 'cls_wentworth_sat', venueId: 'v_wentworth', add: 27, ageMin: 4, ageMax: 12 },
  { classId: 'cls_academy_sat', venueId: 'v_wentworth', add: 16, ageMin: 8, ageMax: 14, academy: true, alsoClassId: 'cls_academy_mon' },
];

const pad = (n: number) => String(n).padStart(2, '0');

const rosterStudents: Student[] = [];
const rosterFamilies: Family[] = [];
const rosterEnrollments: Enrollment[] = [];

let n = 0;
for (const spec of SPECS) {
  for (let k = 0; k < spec.add; k++) {
    n += 1;
    const first = FIRST[(n * 3) % FIRST.length];
    const last = LAST[(n * 7) % LAST.length];
    const parent = PARENT_FIRST[n % PARENT_FIRST.length];

    // A sprinkling of trial members in the regular classes.
    const isTrial = !spec.academy && n % 25 === 0;
    const category = spec.academy
      ? MembershipCategory.Academy
      : isTrial
        ? MembershipCategory.Trial
        : REGULAR_CYCLE[k % REGULAR_CYCLE.length];

    const age = spec.ageMin + (n % (spec.ageMax - spec.ageMin + 1));
    const dob = `${2026 - age}-${pad((n % 12) + 1)}-${pad((n % 27) + 1)}`;

    const studentId = `rs_${n}`;
    const familyId = `rf_${n}`;

    rosterFamilies.push({
      id: familyId,
      familyName: last,
      primaryContact: {
        name: `${parent} ${last}`,
        email: `${first}.${last}@example.com`.toLowerCase(),
        phone: `+61 4${pad((n % 90) + 10)} ${pad((n * 13) % 100)} ${pad((n * 7) % 100)}`,
      },
      studentIds: [studentId],
      autopayEnabled: n % 3 !== 0,
      preferredLang: 'en',
    });

    rosterStudents.push({
      id: studentId,
      familyId,
      firstName: first,
      lastName: last,
      dob,
      category,
      planId: PLAN_FOR[category],
      homeVenueId: spec.venueId,
      enrolledSince: isTrial ? undefined : '2025-02-10',
      avatarColor: AVATAR[n % AVATAR.length],
      trial: isTrial
        ? { trialDate: '2026-06-22', trialClassId: spec.classId, status: 'scheduled' }
        : undefined,
    });

    rosterEnrollments.push({
      id: `re_${n}`,
      studentId,
      classId: spec.classId,
      startDate: '2025-02-10',
      status: isTrial ? 'trial' : 'active',
    });

    // Academy members also attend the Monday special-lesson class.
    if (spec.alsoClassId) {
      rosterEnrollments.push({
        id: `re_${n}b`,
        studentId,
        classId: spec.alsoClassId,
        startDate: '2025-02-10',
        status: 'active',
      });
    }
  }
}

export { rosterStudents, rosterFamilies, rosterEnrollments };
