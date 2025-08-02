"use client";

import React from 'react';
import { Skeleton } from '../Skeleton';

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Skeleton variant="rectangular" className="aspect-video" />
      <div className="p-6 space-y-4">
        <Skeleton variant="text" height={24} width="75%" />
        <div className="space-y-2">
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={16} width="83%" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton variant="rounded" height={16} width={64} />
          <Skeleton variant="rounded" height={16} width={64} />
          <Skeleton variant="rounded" height={16} width={64} />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton variant="rounded" height={32} width={80} />
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
      <section className="bg-gradient-to-r from-gray-200 to-gray-300">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton variant="text" height={16} width={128} />
              <Skeleton variant="text" height={48} width="75%" />
              <div className="space-y-2">
                <Skeleton variant="text" height={16} />
                <Skeleton variant="text" height={16} width="83%" />
              </div>
              <div className="flex gap-6">
                <Skeleton variant="text" height={16} width={96} />
                <Skeleton variant="text" height={16} width={96} />
                <Skeleton variant="text" height={16} width={96} />
              </div>
              <div className="flex gap-4">
                <Skeleton variant="rounded" height={48} width={160} />
                <Skeleton variant="rounded" height={48} width={48} />
              </div>
            </div>
            <Skeleton variant="rounded" className="aspect-video rounded-2xl" />
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
                  <Skeleton key={i} variant="rounded" height={32} width={96} />
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton variant="text" height={32} width={192} />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="text" height={16} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <Skeleton variant="text" height={24} width="75%" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="text" height={16} />
                ))}
              </div>
              <div className="pt-4 border-t space-y-3">
                <Skeleton variant="rounded" height={40} />
                <Skeleton variant="rounded" height={40} />
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
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <Skeleton variant="text" height={24} width={80} />
      
      {/* Categories */}
      <div className="space-y-3">
        <Skeleton variant="text" height={20} width={96} />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="rounded" width={16} height={16} />
              <Skeleton variant="text" height={16} width={128} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="space-y-3">
        <Skeleton variant="text" height={20} width={96} />
        <Skeleton variant="rectangular" height={8} className="rounded" />
      </div>
      
      <Skeleton variant="rounded" height={40} />
    </div>
  );
}

export function LayoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton variant="rounded" height={32} width={128} />
            <div className="flex items-center gap-4">
              <Skeleton variant="rounded" height={32} width={80} />
              <Skeleton variant="rounded" height={32} width={80} />
              <Skeleton variant="circular" height={32} width={32} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton variant="text" height={32} width="33%" />
          <Skeleton variant="text" height={16} width="66%" />
          <Skeleton variant="text" height={16} width="50%" />
        </div>
      </div>
    </div>
  );
}