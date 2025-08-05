import React from 'react';

// Main dashboard page - Quick overview of student's learning progress and activities
export default function DashboardPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Your learning journey overview and quick access to recent activities
          </p>
          
          {/* TODO: Add dashboard widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Recent Courses</h3>
              <p className="text-gray-600">Continue where you left off</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Progress Overview</h3>
              <p className="text-gray-600">Track your learning milestones</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Upcoming Deadlines</h3>
              <p className="text-gray-600">Stay on track with your goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}