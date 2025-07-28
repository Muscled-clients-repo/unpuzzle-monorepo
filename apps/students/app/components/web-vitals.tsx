'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(metric);
    }

    // Send to analytics endpoint
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: new Date().toISOString(),
    });

    const url = '/api/analytics/vitals';

    // Use sendBeacon if available, fallback to fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, {
        body,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
      }).catch(error => {
        console.error('Failed to send web vitals:', error);
      });
    }
  });

  return null;
}

// Performance utility functions
export const perfMark = (name: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name);
  }
};

export const perfMeasure = (name: string, startMark: string, endMark?: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
      
      const measures = performance.getEntriesByName(name);
      const lastMeasure = measures[measures.length - 1];
      
      if (lastMeasure && 'duration' in lastMeasure) {
        console.log(`Performance: ${name} took ${lastMeasure.duration.toFixed(2)}ms`);
        return lastMeasure.duration;
      }
    } catch (error) {
      console.error('Performance measurement failed:', error);
    }
  }
  return null;
};