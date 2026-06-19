# MateFC — Soccer School Mock App

A bilingual (English / 日本語), blue-themed **mock mobile app** for the MateFC soccer
school, presented as a phone-framed web app. Modeled on the iClassPro and Jackrabbit
parent-portal apps, with two role flows (Parents/Students and Coach/Admin).

## Live URLs

- **Beta (Cloudflare Pages):** https://matefc-beta.pages.dev — official-looking pre-production environment (carries a **BETA** badge).
- GitHub Pages: https://shuheifuller.github.io/matefc-mock-app/ — same app.

Both serve the same build. To redeploy the beta URL after changes: `npm run deploy:beta`
(requires Cloudflare auth via `npx wrangler login`). The `BETA` badge is controlled by the
`VITE_ENV_LABEL` build-time variable.

> All data is static mock data held in React state — there is no backend. Mutations
> (enrolling, converting a trial, marking attendance, posting news) persist in memory
> for the session and reset on refresh.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks + production bundle
```

Open the app, then on the **sign-in screen** choose a parent family or sign in as the
coach. Use the globe button (EN / 日本) in any header to switch language.

## Key features

### Membership categorization (the core differentiator)
Every student belongs to exactly one `MembershipCategory`, grouped into three
sections that render distinctly throughout the UI:

| Group | Categories | Treatment |
|-------|-----------|-----------|
| **Regular** | Casual · Once-a-week · Twice-a-week · Unlimited | Standard blue badges, per-plan pricing |
| **Academy** | Academy Course | Amber badge, its own section, special lessons + weekend matches, priced separately |
| **Trial** | Trial member | Green badge, trial date tracked, **Convert-to-membership** flow |

The single source of truth is `src/lib/membership.ts` (label, group, pricing, rules,
badge color per category).

### Parent / Student portal
Dashboard (payment-due, next session, students, birthdays, news) · Students grouped by
category · Student detail (plan, Academy/Trial banners, 心/技/体 skill bars, attendance,
make-up tokens) · Browse & enroll classes/camps · Enroll / convert-trial flow · Weekly
schedule (incl. weather-cancelled sessions) · Attendance & make-up tokens · Progress ·
Billing (invoices, autopay, Active Kids voucher, overdue) · News feed · Notifications ·
Profile (language, venues & plans reference).

### Coach / Admin
Today dashboard (member counts by Regular/Academy/Trial, sessions) · Roster with
category/venue filters · Member detail · Session attendance marking + weather-cancel ·
Trials list with convert-to-plan · Skill entry (心/技/体, 1–5 + feedback) · Announcements
composer (posts to the shared news feed & notifications).

## Stack & structure

Vite · React · TypeScript · React Router · CSS Modules — no UI or i18n libraries.

```
src/
  components/   PhoneFrame, AppHeader, BottomTabBar, primitives, NewsCard, …
  context/      SessionContext (role/login), DataContext (state + mutators)
  data/         mock seed: venues, coaches, plans, families, classes, sessions, …
  i18n/         strings dictionary + I18nContext (t() for chrome, tl() for data)
  lib/          membership meta, formatters, selectors
  screens/      auth · parent/* · coach/*
  theme/        tokens.css (blue palette)
  types/        domain.ts (all interfaces + enums)
```

## Demo data highlights
- **Tanaka** — two students (Unlimited + Twice-weekly), Japanese UI, autopay on
- **Smith** — Once-weekly, **overdue** invoice, autopay off
- **Nguyen** — **Academy** + Casual, Active Kids voucher applied
- **Lee** — **Trial** member (try the convert flow in Coach → Trials)
- **Brown** — birthday this week (drives the dashboard birthday card)
