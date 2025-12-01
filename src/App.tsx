import React, { useEffect, useState, useRef } from 'react';
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
import ChatPage from './pages/ChatPage';
import NoteTakerPage from './pages/NoteTakerPage'; // Import NoteTakerPage

type Page = 'login' | 'dashboard' | 'courses' | 'assignments' | 'calendar' | 'study-plan' | 'settings' | 'chat' | 'notetaker'; // Add 'notetaker'

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const sessionId = getSessionId();
    if (sessionId) {
      apiClient.getUser()
        .then(userData => {
          setIsAuthenticated(true);
          setCurrentPage('dashboard');
          loadData();
          setUser(userData);
        })
        .catch(() => {
          clearSessionId();
          setIsAuthenticated(false);
          setCurrentPage('login');
          setUser(null);
        });
    }
  }, []);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [coursesData, assignmentsData] = await Promise.all([
        apiClient.getCourses(),
        apiClient.getAssignments(),
      ]);

      if (isMounted.current) {
        setCourses(coursesData);
        setAssignments(assignmentsData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      if (isMounted.current) {
        setIsLoadingData(false);
      }
    }
  };

  const handleLogin = async () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    await loadData();
    const userData = await apiClient.getUser();
    setUser(userData);
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
    setUser(null);
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            courses={courses}
            assignments={assignments}
            isLoading={isLoadingData}
          />
        );
      case 'courses':
        return <CoursesPage courses={courses} isLoading={isLoadingData} />;
      case 'assignments':
        return (
          <AssignmentsPage
            assignments={assignments}
            isLoading={isLoadingData}
          />
        );
      case 'calendar':
        return <CalendarPage courses={courses} assignments={assignments} />;
      case 'study-plan':
        return <StudyPlanPage />;
      case 'settings':
        return <SettingsPage />;
      case 'chat':
        return <ChatPage />;
      case 'notetaker':
        return <NoteTakerPage />; // Add NoteTakerPage route
      default:
        return (
          <DashboardPage
            courses={courses}
            assignments={assignments}
            isLoading={isLoadingData}
          />
        );
    }
  };

  return (
    isAuthenticated ? (
      <Layout
        currentPage={currentPage}
        onNavigate={navigate}
        onLogout={handleLogout}
        user={user}
      >
        {renderPage()}
      </Layout>
    ) : (
      <LoginPage onLogin={handleLogin} />
    )
  );
}

export default App;