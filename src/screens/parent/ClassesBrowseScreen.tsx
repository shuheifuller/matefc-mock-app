import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { Badge, Button, Card, SegmentedControl } from '../../components/primitives';
import { IconClock, IconStar } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { ClassKind, type ClassOffering } from '../../types/domain';
import { venueById } from '../../data/venues';
import { coachById } from '../../data/coaches';
import { formatAUD, weekdayLabel } from '../../lib/format';
import s from '../screen.module.css';

type Tab = 'regular' | 'academy' | 'camp';

export function ClassesBrowseScreen() {
  const { t, lang, tl } = useI18n();
  const { data } = useParent();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('regular');

  const filter: Record<Tab, ClassKind> = {
    regular: ClassKind.Regular,
    academy: ClassKind.Academy,
    camp: ClassKind.Camp,
  };
  const list = data.classes.filter((c) => c.kind === filter[tab]);

  return (
    <>
      <AppHeader title={t('classes.title')} bellTo="/parent/notifications">
        <SegmentedControl<Tab>
          full
          value={tab}
          onChange={setTab}
          options={[
            { value: 'regular', label: t('classes.regular') },
            { value: 'academy', label: t('classes.academy') },
            { value: 'camp', label: t('classes.camp') },
          ]}
        />
      </AppHeader>

      <div className={s.page}>
        {list.map((c) => (
          <ClassCard key={c.id} c={c} onEnroll={() => nav('/parent/enroll')} />
        ))}
      </div>
    </>
  );

  function ClassCard({ c, onEnroll }: { c: ClassOffering; onEnroll: () => void }) {
    const venue = venueById(c.venueId);
    const spots = c.capacity - c.enrolledCount;
    const isAcademy = c.kind === ClassKind.Academy;
    const isCamp = c.kind === ClassKind.Camp;

    return (
      <Card style={isAcademy ? { borderLeft: '4px solid var(--mfc-cat-academy)' } : undefined}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 15.5, flex: 1 }}>{tl(c.title)}</div>
          {isAcademy && (
            <Badge color="var(--mfc-cat-academy)" bg="var(--mfc-cat-academy-bg)">
              <IconStar size={11} color="var(--mfc-cat-academy)" /> {t('classes.academy')}
            </Badge>
          )}
        </div>

        <div className={s.muted} style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <IconClock size={14} color="var(--mfc-muted)" />
          {isCamp
            ? `${c.campDates?.length} ${t('classes.campDays')} · ${c.startTime}`
            : `${c.weekday ? weekdayLabel(c.weekday, lang) : ''} · ${c.startTime} · ${c.durationMin}min`}
        </div>
        <div className={s.muted} style={{ marginTop: 2 }}>
          {venue?.name} · {t('classes.ages')} {c.ageRange.min}–{c.ageRange.max}
        </div>
        <div className={s.muted} style={{ marginTop: 2 }}>
          {t('classes.coachLabel')}: {c.coachIds.map((id) => coachById(id)?.name).filter(Boolean).join(', ')}
        </div>
        {isAcademy && c.hasWeekendMatch && (
          <div style={{ marginTop: 6, fontSize: 12.5, fontWeight: 700, color: 'var(--mfc-cat-academy)' }}>
            🏆 {t('classes.weekendMatch')}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div>
            {isCamp && c.campPricing ? (
              <span style={{ fontWeight: 800, color: 'var(--mfc-blue)' }}>
                {t('common.from')} {formatAUD(c.campPricing.oneDay)}
              </span>
            ) : (
              <span style={{ fontSize: 12.5, fontWeight: 700, color: spots > 0 ? 'var(--mfc-success)' : 'var(--mfc-error)' }}>
                {spots > 0 ? `${spots} ${t('common.spotsLeft')}` : t('common.full')}
              </span>
            )}
          </div>
          <Button sm variant={isAcademy ? 'navy' : 'primary'} onClick={onEnroll} disabled={spots <= 0 && !isCamp}>
            {t('classes.enrollNow')}
          </Button>
        </div>
      </Card>
    );
  }
}
