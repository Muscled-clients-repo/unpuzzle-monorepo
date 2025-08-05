"use client";

import React, { useState, useEffect } from "react";
import { useMyLearning } from "@/hooks/useCourses";
import { LoadingSpinner } from "@unpuzzle/ui";
import Link from "next/link";
import Image from "next/image";
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface FilterState {
  search: string;
  status: string;
  sortBy: string;
  category: string;
}

export default function MyCoursesClient() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    sortBy: "recent",
    category: "all"
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    myLearning: enrolledCourses = [], 
    loading, 
    error, 
    totalCourses,
    fetchMyLearning 
  } = useMyLearning();

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMyLearning({
        search: filters.search || undefined,
        category: filters.category !== "all" ? filters.category : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        sort: filters.sortBy
      });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.category, filters.status, filters.sortBy]); // Remove fetchMyLearning from deps

  // API handles filtering and sorting, so we use courses directly
  const sortedCourses = enrolledCourses;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
              <button 
                onClick={() => fetchMyLearning()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
            </div>
            {error.includes('connect to server') && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Development Note:</strong> Make sure the core server is running at{' '}
                  <code className="bg-yellow-100 px-1 rounded">https://dev1.nazmulcodes.org</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
          <p className="text-gray-600 mt-1">Track and continue your enrolled courses</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{totalCourses || sortedCourses.length} courses</span>
        </div>
      </div>

      {/* Filters Bar - Shopify Style */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Main Filter Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* Sort By */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="progress">Progress</option>
              </select>

              {/* More Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="h-5 w-5" />
                <span>More filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Extended Filters (when showFilters is true) */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(filters.search || filters.status !== "all" || filters.category !== "all") && (
          <div className="p-4 bg-blue-50 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-700">Active filters:</span>
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-gray-300">
                  Search: {filters.search}
                  <button
                    onClick={() => setFilters({ ...filters, search: "" })}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-gray-300">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "all" })}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.category !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-gray-300">
                  Category: {filters.category}
                  <button
                    onClick={() => setFilters({ ...filters, category: "all" })}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={() => setFilters({ search: "", status: "all", sortBy: "recent", category: "all" })}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {sortedCourses.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.status !== "all" 
                ? "Try adjusting your filters"
                : "Start by enrolling in a course"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Accessed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCourses.map((course) => {
                  const progress = course.progress || 0;
                  const isCompleted = progress >= 100;
                  
                  return (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-16 flex-shrink-0 relative rounded overflow-hidden">
                            <Image
                              src={course.thumbnail || "/assets/courseThumbnail.svg"}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.category || "General"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{course.instructor || "Unpuzzle"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                  className={`h-2 rounded-full ${
                                    isCompleted ? 'bg-green-600' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{progress}%</span>
                            </div>
                          </div>
                          {isCompleted && (
                            <CheckCircleIcon className="ml-2 h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.lastAccessed 
                          ? new Date(course.lastAccessed).toLocaleDateString()
                          : "Never"
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {course.duration || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/courses/${course.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {isCompleted ? "Review" : "Continue"}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination (if needed) */}
      {sortedCourses.length > 10 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{Math.min(10, sortedCourses.length)}</span> of{" "}
                <span className="font-medium">{sortedCourses.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}