import { NewsCategory, type NewsItem } from '../types/domain';
import { useI18n } from '../i18n/I18nContext';
import { relativeTime } from '../lib/format';
import { IconPin } from './Icons';
import s from './feed.module.css';

const CAT_META: Record<NewsCategory, { color: string; en: string; ja: string }> = {
  [NewsCategory.Camp]: { color: 'var(--mfc-cat-academy)', en: 'Camp', ja: 'キャンプ' },
  [NewsCategory.NewClass]: { color: 'var(--mfc-blue)', en: 'New Class', ja: '新クラス' },
  [NewsCategory.Announcement]: { color: 'var(--mfc-navy)', en: 'Announcement', ja: 'お知らせ' },
  [NewsCategory.Event]: { color: 'var(--mfc-pillar-body)', en: 'Event', ja: 'イベント' },
};

export function NewsCard({
  item,
  expanded,
  onClick,
}: {
  item: NewsItem;
  expanded?: boolean;
  onClick?: () => void;
}) {
  const { lang, tl } = useI18n();
  const cat = CAT_META[item.category];
  return (
    <button className={s.news} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={s.newsAccent} style={{ background: cat.color }} />
      <div className={s.newsBody}>
        <div className={s.newsTop}>
          <span className={s.newsCat} style={{ color: cat.color }}>
            {lang === 'en' ? cat.en : cat.ja}
          </span>
          {item.pinned && (
            <span className={s.pinned}>
              <IconPin size={12} color="var(--mfc-warn)" />
            </span>
          )}
          <span className={s.newsTime}>{relativeTime(item.publishedAt, lang)}</span>
        </div>
        <div className={s.newsTitle}>{tl(item.title)}</div>
        <div className={`${s.newsText} ${expanded ? '' : s.clamp2}`}>{tl(item.body)}</div>
      </div>
    </button>
  );
}
