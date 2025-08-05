import React from 'react';

// Personalized learning analytics - Learning patterns, time tracking, and performance insights
export default function AnalyticsPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="text-gray-600 mt-2">Insights into your learning patterns and progress</p>
      </div>

      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Learning Dashboard</h2>
          
          {/* TODO: Add analytics charts and metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">47h</h3>
              <p className="text-gray-600">This Month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-green-600 mb-2">89%</h3>
              <p className="text-gray-600">Avg. Completion</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-purple-600 mb-2">15</h3>
              <p className="text-gray-600">Day Streak</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-orange-600 mb-2">4.8</h3>
              <p className="text-gray-600">Avg. Rating</p>
            </div>
          </div>

          {/* TODO: Add learning time chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-bold mb-4 text-left">Weekly Learning Activity</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Learning Time Chart Placeholder</p>
            </div>
          </div>

          {/* TODO: Add performance breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-left">
              <h3 className="text-xl font-bold mb-4">Course Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>React Fundamentals</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">95%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Advanced JavaScript</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">78%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Node.js Backend</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">45%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow text-left">
              <h3 className="text-xl font-bold mb-4">Learning Patterns</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred Learning Time</span>
                  <span className="font-medium">Evening (6-9 PM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Session Duration</span>
                  <span className="font-medium">45 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Most Active Day</span>
                  <span className="font-medium">Wednesday</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium">89%</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 mt-6">
            TODO: Implement learning analytics with charts, time tracking, and personalized insights
          </p>
        </div>
      </div>
    </div>
  );
}