import React from 'react';

// Overall course progress - Comprehensive view of learning progress across all courses
export default function ProgressPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600 mt-2">Track your progress across all courses</p>
      </div>

      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Overview</h2>
          
          {/* TODO: Add overall progress statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">12</h3>
              <p className="text-gray-600">Courses Enrolled</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-green-600 mb-2">8</h3>
              <p className="text-gray-600">Courses Completed</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-orange-600 mb-2">147</h3>
              <p className="text-gray-600">Total Hours Learned</p>
            </div>
          </div>

          {/* TODO: Add detailed progress breakdown */}
          <div className="bg-white p-6 rounded-lg shadow text-left">
            <h3 className="text-xl font-bold mb-4">Course Progress Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">React Fundamentals</span>
                  <span className="text-sm text-gray-600">85% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Advanced JavaScript</span>
                  <span className="text-sm text-gray-600">60% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Node.js Backend</span>
                  <span className="text-sm text-gray-600">30% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 mt-6">
            TODO: Implement progress analytics, completion certificates, and learning streaks
          </p>
        </div>
      </div>
    </div>
  );
}