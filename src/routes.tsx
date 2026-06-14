import { Navigate, Route, Routes } from 'react-router-dom';
import { RoleSelectScreen } from './screens/auth/RoleSelectScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { ParentLayout } from './screens/parent/ParentLayout';
import { DashboardScreen } from './screens/parent/DashboardScreen';
import { StudentsScreen } from './screens/parent/StudentsScreen';
import { StudentDetailScreen } from './screens/parent/StudentDetailScreen';
import { ClassesBrowseScreen } from './screens/parent/ClassesBrowseScreen';
import { EnrollScreen } from './screens/parent/EnrollScreen';
import { ScheduleScreen } from './screens/parent/ScheduleScreen';
import { AttendanceScreen } from './screens/parent/AttendanceScreen';
import { ProgressScreen } from './screens/parent/ProgressScreen';
import { BillingScreen } from './screens/parent/BillingScreen';
import { NewsScreen } from './screens/parent/NewsScreen';
import { NotificationsScreen } from './screens/parent/NotificationsScreen';
import { ProfileScreen } from './screens/parent/ProfileScreen';
import { CoachLayout } from './screens/coach/CoachLayout';
import { CoachDashboardScreen } from './screens/coach/CoachDashboardScreen';
import { RosterScreen } from './screens/coach/RosterScreen';
import { MemberDetailScreen } from './screens/coach/MemberDetailScreen';
import { SessionAttendanceScreen } from './screens/coach/SessionAttendanceScreen';
import { TrialsScreen } from './screens/coach/TrialsScreen';
import { SkillEntryScreen } from './screens/coach/SkillEntryScreen';
import { AnnouncementsScreen } from './screens/coach/AnnouncementsScreen';
import { CoachProfileScreen } from './screens/coach/CoachProfileScreen';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectScreen />} />
      <Route path="/login/:role" element={<LoginScreen />} />

      <Route path="/parent" element={<ParentLayout />}>
        <Route index element={<DashboardScreen />} />
        <Route path="students" element={<StudentsScreen />} />
        <Route path="students/:id" element={<StudentDetailScreen />} />
        <Route path="classes" element={<ClassesBrowseScreen />} />
        <Route path="enroll" element={<EnrollScreen />} />
        <Route path="schedule" element={<ScheduleScreen />} />
        <Route path="attendance" element={<AttendanceScreen />} />
        <Route path="progress" element={<ProgressScreen />} />
        <Route path="billing" element={<BillingScreen />} />
        <Route path="news" element={<NewsScreen />} />
        <Route path="notifications" element={<NotificationsScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
      </Route>

      <Route path="/coach" element={<CoachLayout />}>
        <Route index element={<CoachDashboardScreen />} />
        <Route path="roster" element={<RosterScreen />} />
        <Route path="roster/:id" element={<MemberDetailScreen />} />
        <Route path="attendance/:sessionId" element={<SessionAttendanceScreen />} />
        <Route path="trials" element={<TrialsScreen />} />
        <Route path="skills" element={<SkillEntryScreen />} />
        <Route path="announcements" element={<AnnouncementsScreen />} />
        <Route path="profile" element={<CoachProfileScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
