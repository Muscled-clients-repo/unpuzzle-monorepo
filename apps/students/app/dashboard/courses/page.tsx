import React from 'react';

// All courses the student owns - Display enrolled courses with progress indicators
export default function CoursesPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">All courses you're enrolled in</p>
      </div>

      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Enrolled Courses</h2>
          
          {/* TODO: Add course grid/list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <h3 className="font-semibold mb-2">Course Title</h3>
              <p className="text-gray-600 text-sm mb-3">Course description preview</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">65% Complete</p>
            </div>
          </div>
          
          <p className="text-gray-500 mt-6">
            TODO: Implement course fetching, progress tracking, and course cards
          </p>
        </div>
      </div>
    </div>
  );
}