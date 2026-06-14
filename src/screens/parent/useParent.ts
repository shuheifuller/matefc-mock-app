import { useSession } from '../../context/SessionContext';
import { useData } from '../../context/DataContext';
import { studentsForFamily } from '../../lib/selectors';

/** Resolves the signed-in parent's family, students and unread notifications. */
export function useParent() {
  const { familyId } = useSession();
  const data = useData();
  const family = data.families.find((f) => f.id === familyId)!;
  const students = studentsForFamily(data.students, familyId ?? '');
  const notifications = data.notifications.filter(
    (n) => (n.forRole === 'parent' || n.forRole === 'both') && (!n.familyId || n.familyId === familyId),
  );
  const unread = notifications.filter((n) => !n.read).length;
  return { family, students, notifications, unread, data };
}
