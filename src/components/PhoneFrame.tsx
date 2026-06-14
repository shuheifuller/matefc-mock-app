import type { ReactNode } from 'react';
import styles from './PhoneFrame.module.css';

interface PhoneFrameProps {
  children: ReactNode;
  /** Bottom tab bar, pinned inside the frame. */
  tabBar?: ReactNode;
  /** Status bar text color flips to white over navy headers. */
  statusOnNavy?: boolean;
}

export function PhoneFrame({ children, tabBar, statusOnNavy }: PhoneFrameProps) {
  return (
    <div className={styles.stage}>
      <div className={styles.frame}>
        <div className={styles.screen}>
          <div className={styles.island} />
          <div className={`${styles.statusbar} ${statusOnNavy ? styles.onNavy : ''}`}>
            <span>9:41</span>
            <span className={styles.statusIcons}>
              <Signal />
              <Wifi />
              <Battery />
            </span>
          </div>
          <div className={`${styles.body} mfc-scroll`}>{children}</div>
          {tabBar && <div className={styles.tabSlot}>{tabBar}</div>}
        </div>
      </div>
    </div>
  );
}

function Signal() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      <rect x="0" y="7" width="3" height="4" rx="1" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
      <path d="M8 11l2.2-2.7a3 3 0 00-4.4 0L8 11zM2.4 4.2l1.5 1.8a6.4 6.4 0 018.2 0l1.5-1.8a8.8 8.8 0 00-11.2 0z" />
    </svg>
  );
}

function Battery() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" />
      <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
      <rect x="24" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
