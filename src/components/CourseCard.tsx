import React from 'react';
import { Course } from '../types';
import { Card } from './Card';
import { BookOpen, Clock, MapPin, User } from 'lucide-react';
interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}
export function CourseCard({
  course,
  onClick
}: CourseCardProps) {
  return <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-t-4" style={{
    borderTopColor: course.color
  }} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {course.courseCode} • {course.credits} credits
          </p>
        </div>
        {course.grade !== null && <div className="text-right">
            <p className="text-2xl font-bold" style={{
          color: course.color
        }}>
              {course.grade}%
            </p>
            <p className="text-xs text-gray-500">Current Grade</p>
          </div>}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{course.instructor}</span>
        </div>

        {course.schedule.length > 0 && <>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {course.schedule[0].day}s, {course.schedule[0].startTime} -{' '}
                {course.schedule[0].endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{course.schedule[0].location}</span>
            </div>
          </>}
      </div>
    </Card>;
}