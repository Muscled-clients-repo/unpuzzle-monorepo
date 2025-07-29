"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useMyCourses } from "@/app/hooks/useCourses";
import LoadingSpinner from "@/app/components/shared/ui/loading-spinner";
import { Course } from "@/app/types/course.types";

const categories = [
  "All Categories",
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Machine Learning",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Cybersecurity",
];

const sortOptions = [
  { value: "recent", label: "Recently Accessed" },
  { value: "progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "alphabetical", label: "A to Z" },
];

export default function MyCoursesClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    myCourses,
    myCoursesLoading,
    myCoursesError,
    totalMyCoursesPages,
    totalMyCourses,
    fetchMyCourses,
  } = useMyCourses(currentPage, 12);
  
  // Debounced search - only for search query, let the hook handle other params
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchMyCourses({
          searchQuery,
          category: selectedCategory === "All Categories" ? undefined : selectedCategory,
          sortBy,
          page: 1 // Reset to first page on search
        });
        setCurrentPage(1);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // Only depend on searchQuery
  
  // Handle filter changes
  useEffect(() => {
    fetchMyCourses({
      searchQuery,
      category: selectedCategory === "All Categories" ? undefined : selectedCategory,
      sortBy,
      page: 1 // Reset to first page on filter change
    });
    setCurrentPage(1);
  }, [selectedCategory, sortBy]); // Only depend on filters
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchMyCourses({
      searchQuery,
      category: selectedCategory === "All Categories" ? undefined : selectedCategory,
      sortBy,
      page
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery, selectedCategory, sortBy, fetchMyCourses]);
  
  const stats = useMemo(() => ({
    total: totalMyCourses,
    inProgress: myCourses.filter(c => c.enrolled && !(c as any).completed).length,
    completed: myCourses.filter(c => (c as any).completed).length,
  }), [myCourses, totalMyCourses]);
  
  if (myCoursesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading courses: {myCoursesError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">My Learning Journey</h1>
          <p className="text-xl mb-8 text-blue-100">Continue where you left off</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-4">
                <AcademicCapIcon className="w-12 h-12 text-blue-200" />
                <div>
                  <p className="text-blue-100">Total Courses</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-4">
                <ClockIcon className="w-12 h-12 text-blue-200" />
                <div>
                  <p className="text-blue-100">In Progress</p>
                  <p className="text-3xl font-bold">{stats.inProgress}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-4">
                <CheckCircleIcon className="w-12 h-12 text-green-300" />
                <div>
                  <p className="text-blue-100">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-6">Filters</h3>
              
              {/* Sort Options */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSortBy("recent");
                  setSearchQuery("");
                }}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          </aside>
          
          {/* Course Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>
            </div>
            
            {/* Loading State */}
            {myCoursesLoading && myCourses.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : myCourses.length > 0 ? (
              <>
                {/* Course Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map((course) => (
                    <MyCourseCard key={course.id} course={course} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalMyCoursesPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalMyCoursesPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === i + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-white shadow-sm hover:shadow-md'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalMyCoursesPages}
                        className="px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">No courses found</p>
                <Link
                  href="/courses"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MyCourseCard({ course }: { course: Course }) {
  const progress = (course as any).progress || Math.floor(Math.random() * 100);
  const lastAccessed = (course as any).lastAccessed || "2 days ago";
  
  return (
    <Link 
      href={`/courses/${course.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-video bg-gray-100">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-indigo-500">
            <AcademicCapIcon className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Progress Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white">Progress</span>
            <span className="text-xs text-white font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description || "Continue your learning journey"}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{lastAccessed}</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span>{(course as any).rating || 4.8}</span>
            </div>
          </div>
          
          <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
            Continue
          </button>
        </div>
      </div>
    </Link>
  );
}