"use client";

import React from 'react';
import { redirect } from 'next/navigation';

// TODO: Replace with your actual authentication check
// This could be from Clerk, NextAuth, or your custom auth system
async function auth() {
  // Placeholder authentication check
  // Return user object if authenticated, null if not
  return { id: 'user-123', email: 'student@example.com' };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Implement actual authentication check
  // const user = await auth();
  // if (!user) {
  //   redirect('/login');
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
            <nav className="flex space-x-4">
              {/* TODO: Add navigation links */}
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/dashboard/courses" className="text-gray-600 hover:text-gray-900">Courses</a>
              <a href="/dashboard/progress" className="text-gray-600 hover:text-gray-900">Progress</a>
              <a href="/dashboard/orders" className="text-gray-600 hover:text-gray-900">Orders</a>
              <a href="/dashboard/analytics" className="text-gray-600 hover:text-gray-900">Analytics</a>
              <a href="/dashboard/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
              <a href="/logout" className="text-red-600 hover:text-red-900">Logout</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}