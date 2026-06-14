import { Navigate, Outlet } from 'react-router-dom';
import { PhoneFrame } from '../../components/PhoneFrame';
import { BottomTabBar, type TabItem } from '../../components/BottomTabBar';
import { IconBall, IconGrid, IconHome, IconStar, IconUsers } from '../../components/Icons';
import { useI18n } from '../../i18n/I18nContext';
import { useSession } from '../../context/SessionContext';
import { useData } from '../../context/DataContext';
import { MembershipCategory } from '../../types/domain';

export function CoachLayout() {
  const { role } = useSession();
  const { t } = useI18n();
  const { students } = useData();

  if (role !== 'coach') return <Navigate to="/" replace />;

  const pendingTrials = students.filter(
    (s) => s.category === MembershipCategory.Trial && s.trial?.status === 'scheduled',
  ).length;

  const tabs: TabItem[] = [
    { to: '/coach', label: t('nav.today'), icon: IconHome },
    { to: '/coach/roster', label: t('nav.roster'), icon: IconUsers },
    { to: '/coach/trials', label: t('nav.trials'), icon: IconBall, badge: pendingTrials },
    { to: '/coach/skills', label: t('nav.skills'), icon: IconStar },
    { to: '/coach/profile', label: t('nav.more'), icon: IconGrid },
  ];

  return (
    <PhoneFrame statusOnNavy tabBar={<BottomTabBar items={tabs} />}>
      <Outlet />
    </PhoneFrame>
  );
}
