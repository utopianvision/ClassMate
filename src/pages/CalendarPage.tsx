import { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Course, Assignment } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AssignmentModal } from '../components/AssignmentModal';

interface CalendarPageProps {
  courses: Course[];
  assignments: Assignment[];
}

export function CalendarPage({ courses, assignments }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return {
      daysInMonth,
      startingDayOfWeek,
    };
  };

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter((assignment) => {
      if (!assignment.dueDate) return false;
      const dueDate = new Date(assignment.dueDate);
      return (
        dueDate.getDate() === date.getDate() &&
        dueDate.getMonth() === date.getMonth() &&
        dueDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-32" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dayAssignments = getAssignmentsForDate(date);
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();

    days.push(
      <div
        key={day}
        className={`h-32 border border-gray-200 p-2 ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
      >
        <div
          className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-700' : 'text-gray-700'}`}
        >
          {day}
        </div>
        <div className="space-y-1 overflow-y-auto max-h-20">
          {dayAssignments.map((assignment) => (
            <button
              key={assignment.id}
              className="text-xs p-1 rounded truncate w-full text-left"
              style={{
                backgroundColor: `${assignment.courseColor}20`,
                color: assignment.courseColor,
              }}
              onClick={() => setSelectedAssignment(assignment)}
            >
              <Badge
                variant={
                  assignment.status === 'overdue'
                    ? 'error'
                    : assignment.status === 'submitted'
                      ? 'success'
                      : 'default'
                }
                size="sm"
                className="mr-1"
              >
                {assignment.status}
              </Badge>
              {assignment.title}
            </button>
          ))}
        </div>
      </div>,
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
        <p className="text-gray-600">View all your assignments and deadlines</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0 border border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-3 text-center font-medium text-gray-700 border-b border-gray-200"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="error" size="sm">
                overdue
              </Badge>
              <span className="text-sm text-gray-600">Past due date</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" size="sm">
                upcoming
              </Badge>
              <span className="text-sm text-gray-600">Not yet due</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                submitted
              </Badge>
              <span className="text-sm text-gray-600">Turned in</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Assignments</span>
              <span className="font-medium text-gray-900">
                {assignments.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Courses</span>
              <span className="font-medium text-gray-900">
                {courses.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-medium text-gray-900">
                {
                  assignments.filter((a) => {
                    if (!a.dueDate) return false;
                    const dueDate = new Date(a.dueDate);
                    return (
                      dueDate.getMonth() === currentDate.getMonth() &&
                      dueDate.getFullYear() === currentDate.getFullYear()
                    );
                  }).length
                }
              </span>
            </div>
          </div>
        </Card>
      </div>
      {selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  );
}
