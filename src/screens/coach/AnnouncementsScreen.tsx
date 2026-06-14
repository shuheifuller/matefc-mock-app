import { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { Button, Card } from '../../components/primitives';
import { IconCheck } from '../../components/Icons';
import { NewsCard } from '../../components/NewsCard';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { NewsCategory } from '../../types/domain';
import s from '../screen.module.css';

export function AnnouncementsScreen() {
  const { t, lang } = useI18n();
  const data = useData();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NewsCategory>(NewsCategory.Announcement);
  const [posted, setPosted] = useState(false);

  const cats: { value: NewsCategory; label: string }[] = [
    { value: NewsCategory.Announcement, label: lang === 'en' ? 'News' : 'お知らせ' },
    { value: NewsCategory.Camp, label: lang === 'en' ? 'Camp' : 'キャンプ' },
    { value: NewsCategory.NewClass, label: lang === 'en' ? 'New Class' : '新クラス' },
    { value: NewsCategory.Event, label: lang === 'en' ? 'Event' : 'イベント' },
  ];

  const publish = () => {
    if (!title.trim() || !body.trim()) return;
    data.postNews(title.trim(), body.trim(), category, lang);
    setTitle('');
    setBody('');
    setPosted(true);
  };

  const inputStyle = {
    width: '100%',
    border: '1.5px solid var(--mfc-border)',
    borderRadius: 'var(--r-md)',
    padding: 12,
    fontSize: 14,
  } as const;

  return (
    <>
      <AppHeader title={t('coach.announce')} showLang={false} />
      <div className={s.page}>
        {posted && (
          <div className={s.banner} style={{ background: 'var(--mfc-success-bg)', color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconCheck size={18} color="var(--mfc-success)" /> {t('coach.published')}
          </div>
        )}

        <Card>
          <div className={s.label}>{t('coach.newPost')}</div>
          <div className={s.stackSm} style={{ marginTop: 8 }}>
            <div className={s.chipRow}>
              {cats.map((c) => (
                <button
                  key={c.value}
                  className={`${s.chip} ${category === c.value ? s.chipActive : ''}`}
                  onClick={() => setCategory(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('coach.postTitle')}
              style={inputStyle}
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('coach.postBody')}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <Button block variant="navy" disabled={!title.trim() || !body.trim()} onClick={publish}>
              {t('coach.publish')}
            </Button>
          </div>
        </Card>

        <div className={s.label}>{t('dash.news')}</div>
        <div className={s.stack}>
          {data.news.slice(0, 4).map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      </div>
    </>
  );
}
