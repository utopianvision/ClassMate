import React from 'react';
import { CourseCard } from '../components/CourseCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Course } from '../types';
interface CoursesPageProps {
  courses: Course[];
  isLoading: boolean;
}
export function CoursesPage({
  courses,
  isLoading
}: CoursesPageProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>;
  }
  return <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">{courses.length} courses enrolled</p>
      </div>

      {courses.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => <CourseCard key={course.id} course={course} />)}
        </div> : <div className="text-center py-12">
          <p className="text-gray-500">No courses found</p>
        </div>}
    </div>;
}