import { Navigate, Outlet } from 'react-router-dom';
import { PhoneFrame } from '../../components/PhoneFrame';
import { BottomTabBar, type TabItem } from '../../components/BottomTabBar';
import { IconBall, IconCalendar, IconCard, IconGrid, IconHome } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useSession } from '../../context/SessionContext';

export function ParentLayout() {
  const { role } = useSession();
  const { t } = useI18n();

  if (role !== 'parent') return <Navigate to="/" replace />;

  const tabs: TabItem[] = [
    { to: '/parent', label: t('nav.home'), icon: IconHome },
    { to: '/parent/schedule', label: t('nav.schedule'), icon: IconCalendar },
    { to: '/parent/classes', label: t('nav.classes'), icon: IconBall },
    { to: '/parent/billing', label: t('nav.billing'), icon: IconCard },
    { to: '/parent/profile', label: t('nav.more'), icon: IconGrid },
  ];

  return (
    <PhoneFrame statusOnNavy tabBar={<BottomTabBar items={tabs} />}>
      <Outlet />
    </PhoneFrame>
  );
}
