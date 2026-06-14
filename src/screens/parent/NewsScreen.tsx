import { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { NewsCard } from '../../components/NewsCard';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { NewsCategory } from '../../types/domain';
import s from '../screen.module.css';

type Filter = 'all' | NewsCategory;

export function NewsScreen() {
  const { t, lang } = useI18n();
  const { data } = useParent();
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const chips: { value: Filter; label: string }[] = [
    { value: 'all', label: t('news.all') },
    { value: NewsCategory.Camp, label: lang === 'en' ? 'Camp' : 'キャンプ' },
    { value: NewsCategory.NewClass, label: lang === 'en' ? 'New Class' : '新クラス' },
    { value: NewsCategory.Announcement, label: lang === 'en' ? 'News' : 'お知らせ' },
    { value: NewsCategory.Event, label: lang === 'en' ? 'Event' : 'イベント' },
  ];

  const items = [...data.news]
    .filter((n) => filter === 'all' || n.category === filter)
    .sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return Number(!!b.pinned) - Number(!!a.pinned);
      return b.publishedAt.localeCompare(a.publishedAt);
    });

  return (
    <>
      <AppHeader title={t('news.title')} showBack>
        <div className={s.chipRow}>
          {chips.map((c) => (
            <button
              key={c.value}
              className={`${s.chip} ${filter === c.value ? s.chipActive : ''}`}
              onClick={() => setFilter(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </AppHeader>

      <div className={s.page}>
        {items.map((n) => (
          <NewsCard
            key={n.id}
            item={n}
            expanded={openId === n.id}
            onClick={() => setOpenId(openId === n.id ? null : n.id)}
          />
        ))}
      </div>
    </>
  );
}
