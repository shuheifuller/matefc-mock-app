import { AppHeader } from '../../components/AppHeader';
import { Badge, Button, Card } from '../../components/primitives';
import { useI18n } from '../../i18n/I18nContext';
import { useParent } from './useParent';
import { formatAUD, formatDate } from '../../lib/format';
import type { InvoiceStatus } from '../../types/domain';
import s from '../screen.module.css';

const STATUS_COLOR: Record<InvoiceStatus, string> = {
  paid: 'var(--mfc-success)',
  due: 'var(--mfc-warn)',
  upcoming: 'var(--mfc-muted)',
  overdue: 'var(--mfc-error)',
};

export function BillingScreen() {
  const { t, lang, tl } = useI18n();
  const { family, data } = useParent();

  const statusLabel: Record<InvoiceStatus, string> = {
    paid: t('billing.paid'),
    due: t('billing.due'),
    upcoming: t('billing.upcoming'),
    overdue: t('billing.overdue'),
  };

  const invoices = data.invoices
    .filter((i) => i.familyId === family.id)
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  return (
    <>
      <AppHeader title={t('billing.title')} bellTo="/parent/notifications">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 'var(--r-md)',
            padding: '10px 14px',
            color: '#fff',
          }}
        >
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{t('billing.autopay')}</div>
            <div style={{ fontWeight: 700 }}>{family.autopayEnabled ? 'ON · 10th' : 'OFF'}</div>
          </div>
          <button
            onClick={() => data.toggleAutopay(family.id)}
            style={{
              width: 50,
              height: 28,
              borderRadius: 999,
              border: 'none',
              background: family.autopayEnabled ? 'var(--mfc-success)' : 'rgba(255,255,255,0.3)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: family.autopayEnabled ? 25 : 3,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.15s',
              }}
            />
          </button>
        </div>
      </AppHeader>

      <div className={s.page}>
        {family.activeKidsVoucher?.applied && (
          <div className={s.banner} style={{ background: 'var(--mfc-success-bg)', color: '#166534' }}>
            🎟️ {t('billing.voucher')} · {formatAUD(family.activeKidsVoucher.amount)}
          </div>
        )}

        {invoices.map((inv) => (
          <Card key={inv.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 15.5 }}>{tl(inv.periodLabel)}</div>
              <Badge color={STATUS_COLOR[inv.status]} outline={inv.status !== 'paid'}>
                {statusLabel[inv.status]}
              </Badge>
            </div>
            <div style={{ margin: '10px 0' }}>
              {inv.lineItems.map((li, i) => (
                <div key={i} className={s.kv} style={{ padding: '3px 0', fontSize: 13.5 }}>
                  <span>{tl(li.label)}</span>
                  <span style={{ color: li.amount < 0 ? 'var(--mfc-success)' : undefined }}>
                    {li.amount < 0 ? '−' : ''}{formatAUD(Math.abs(li.amount))}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: 'var(--mfc-border)', margin: '4px 0 8px' }} />
            <div className={s.kv}>
              <span style={{ fontWeight: 700 }}>{t('billing.total')}</span>
              <span style={{ fontWeight: 800, fontSize: 16 }}>{formatAUD(inv.total)}</span>
            </div>
            <div className={s.muted} style={{ marginTop: 4 }}>
              {inv.status === 'paid' && inv.paidVia
                ? `${t('billing.paidVia')}: ${inv.paidVia === 'direct_debit' ? t('billing.directDebit') : t('billing.card')}`
                : `${t('billing.dueOn')} ${formatDate(inv.dueDate, lang)}`}
            </div>
            {(inv.status === 'due' || inv.status === 'overdue') && (
              <div style={{ marginTop: 12 }}>
                <Button block variant={inv.status === 'overdue' ? 'navy' : 'primary'}>
                  {t('billing.payNow')} · {formatAUD(inv.total)}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
