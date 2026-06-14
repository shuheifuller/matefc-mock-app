import { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { Card, EmptyState, SegmentedControl } from '../../components/primitives';
import { IconBack, IconChevron, IconClock } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { classIdsForStudents, weekSessions } from '../../lib/selectors';
import { classById } from '../../data/classes';
import { venueById } from '../../data/venues';
import { formatDate } from '../../lib/format';
import { TODAY } from '../../data';
import type { Lang, Session } from '../../types/domain';
import s from '../screen.module.css';
import cal from './schedule.module.css';

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WD_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WD_JA = ['日', '月', '火', '水', '木', '金', '土'];

const pad = (n: number) => String(n).padStart(2, '0');
const monthLabel = (y: number, m: number, lang: Lang) =>
  lang === 'ja' ? `${y}年${m}月` : `${MONTHS_EN[m - 1]} ${y}`;

export function ScheduleScreen() {
  const { t, lang, tl } = useI18n();
  const { students, data } = useParent();

  const [view, setView] = useState<'week' | 'month'>('week');
  const [cursor, setCursor] = useState(TODAY.slice(0, 7)); // 'YYYY-MM'
  const [selected, setSelected] = useState(TODAY);

  const classIds = classIdsForStudents(data.enrollments, students.map((st) => st.id));
  const famSessions = data.sessions.filter((se) => classIds.includes(se.classId));
  const sessionsOn = (iso: string) =>
    famSessions
      .filter((se) => se.date === iso)
      .sort((a, b) => (classById(a.classId)?.startTime ?? '').localeCompare(classById(b.classId)?.startTime ?? ''));

  return (
    <>
      <AppHeader title={t('schedule.title')} bellTo="/parent/notifications">
        <SegmentedControl<'week' | 'month'>
          full
          value={view}
          onChange={setView}
          options={[
            { value: 'week', label: t('schedule.week') },
            { value: 'month', label: t('schedule.month') },
          ]}
        />
      </AppHeader>

      <div className={s.page}>
        <div className={s.banner} style={{ background: 'var(--mfc-sky)', color: 'var(--mfc-navy)', fontWeight: 500 }}>
          ℹ️ {t('schedule.cancelNote')}
        </div>

        {view === 'week' ? (
          <WeekView />
        ) : (
          <MonthView />
        )}
      </div>
    </>
  );

  // ---- Week view (list grouped by date) ----
  function WeekView() {
    const sessions = weekSessions(famSessions);
    const byDate = new Map<string, Session[]>();
    for (const se of sessions) byDate.set(se.date, [...(byDate.get(se.date) ?? []), se]);

    if (byDate.size === 0) return <EmptyState text={t('schedule.noSessions')} />;

    return (
      <>
        {Array.from(byDate.entries()).map(([date, list]) => (
          <div key={date}>
            <div className={s.groupTitle}>{formatDate(date, lang)}</div>
            <SessionList list={list} />
          </div>
        ))}
      </>
    );
  }

  // ---- Month view (calendar grid + selected-day list) ----
  function MonthView() {
    const [cy, cm] = cursor.split('-').map(Number); // cm: 1–12
    const firstWeekday = new Date(cy, cm - 1, 1).getDay();
    const daysInMonth = new Date(cy, cm, 0).getDate();

    const cells: (number | null)[] = [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const shift = (delta: number) => {
      const d = new Date(cy, cm - 1 + delta, 1);
      setCursor(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
    };

    const dayList = sessionsOn(selected);
    const wd = lang === 'ja' ? WD_JA : WD_EN;

    return (
      <>
        <div className={cal.calCard}>
          <div className={cal.calHead}>
            <button className={cal.calNav} onClick={() => shift(-1)} aria-label="Previous month">
              <IconBack size={18} color="var(--mfc-navy)" />
            </button>
            <div className={cal.calMonth}>{monthLabel(cy, cm, lang)}</div>
            <button className={cal.calNav} onClick={() => shift(1)} aria-label="Next month">
              <IconChevron size={18} color="var(--mfc-navy)" />
            </button>
          </div>

          <div className={cal.calGrid}>
            {wd.map((d, i) => (
              <div key={i} className={cal.calWeekday}>{d}</div>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <div key={`b${i}`} className={`${cal.calDay} ${cal.calDayBlank}`} />;
              const iso = `${cy}-${pad(cm)}-${pad(day)}`;
              const daySessions = sessionsOn(iso);
              const isToday = iso === TODAY;
              const isSelected = iso === selected;
              const hasWeather = daySessions.some((se) => se.status === 'cancelled_weather');
              return (
                <button
                  key={iso}
                  className={`${cal.calDay} ${isToday ? cal.calDayToday : ''} ${isSelected ? cal.calDaySelected : ''}`}
                  onClick={() => setSelected(iso)}
                >
                  {day}
                  {daySessions.length > 0 && (
                    <span className={`${cal.calDot} ${hasWeather ? cal.calDotWeather : ''}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={cal.dayTitle}>{formatDate(selected, lang)}</div>
        {dayList.length === 0 ? (
          <EmptyState text={t('schedule.noSessionsDay')} />
        ) : (
          <SessionList list={dayList} />
        )}
      </>
    );
  }

  // ---- Shared session list ----
  function SessionList({ list }: { list: Session[] }) {
    return (
      <Card flush>
        {list.map((se) => {
          const cls = classById(se.classId);
          const venue = venueById(cls?.venueId);
          const cancelled = se.status === 'cancelled_weather';
          return (
            <div
              key={se.id}
              style={{
                display: 'flex',
                gap: 12,
                padding: '12px 16px',
                borderBottom: '1px solid var(--mfc-border)',
                opacity: cancelled ? 0.7 : 1,
              }}
            >
              <div style={{ width: 4, borderRadius: 2, background: cancelled ? 'var(--mfc-warn)' : 'var(--mfc-blue)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{cls && tl(cls.title)}</div>
                <div className={s.muted} style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <IconClock size={13} color="var(--mfc-muted)" />
                  {cls?.startTime} · {venue?.name}
                </div>
                {cancelled && (
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: 'var(--mfc-warn)' }}>
                    ⛈️ {t('schedule.weatherCancelled')} · {t('schedule.makeupAvailable')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    );
  }
}
