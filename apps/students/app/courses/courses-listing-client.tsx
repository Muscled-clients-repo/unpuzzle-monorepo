"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/app/types/course.types";
import { useCourses, usePopularCourses } from "@/app/hooks/useCourses";
import { MagnifyingGlassIcon, FunnelIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { StarIcon, ClockIcon, UsersIcon, PhotoIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "@/app/components/shared/ui/loading-spinner";
import { CourseListSkeleton, CourseCardSkeleton } from "@/app/components/shared/course-skeleton-loader";
import { Brain } from "lucide-react";

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
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function CoursesListingClient() {
  const {
    courses,
    loading,
    error,
    filters,
    totalCourses,
    currentPage,
    totalPages,
    updateFilters,
    performSearch,
    refreshCourses,
    fetchCourses,
  } = useCourses();
  
  // Re-enabled after fixing data structure
  const { popularCourses, loading: popularLoading } = usePopularCourses(4);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 1000]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loadMorePage, setLoadMorePage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(false);
  
  // Initialize courses when data changes (first page or filters change)


  // Reset accumulated courses when filters change
  useEffect(() => {

    
  }, [filters.category, filters.searchQuery, filters.sortBy, filters.priceRange, filters.level]);

  // Load more courses function
  const loadMoreCourses = async () => {
    
    if (isLoadingMore || !hasMorePages) return;
    
    setIsLoadingMore(true);
    
    try {
      // Fetch next page
      await fetchCourses({ page: loadMorePage, force: true });
      
      // The courses will be updated in the effect above
    } catch (error) {
      console.error('Failed to load more courses:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    console.log("dispatching...", hasMorePages)
    loadMoreCourses()
  }, [loadMorePage]);

  useEffect(()=>{
    const withDuplicate = [...allCourses, ...courses]
    const uniqueCourses = withDuplicate.reduce<Course[]>((acc, current) => {
      if (!acc.some(item => item.id === current.id)) {
        acc.push(current);
      }
      return acc;
    }, []);
    setAllCourses(uniqueCourses)
    setHasMorePages(totalPages>loadMorePage);
  },[courses])
  

  // Debounced search effect - handle locally
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCategoryChange = (category: string) => {
    updateFilters({ 
      category: category === "All Categories" ? undefined : category 
    });
  };

  const handleSortChange = (sort: string) => {
    updateFilters({ sortBy: sort as any });
  };

  const handlePriceRangeChange = (value: number) => {
    const newRange: [number, number] = [localPriceRange[0], value];
    setLocalPriceRange(newRange);
    // Debounce price range updates
    setTimeout(() => {
      updateFilters({ priceRange: newRange });
    }, 300);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading courses: {error}</p>
          <button 
            onClick={() => refreshCourses()}
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
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-center mb-6">
            Explore Our Courses
          </h1>
          <p className="text-xl text-center mb-8 text-gray-100 max-w-2xl mx-auto">
            Master new skills through interactive learning experiences powered by AI
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-full text-gray-900 placeholder-gray-500 border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-white/40"
            />
            <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      {!filters.searchQuery && !filters.category && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Popular Courses</h2>
            <Link href="/courses?sort=popular" className="text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))
            ) : popularCourses.length > 0 ? (
              popularCourses.slice(0, 4).map((course) => (
                <CourseCard key={course.id} course={course} featured />
              ))
            ) : null}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="main-course-content" className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-6">Filters</h3>
              
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
                        checked={(filters.category || "All Categories") === category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>${localPriceRange[0]}</span>
                    <span>${localPriceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={localPriceRange[1]}
                    onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Level */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Level</h4>
                <div className="space-y-2">
                  {["All Levels", "Beginner", "Intermediate", "Advanced"].map((level) => (
                    <label key={level} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  updateFilters({
                    category: undefined,
                    priceRange: undefined,
                    searchQuery: undefined,
                  });
                  setSearchQuery("");
                  setLocalPriceRange([0, 1000]);
                }}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <FunnelIcon className="w-5 h-5" />
                  Filters
                </button>
                <button
                  onClick={() => refreshCourses()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Refresh
                </button>
                <p className="text-gray-600">
                  {loading ? "Loading..." : `Showing ${allCourses.length} of ${totalCourses} courses`}
                </p>
              </div>
              
              <div className="relative">
                <select
                  value={filters.sortBy || "popular"}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Course Grid */}
            {loading && allCourses.length === 0 ? (
              <CourseListSkeleton count={6} />
            ) : allCourses.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
                
                {/* Load More Button */}
                {hasMorePages && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={()=>setLoadMorePage(loadMorePage + 1)}
                      disabled={isLoadingMore}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner  variant="small" />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
                
                {!hasMorePages && allCourses.length > 0 && (
                  <div className="text-center mt-8">
                    <p className="text-gray-500">You've reached the end! No more courses to load.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No courses found matching your criteria</p>
                <button
                  onClick={() => {
                    updateFilters({
                      category: undefined,
                      priceRange: undefined,
                      searchQuery: undefined,
                    });
                    setSearchQuery("");
                    setLocalPriceRange([0, 1000]);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Clear filters and try again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-white" />
                <span className="text-xl font-bold text-white">Unpuzzle</span>
              </div>
              <p className="text-sm">
                Making learning interactive and engaging through puzzle-based education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses" className="hover:text-white">Browse Courses</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/sign-up" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2024 Unpuzzle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CourseCard({ course, featured = false }: { course: any; featured?: boolean }) {
  const [imageError, setImageError] = useState(false);

  // Use multiple fallbacks since the API response might use different field names
  const imageUrl = course.thumbnail || course.courseImage || (course as any).image || (course as any).thumbnail_url;
  const hasValidImage = imageUrl && imageUrl.trim() !== '' && !imageError;

  return (
    <Link 
      href={`/course-video/${course.id}`} 
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
        featured ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="relative aspect-video bg-gray-100">
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-400 to-blue-500">
            <div className="text-center text-white">
              <PhotoIcon className="w-12 h-12 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium px-4 line-clamp-2">{course.title}</p>
              <p className="text-xs opacity-75 mt-1">Course Preview</p>
            </div>
          </div>
        )}
        {featured && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
            Popular
          </span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description || "Master new skills with interactive learning"}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span>{(course as any).rating || 4.8}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>{course.duration || "10h"}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="w-4 h-4" />
            <span>1.2k</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
          {course.enrolled && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Enrolled
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}