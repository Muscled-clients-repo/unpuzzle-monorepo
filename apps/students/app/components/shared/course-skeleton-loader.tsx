"use client";

import React from 'react';

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function CourseListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="h-4 bg-gray-300 rounded w-32" />
              <div className="h-12 bg-gray-300 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
              </div>
              <div className="flex gap-6">
                <div className="h-4 bg-gray-300 rounded w-24" />
                <div className="h-4 bg-gray-300 rounded w-24" />
                <div className="h-4 bg-gray-300 rounded w-24" />
              </div>
              <div className="flex gap-4">
                <div className="h-12 bg-gray-300 rounded w-40" />
                <div className="h-12 bg-gray-300 rounded w-12" />
              </div>
            </div>
            <div className="aspect-video bg-gray-300 rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              <div className="flex gap-4 border-b pb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded w-24" />
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="pt-4 border-t space-y-3">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-20" />
      
      {/* Categories */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-24" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-24" />
        <div className="h-2 bg-gray-200 rounded" />
      </div>
      
      <div className="h-10 bg-gray-200 rounded" />
    </div>
  );
}