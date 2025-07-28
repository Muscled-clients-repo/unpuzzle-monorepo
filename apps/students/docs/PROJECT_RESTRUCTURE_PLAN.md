# 🎯 Unpuzzle Project Restructuring Plan - Path to 10/10 Efficiency

## Executive Summary
This plan outlines a complete restructuring of the Unpuzzle project to achieve a perfect 10/10 efficiency score through semantic folder organization, performance optimization, and architectural best practices.

## 📁 Semantic Folder Structure (Feature-First Architecture)

```
unpuzzle-student/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (auth)/                       # Auth group route
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/                  # Dashboard group route
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [courseId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── loading.tsx
│   │   │   ├── my-courses/
│   │   │   │   └── page.tsx
│   │   │   ├── puzzle-content/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (learning)/                   # Learning group route
│   │   │   ├── annotations/
│   │   │   │   └── page.tsx
│   │   │   ├── student-view/[id]/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                          # API routes
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   ├── annotations/
│   │   │   └── webhooks/
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Home page
│   │   ├── error.tsx                     # Error boundary
│   │   ├── loading.tsx                   # Loading state
│   │   └── not-found.tsx                 # 404 page
│   │
│   ├── features/                         # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── SignInForm.tsx
│   │   │   │   ├── SignUpForm.tsx
│   │   │   │   └── AuthGuard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── store/
│   │   │   │   └── auth.slice.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── courses/
│   │   │   ├── components/
│   │   │   │   ├── CourseCard/
│   │   │   │   │   ├── CourseCard.tsx
│   │   │   │   │   ├── CourseCard.test.tsx
│   │   │   │   │   └── CourseCard.module.css
│   │   │   │   ├── CourseList/
│   │   │   │   ├── CourseDetails/
│   │   │   │   └── CourseFilters/
│   │   │   ├── hooks/
│   │   │   │   ├── useCourses.ts
│   │   │   │   ├── useCourseDetail.ts
│   │   │   │   └── useCourseEnrollment.ts
│   │   │   ├── services/
│   │   │   │   ├── courses.service.ts
│   │   │   │   └── enrollment.service.ts
│   │   │   ├── store/
│   │   │   │   ├── courses.slice.ts
│   │   │   │   └── courses.api.ts
│   │   │   └── types/
│   │   │       └── course.types.ts
│   │   │
│   │   ├── video-player/
│   │   │   ├── components/
│   │   │   │   ├── VideoPlayer/
│   │   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   │   ├── VideoControls.tsx
│   │   │   │   │   ├── VideoProgress.tsx
│   │   │   │   │   └── VideoPlayer.test.tsx
│   │   │   │   ├── VideoTimeline/
│   │   │   │   ├── VideoAnnotations/
│   │   │   │   └── VideoStats/
│   │   │   ├── hooks/
│   │   │   │   ├── useVideoPlayer.ts
│   │   │   │   ├── useVideoTime.ts
│   │   │   │   └── useVideoAnnotations.ts
│   │   │   ├── services/
│   │   │   │   └── video.service.ts
│   │   │   ├── store/
│   │   │   │   └── video.slice.ts
│   │   │   └── types/
│   │   │       └── video.types.ts
│   │   │
│   │   ├── annotations/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── types/
│   │   │
│   │   ├── puzzle-journey/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── types/
│   │   │
│   │   └── ai-agents/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── store/
│   │       └── types/
│   │
│   ├── shared/                           # Shared/Common modules
│   │   ├── components/
│   │   │   ├── ui/                       # Primitive UI components
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   ├── Button.stories.tsx
│   │   │   │   │   └── Button.module.css
│   │   │   │   ├── Card/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Input/
│   │   │   │   ├── Select/
│   │   │   │   └── index.ts
│   │   │   ├── layouts/
│   │   │   │   ├── DashboardLayout/
│   │   │   │   ├── AuthLayout/
│   │   │   │   └── LearningLayout/
│   │   │   ├── navigation/
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── Header/
│   │   │   │   └── Footer/
│   │   │   └── feedback/
│   │   │       ├── ErrorBoundary/
│   │   │       ├── LoadingSpinner/
│   │   │       └── Toast/
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useIntersectionObserver.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── utils/
│   │   │   ├── format/
│   │   │   │   ├── date.ts
│   │   │   │   ├── number.ts
│   │   │   │   └── string.ts
│   │   │   ├── validation/
│   │   │   │   ├── schemas.ts
│   │   │   │   └── validators.ts
│   │   │   └── helpers/
│   │   │       ├── api.ts
│   │   │       ├── storage.ts
│   │   │       └── constants.ts
│   │   └── types/
│   │       ├── global.d.ts
│   │       └── common.types.ts
│   │
│   ├── core/                             # Core application setup
│   │   ├── config/
│   │   │   ├── app.config.ts
│   │   │   ├── api.config.ts
│   │   │   └── env.config.ts
│   │   ├── providers/
│   │   │   ├── AppProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── StoreProvider.tsx
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   ├── middleware.ts
│   │   │   └── hooks.ts
│   │   └── lib/
│   │       ├── axios.ts
│   │       ├── clerk.ts
│   │       └── analytics.ts
│   │
│   └── styles/
│       ├── globals.css
│       ├── variables.css
│       └── themes/
│           ├── light.css
│           └── dark.css
│
├── public/
│   ├── fonts/
│   ├── images/
│   ├── icons/
│   └── locales/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── scripts/
│   ├── build.js
│   ├── analyze.js
│   └── optimize.js
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── components/
│
├── .github/
│   ├── workflows/
│   └── CODEOWNERS
│
├── next.config.js
├── tsconfig.json
├── package.json
├── .env.example
└── README.md
```

## 🎯 10/10 Efficiency Implementation Plan

### Phase 1: Foundation & Setup (Week 1)

#### 1.1 Project Configuration
```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "analyze": "ANALYZE=true next build",
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "validate": "npm run typecheck && npm run lint && npm run test:ci",
    "prepare": "husky install"
  }
}
```

#### 1.2 TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@core/*": ["./src/core/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", ".next", "out"]
}
```

#### 1.3 Next.js Configuration
```javascript
// next.config.js
import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';

const config = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns'
    ],
    serverComponentsExternalPackages: ['@ffmpeg/ffmpeg']
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['cdn.unpuzzle.ai'],
    minimumCacheTTL: 60,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withSentryConfig(
  withAnalyzer(config),
  { silent: true },
  { hideSourcemaps: true }
);
```

### Phase 2: Core Architecture Implementation (Week 2)

#### 2.1 State Management Architecture
```typescript
// src/core/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createWrapper } from 'next-redux-wrapper';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Feature imports
import authReducer from '@features/auth/store/auth.slice';
import coursesReducer from '@features/courses/store/courses.slice';
import { coursesApi } from '@features/courses/store/courses.api';
import videoReducer from '@features/video-player/store/video.slice';

const rootReducer = {
  auth: authReducer,
  courses: coursesReducer,
  video: videoReducer,
  [coursesApi.reducerPath]: coursesApi.reducer,
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(coursesApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

#### 2.2 Performance-First Component Pattern
```typescript
// src/features/courses/components/CourseCard/CourseCard.tsx
import React, { memo, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@shared/components/ui/Card';
import { Skeleton } from '@shared/components/ui/Skeleton';
import type { Course } from '@features/courses/types/course.types';

// Lazy load heavy components
const EnrollmentButton = dynamic(
  () => import('../EnrollmentButton/EnrollmentButton'),
  { 
    loading: () => <Skeleton className="h-10 w-full" />,
    ssr: false 
  }
);

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact';
  onEnroll?: (courseId: string) => void;
}

export const CourseCard = memo<CourseCardProps>(({ 
  course, 
  variant = 'default',
  onEnroll 
}) => {
  const router = useRouter();

  const handleCardClick = useCallback(() => {
    router.push(`/courses/${course.id}`);
  }, [router, course.id]);

  const handleEnroll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEnroll?.(course.id);
  }, [onEnroll, course.id]);

  const formattedDuration = useMemo(() => {
    const hours = Math.floor(course.duration / 60);
    const minutes = course.duration % 60;
    return `${hours}h ${minutes}m`;
  }, [course.duration]);

  const imageUrl = useMemo(() => 
    course.thumbnail || '/images/course-placeholder.jpg',
    [course.thumbnail]
  );

  return (
    <Card 
      className="group cursor-pointer transition-all hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
          priority={false}
          quality={85}
          placeholder="blur"
          blurDataURL={course.thumbnailBlur || undefined}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {course.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>{formattedDuration}</span>
          <span>{course.enrollmentCount} enrolled</span>
        </div>
      </CardContent>
      {variant === 'default' && (
        <CardFooter className="p-4 pt-0">
          <EnrollmentButton 
            courseId={course.id}
            onClick={handleEnroll}
          />
        </CardFooter>
      )}
    </Card>
  );
});

CourseCard.displayName = 'CourseCard';
```

### Phase 3: Advanced Optimizations (Week 3)

#### 3.1 API Service Pattern with Caching
```typescript
// src/features/courses/store/courses.api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Course, CourseFilters } from '../types/course.types';

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/courses',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Course', 'Enrollment'],
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], CourseFilters>({
      query: (filters) => ({
        url: '',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Course' as const, id })),
              { type: 'Course', id: 'LIST' },
            ]
          : [{ type: 'Course', id: 'LIST' }],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
    getCourseById: builder.query<Course, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
      // Cache individual courses for 10 minutes
      keepUnusedDataFor: 600,
    }),
    enrollInCourse: builder.mutation<void, string>({
      query: (courseId) => ({
        url: `/${courseId}/enroll`,
        method: 'POST',
      }),
      // Optimistic update
      async onQueryStarted(courseId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          coursesApi.util.updateQueryData('getCourseById', courseId, (draft) => {
            draft.enrollmentCount += 1;
            draft.isEnrolled = true;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, courseId) => [
        { type: 'Course', id: courseId },
        { type: 'Enrollment', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useEnrollInCourseMutation,
} = coursesApi;
```

#### 3.2 Advanced Video Player with Performance
```typescript
// src/features/video-player/components/VideoPlayer/VideoPlayer.tsx
import React, { useRef, useCallback, useEffect, useState, memo } from 'react';
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver';
import { useVideoTime } from '../../hooks/useVideoTime';
import { useVideoAnalytics } from '../../hooks/useVideoAnalytics';
import VideoControls from './VideoControls';
import VideoOverlay from './VideoOverlay';

interface VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  videoId: string;
  annotations?: VideoAnnotation[];
}

export const VideoPlayer = memo<VideoPlayerProps>(({
  videoUrl,
  courseId,
  videoId,
  annotations = []
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const { currentTime, duration, updateTime } = useVideoTime();
  const { trackEvent } = useVideoAnalytics();
  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0.5,
    rootMargin: '50px'
  });

  // Pause when not visible
  useEffect(() => {
    if (!isVisible && isPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVisible, isPlaying]);

  // Request idle callback for non-critical updates
  const updateProgress = useCallback((time: number) => {
    requestIdleCallback(() => {
      updateTime(time);
      // Check for annotations at current time
      const activeAnnotations = annotations.filter(
        ann => ann.timestamp <= time && ann.timestamp + ann.duration > time
      );
      if (activeAnnotations.length > 0) {
        // Handle annotation display
      }
    });
  }, [updateTime, annotations]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      updateProgress(videoRef.current.currentTime);
    }
  }, [updateProgress]);

  // Performance: Use RAF for smooth playback
  useEffect(() => {
    let rafId: number;
    const updateLoop = () => {
      if (videoRef.current && isPlaying) {
        handleTimeUpdate();
        rafId = requestAnimationFrame(updateLoop);
      }
    };
    
    if (isPlaying) {
      rafId = requestAnimationFrame(updateLoop);
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPlaying, handleTimeUpdate]);

  return (
    <div ref={containerRef} className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        preload="metadata"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          updateTime(0, video.duration);
        }}
      />
      
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      )}
      
      <VideoControls
        videoRef={videoRef}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={() => {
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
          }
        }}
      />
      
      <VideoOverlay annotations={annotations} currentTime={currentTime} />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
```

### Phase 4: Testing & Quality Assurance (Week 4)

#### 4.1 Component Testing Strategy
```typescript
// src/features/courses/components/CourseCard/CourseCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CourseCard } from './CourseCard';
import { mockCourse } from '@tests/fixtures/courses';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('CourseCard', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders course information correctly', () => {
    render(<CourseCard course={mockCourse} />);
    
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.description)).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });

  it('navigates to course detail on click', () => {
    render(<CourseCard course={mockCourse} />);
    
    fireEvent.click(screen.getByRole('article'));
    
    expect(mockPush).toHaveBeenCalledWith(`/courses/${mockCourse.id}`);
  });

  it('lazy loads enrollment button in default variant', async () => {
    render(<CourseCard course={mockCourse} variant="default" />);
    
    // Initially shows skeleton
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    
    // Wait for lazy component to load
    const enrollButton = await screen.findByRole('button', { name: /enroll/i });
    expect(enrollButton).toBeInTheDocument();
  });
});
```

#### 4.2 E2E Testing
```typescript
// tests/e2e/course-enrollment.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Course Enrollment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/courses');
  });

  test('should display courses and allow enrollment', async ({ page }) => {
    // Wait for courses to load
    await expect(page.locator('[data-testid="course-card"]')).toHaveCount(6);
    
    // Click on first course
    await page.locator('[data-testid="course-card"]').first().click();
    
    // Should navigate to course detail
    await expect(page).toHaveURL(/\/courses\/[\w-]+/);
    
    // Click enroll button
    await page.locator('button:has-text("Enroll Now")').click();
    
    // Should show success message
    await expect(page.locator('[role="alert"]')).toContainText('Successfully enrolled');
    
    // Button should change to "Continue Learning"
    await expect(page.locator('button:has-text("Continue Learning")')).toBeVisible();
  });
});
```

### Phase 5: Performance Monitoring & Analytics (Week 5)

#### 5.1 Performance Monitoring Setup
```typescript
// src/core/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initWebVitals = () => {
  if (typeof window !== 'undefined') {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }
};

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
  
  // Also send to custom monitoring
  fetch('/api/analytics/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metric: metric.name,
      value: metric.value,
      id: metric.id,
      navigationType: metric.navigationType,
    }),
  });
}

// Custom performance marks
export const markPerformance = (name: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(name);
  }
};

export const measurePerformance = (name: string, startMark: string, endMark: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name)[0];
      sendToAnalytics({
        name: `custom_${name}`,
        value: measure.duration,
        id: crypto.randomUUID(),
      });
    } catch (e) {
      console.error('Performance measurement failed:', e);
    }
  }
};
```

## 📊 Performance Targets for 10/10 Score

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

### Bundle Size Targets
- **Initial JS**: < 100KB
- **Total JS**: < 300KB (excluding lazy loaded)
- **CSS**: < 50KB
- **Images**: Optimized with next-gen formats

### Runtime Performance
- **React DevTools Profiler**: No components > 16ms render
- **Memory Usage**: No memory leaks, stable heap size
- **CPU Usage**: < 50% during video playback

### Code Quality Metrics
- **TypeScript Coverage**: 100%
- **Test Coverage**: > 90%
- **Lighthouse Score**: 100/100
- **Bundle Analysis**: No duplicate dependencies

## 🚀 Migration Strategy

### Week 1: Setup & Foundation
1. Create new folder structure
2. Setup build tools and configurations
3. Install and configure testing framework
4. Setup CI/CD pipeline

### Week 2: Core Features Migration
1. Migrate authentication system
2. Migrate course features
3. Migrate video player
4. Setup state management

### Week 3: UI Components & Optimization
1. Build shared component library
2. Implement lazy loading
3. Add performance monitoring
4. Optimize images and assets

### Week 4: Testing & Quality
1. Write unit tests (target 90% coverage)
2. Write integration tests
3. Write E2E tests
4. Performance testing

### Week 5: Final Optimization & Launch
1. Bundle size optimization
2. Performance tuning
3. Security audit
4. Production deployment

## 🎯 Success Metrics

### Technical Metrics
- Build time: < 60 seconds
- Deploy time: < 2 minutes
- Page load time: < 1 second
- Time to Interactive: < 2 seconds

### Developer Experience
- Hot reload time: < 500ms
- TypeScript compile time: < 5 seconds
- Test suite run time: < 2 minutes
- Zero ESLint errors/warnings

### Business Metrics
- 50% reduction in page load time
- 30% improvement in user engagement
- 90% reduction in error rates
- 100% accessibility compliance

This comprehensive restructuring plan will transform your Unpuzzle project into a world-class, 10/10 efficiency application with enterprise-grade architecture, outstanding performance, and exceptional developer experience.