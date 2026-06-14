import type { ReactNode } from 'react';
import { I18nProvider } from '../i18n/I18nContext';
import { SessionProvider } from './SessionContext';
import { DataProvider } from './DataContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider initialLang="en">
      <SessionProvider>
        <DataProvider>{children}</DataProvider>
      </SessionProvider>
    </I18nProvider>
  );
}
