# Unpuzzle Project - Components and Pages Analysis

## Overview
This document provides a comprehensive breakdown of all components and pages in the Unpuzzle project, organized by user role: Instructor/Teacher, Student, Admin, and Moderator views.

## 1. INSTRUCTOR/TEACHER VIEW

### Pages
| Route | Description |
|-------|-------------|
| `/teacher-annotations` | Main teacher annotations interface |
| `/editor` | Video editor for creating educational content |
| `/my-assets` | Asset management dashboard |
| `/videos` | Video listing and management |
| `/courses` | Course creation and management |

### Key Components

#### Video Annotation Teacher Components
- **VideoTeacherScreen.tsx** - Main interface for teacher video viewing and annotation
- **CourseContent.tsx** - Lists course content with chapter organization
- **CourseInstructorDetail.tsx** - Displays instructor information and course details
- **NewVideoPlayer.tsx** - Custom video player with teacher-specific controls
- **AddCourseChapterModal.tsx** - Modal for adding new chapters to courses
- **AddCourseVideoModal.tsx** - Modal for adding videos to courses
- **CreateQuizModal.tsx** - Interface for creating interactive quizzes
- **PuzzlePieceContent.tsx** - Management of puzzle piece educational content

#### Video Editor Components
- **VideoEditorScreen.tsx** - Main video editing interface
- **VideoEditorToolsEnhanced.tsx** - Advanced editing tools and controls
- **VideoEditorTimeline.tsx** - Timeline for video editing
- **CourseVideoPlayer.tsx** - Video player optimized for editing
- **Timeline Components**:
  - TimelineContainer.tsx - Main timeline container
  - ClipEditorFixed.tsx - Individual clip editing
  - VideoTrackWithSnapping.tsx - Video track with snap-to-grid
  - TimeRuler.tsx - Time measurement ruler

#### Course Management
- **CreateCourseModal.tsx** - Course creation interface
- **CreateChaptersModal.tsx** - Chapter organization modal
- **SelectCourseVideoModal.tsx** - Video selection for courses

## 2. STUDENT VIEW

### Pages
| Route | Description |
|-------|-------------|
| `/student-annotations` | Student annotation viewing |
| `/student-view/[id]` | Dynamic student view for specific content |
| `/my-courses` | Enrolled courses dashboard |
| `/all-courses` | Browse all available courses |
| `/puzzle-content` | Interactive puzzle content |
| `/annotations-puzzlejourney` | Annotation-based learning journey |
| `/confusions-puzzlejourney` | Confusion clarification journey |

### Key Components

#### Video Components
- **VideoScreen.tsx** - Main video viewing interface for students
- **VideoDetailSection.tsx** - Detailed video information display
- **NewVideoPlayer.tsx** - Student-optimized video player
- **VideoStats.tsx** - Learning statistics and progress
- **AIAgents.tsx** - AI-powered learning assistants
- **AgentLogs.tsx** - AI interaction history

#### Puzzle Content Components
- **PuzzleContentScreen.tsx** - Main puzzle interface
- **UnpuzzleJourneyCard.tsx** - Learning journey cards
- **RecentPuzzleCard.tsx** - Recently accessed puzzles

#### Annotations Puzzle Journey
- **AnnotationsPuzzleJourney.tsx** - Main journey interface
- **Comments.tsx** - Student comments and discussions
- **JourneyAudioAnnotation.tsx** - Audio-based annotations
- **JourneyTextAnnotation.tsx** - Text-based annotations
- **JourneyVideoAnnotation.tsx** - Video-based annotations
- **ViewAllComments.tsx** - Comprehensive comment view

#### Course Components
- **MyCoursesScreen.tsx** - Personal course dashboard
- **CourseScreen.tsx** - Course viewing interface
- **CourseCard.tsx** - Course preview cards
- **CourseContent.tsx** - Course content organization

## 3. ADMIN VIEW

### Pages
| Route | Description |
|-------|-------------|
| `/admin` | Main admin dashboard |
| `/admin/dashboard/overview` | System overview and metrics |
| `/admin/dashboard/analytics` | Comprehensive analytics |
| `/admin/dashboard/analytics/[courseId]` | Course-specific analytics |
| `/admin/dashboard/analytics/[courseId]/[videoId]` | Video-specific analytics |

### Key Components
- **AdminScreen.tsx** - Teacher account request management
- **AdminSidebar.tsx** - Admin navigation menu
- **AdminLayout.tsx** - Admin interface layout
- **Dashboard Components**:
  - CourseCatalog.tsx - Course catalog management
  - ARDChart.tsx - Analytics visualization
  - PauseSummaryChart.tsx - Video pause analytics
  - Videos.tsx - Video management interface

## 4. MODERATOR VIEW

### Pages
| Route | Description |
|-------|-------------|
| `/moderator-view` | Main moderator interface |
| `/moderator` | Moderator dashboard |

### Key Components
- **VIdeoScreen.tsx** - Moderator video review interface
- **CourseContent.tsx** - Course content moderation
- **CourseInstructorDetail.tsx** - Instructor information review
- **NewVideoPlayer.tsx** - Video player with moderation tools
- **PuzzleHint.tsx** - Hint management for puzzles
- **PuzzleReflect.tsx** - Reflection content management

## 5. SHARED COMPONENTS

### Authentication & User Management
- **LoginScreen.tsx** - User login interface
- **SignUpScreen.tsx** - New user registration
- **ClerkUserSync.tsx** - Clerk authentication integration
- **SettingScreen.tsx** - User settings and preferences

### Navigation
- **Sidebar.tsx** - Main navigation sidebar
- **SidebarWithClerk.tsx** - Clerk-integrated sidebar
- **Header.tsx** - Application header

### Payment Integration
- **Pricing.tsx** - Subscription pricing display
- **PaymentCard.tsx** - Payment method management
- **StripeGateway.tsx** - Stripe payment processing

### Common UI Components
- **Dialog Components**: Modal dialogs and popups
- **Media Players**: AudioContainer, CustomAudioPlayer
- **Interactive Elements**: QuizContainer, CommentBox
- **UI Elements**: Cards, Avatars, Tabs, etc.

## Navigation Structure

### Role-Based Menu Items (from menu-list.ts)

**Teacher Menu**:
- Editor
- Assets
- Videos
- Courses
- Settings

**Student Menu**:
- All Courses
- My Courses
- Puzzle Content
- Settings

**Admin Menu**:
- Admin Dashboard
- Courses
- Settings

## Technical Architecture

### State Management
- Redux for global state management
- Context API for video time synchronization
- Local state for component-specific data

### Key Features by Role

**Teachers**:
- Video editing and annotation
- Course creation and management
- Quiz and puzzle creation
- Asset management

**Students**:
- Course enrollment and progress tracking
- Interactive video viewing
- Puzzle solving and annotations
- AI-assisted learning

**Admins**:
- User management
- Analytics and reporting
- System configuration
- Content moderation

**Moderators**:
- Content review and approval
- Hint and reflection management
- Quality assurance

This architecture supports a comprehensive e-learning platform with distinct experiences for different user roles while sharing common components and infrastructure.