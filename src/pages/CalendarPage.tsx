import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Course, Assignment } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AssignmentModal } from '../components/AssignmentModal';

declare global {
  interface Window { gapi: any; google: any; }
}

const CLIENT_ID = '';
const API_KEY = '';

interface CalendarPageProps {
  courses: Course[];
  assignments: Assignment[];
}

export function CalendarPage({ courses, assignments }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [syncedAssignments, setSyncedAssignments] = useState<Set<string>>(new Set());
  const [tokenClient, setTokenClient] = useState<any>(null);

  // --- Load Google APIs ---
  useEffect(() => {
    // gapi client
    const gapiScript = document.createElement('script');
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.onload = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
        setGapiLoaded(true);
        console.log("gapi client initialized");
      });
    };
    document.body.appendChild(gapiScript);

    // GIS
    const gisScript = document.createElement('script');
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.onload = () => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: "https://www.googleapis.com/auth/calendar.events",
        callback: (tokenResponse: any) => {
          console.log("Access token received:", tokenResponse.access_token);
          setIsSignedIn(true);
        },
      });
      setTokenClient(client);
    };
    document.body.appendChild(gisScript);
  }, []);

  // --- Sign in/out functions ---
  const handleSignIn = () => {
    if (!tokenClient) return;
    tokenClient.requestAccessToken({ prompt: 'consent' });
  };
  const handleSignOut = () => {
    const token = window.gapi.client.getToken?.()?.access_token;
    if (token) {
      window.google.accounts.oauth2.revoke(token, () => {
        console.log("Token revoked");
        setIsSignedIn(false);
      });
    }
  };

  // --- Calendar helpers ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  };

  const getAssignmentsForDate = (date: Date) =>
    assignments.filter(a => a.dueDate && new Date(a.dueDate).toDateString() === date.toDateString());

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // --- Add single assignment to Google Calendar ---
  const addAssignmentToGoogleCalendar = async (assignment: Assignment) => {
    if (!isSignedIn) {
      alert("Sign in to Google first!");
      return;
    }

    if (!assignment.dueDate) return;

    const dueDate = new Date(assignment.dueDate);
    if (isNaN(dueDate.getTime())) {
      console.error("Invalid dueDate:", assignment);
      alert("Invalid assignment due date.");
      return;
    }

    const event = {
      summary: assignment.title || "Assignment",
      description: `Course: ${assignment.courseName || "Unknown"}`,
      start: {
        dateTime: dueDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(dueDate.getTime() + 30*60*1000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      console.log("Event created:", response);
      alert(`Added "${assignment.title}" to Google Calendar`);
      setSyncedAssignments(prev => new Set(prev).add(assignment.id));
    } catch (err: any) {
      console.error("Failed to add event:", err?.result || err);
      alert("Failed to add event. See console for details.");
    }
  };

  // --- Render calendar grid ---
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(<div key={`empty-${i}`} className="h-32" />);
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayAssignments = getAssignmentsForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();

    days.push(
      <div key={day} className={`h-32 border p-2 ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
        <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>{day}</div>
        <div className="space-y-1 overflow-y-auto max-h-20">
          {dayAssignments.map(a => {
            const isSynced = syncedAssignments.has(a.id);
            return (
              <button
                key={a.id}
                className="text-xs p-1 rounded truncate w-full text-left"
                style={{
                  backgroundColor: `${a.courseColor}20`,
                  color: a.courseColor,
                  border: isSynced ? '2px solid green' : undefined,
                }}
                onClick={() => setSelectedAssignment(a)}
              >
                <Badge
                  variant={a.status === 'overdue' ? 'error' : a.status === 'submitted' ? 'success' : 'default'}
                  size="sm"
                >
                  {a.status}
                </Badge>{" "}
                {a.title}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header with Sign in/out */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-gray-600">View all your assignments and deadlines</p>
        </div>
        {gapiLoaded && tokenClient && (
          <div>
            {!isSignedIn ? (
              <button onClick={handleSignIn} className="px-4 py-2 bg-blue-500 text-white rounded">
                Sign in to Google
              </button>
            ) : (
              <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded">
                Sign out
              </button>
            )}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{monthName}</h2>
          <div className="flex gap-2">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0 border border-gray-200">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="bg-gray-50 p-3 text-center font-medium border-b border-gray-200">{d}</div>
          ))}
          {days}
        </div>
      </Card>

      {/* Assignment Modal */}
      {selectedAssignment && (
        <AssignmentModal assignment={selectedAssignment} onClose={() => setSelectedAssignment(null)}>
          {isSignedIn && (
            <button
              onClick={() => addAssignmentToGoogleCalendar(selectedAssignment)}
              className="mt-4 px-3 py-2 bg-green-500 text-white rounded"
            >
              Add to Google Calendar
            </button>
          )}
        </AssignmentModal>
      )}
    </div>
  );
}
