import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { CalendarPage } from './pages/CalendarPage';
import { StudyPlanPage } from './pages/StudyPlanPage';
import { SettingsPage } from './pages/SettingsPage';
import { apiClient, getSessionId, clearSessionId } from './api/client';
import { Course, Assignment } from './types';
type Page = 'login' | 'dashboard' | 'courses' | 'assignments' | 'calendar' | 'study-plan' | 'settings';
export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  // Check for existing session on mount
  useEffect(() => {
    const sessionId = getSessionId();
    if (sessionId) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      loadData();
    }
  }, []);
  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [coursesData, assignmentsData] = await Promise.all([apiClient.getCourses(), apiClient.getAssignments()]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };
  const handleLogin = async () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    await loadData();
  };
  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    clearSessionId();
    setIsAuthenticated(false);
    setCurrentPage('login');
    setCourses([]);
    setAssignments([]);
  };
  const navigate = (page: Page) => {
    setCurrentPage(page);
  };
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage courses={courses} assignments={assignments} isLoading={isLoadingData} />;
      case 'courses':
        return <CoursesPage courses={courses} isLoading={isLoadingData} />;
      case 'assignments':
        return <AssignmentsPage assignments={assignments} isLoading={isLoadingData} />;
      case 'calendar':
        return <CalendarPage courses={courses} assignments={assignments} />;
      case 'study-plan':
        return <StudyPlanPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage courses={courses} assignments={assignments} isLoading={isLoadingData} />;
    }
  };
  return <Layout currentPage={currentPage} onNavigate={navigate} onLogout={handleLogout}>
      {renderPage()}
    </Layout>;
}