import React from 'react';

interface CourseDetailPageProps {
  params: {
    courseId: string;
  };
}

// Course detail page with progress and videos - Individual course overview with lessons and progress tracking
export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = params;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Course Details</h1>
        <p className="text-gray-600 mt-2">Course ID: {courseId}</p>
      </div>

      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview & Progress</h2>
          
          {/* TODO: Add course header with thumbnail, title, description */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <h3 className="text-2xl font-bold mb-2">Course Title</h3>
            <p className="text-gray-600 mb-4">Detailed course description and learning objectives</p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-green-600 h-3 rounded-full" style={{width: '45%'}}></div>
            </div>
            <p className="text-sm text-gray-600">9 of 20 lessons completed (45%)</p>
          </div>

          {/* TODO: Add lessons/chapters list */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="bg-white p-4 rounded-lg shadow border text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Lesson 1: Introduction</h4>
                  <p className="text-gray-600 text-sm">Basic concepts and overview</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completed</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Lesson 2: Advanced Topics</h4>
                  <p className="text-gray-600 text-sm">Deep dive into core concepts</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">In Progress</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 mt-6">
            TODO: Implement course fetching, lesson progress tracking, and lesson navigation
          </p>
        </div>
      </div>
    </div>
  );
}