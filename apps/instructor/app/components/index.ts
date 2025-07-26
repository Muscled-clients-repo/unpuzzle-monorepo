/**
 * Component Library Index
 * Centralized export point for all components with semantic organization
 */

// =====================================
// UI - Basic user interface components
// =====================================
export { Button, type ButtonProps } from './ui/Button';
export { Input, type InputProps } from './ui/Input';
export { Text, type TextProps } from './ui/Text';
export { Icon, type IconProps } from './ui/Icon';
export { Avatar } from './ui/Avatar';
export { Switch } from './ui/Switch';
export { Progress } from './ui/Progress';
export { default as Loading } from './ui/Loading';
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './ui/Card';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
export { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';
export { ScrollArea } from './ui/ScrollArea';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/Accordion';

// =====================================
// FORMS - Form-related components
// =====================================
export { SearchBox, type SearchBoxProps } from './forms/SearchBox';

// =====================================
// CONTENT - Content display components
// =====================================
export { CourseCard, type CourseCardMoleculeProps } from './content/CourseCard';
export { default as PaymentCard } from './content/PaymentCard';
export { NavigationLink } from './content/NavigationLink';
export { default as CommentBox } from './content/CommentBox';
export { CourseContent, type CourseContentProps, type CourseVideo, type CourseModule } from './content/CourseContent';
export { VideoPlayer, type VideoPlayerProps } from './content/VideoPlayer';

// =====================================
// TEMPLATES - Page-level components
// =====================================
// Note: Templates are typically page-specific and may not need global exports

// =====================================
// FEATURES - Feature-specific components
// =====================================
export { CourseContentInstructor } from './features/course/CourseContentInstructor';
export { VideoPlayerInstructor } from './features/video/VideoPlayerInstructor';
export { PricingPlans } from './features/pricing/PricingPlans';

// =====================================
// AUTH - Authentication components
// =====================================
export { default as UserSync } from './auth/UserSync';

// =====================================
// LAYOUT - Layout and navigation components
// =====================================
export { default as Sidebar } from './layout/Sidebar';
export { default as SidebarWithAuth } from './layout/SidebarWithAuth';

// =====================================
// COMMON - Common utility components
// =====================================
export { default as ClientOnly } from './common/ClientOnly';
export { default as GoBack } from './common/GoBack';
export { 
  Skeleton as SkeletonLoader, 
  CourseGridSkeleton, 
  CourseCardSkeleton, 
  TableRowSkeleton, 
  shimmerKeyframes 
} from './common/SkeletonLoader';
export { default as Table } from './common/Table';

// =====================================
// NAVIGATION - Navigation-related components
// =====================================
export { NavigationLoader } from './navigation/NavigationLoader';

// =====================================
// PAGES - Page-level components
// =====================================
export { default as CourseScreen } from './pages/CourseScreen';
export { default as MyCoursesScreen } from './pages/MyCoursesScreen';
export { default as SettingScreen } from './pages/SettingScreen';
// AssetsScreen uses react-media-recorder which requires Worker API (client-only)
// Import directly: import dynamic from 'next/dynamic'; const AssetsScreen = dynamic(() => import('@/components/pages/AssetsScreen'), { ssr: false });
export { default as PuzzleContentScreen } from './pages/puzzle/PuzzleContentScreen';
export { default as RecentPuzzleCard } from './pages/puzzle/RecentPuzzleCard';
export { UnpuzzleJourneyCard } from './pages/puzzle/UnpuzzleJourneyCard';
export { default as Overview } from './pages/overview/Overview';

// =====================================
// MODALS - Modal dialog components
// =====================================
export { default as CreateCourseModal } from './modals/CreateCourseModal';
export { default as SelectCourseVideoModal } from './modals/SelectCourseVideoModal';
export { default as CreateChaptersModal } from './modals/CreateChaptersModal';
export { default as CreateQuizModal } from './modals/CreateQuizModal';
export { default as AddCourseChapterModal } from './modals/AddCourseChapterModal';
export { default as AddCourseVideoModal } from './modals/AddCourseVideoModal';

// =====================================
// VIDEO - Video-related components
// =====================================
export { default as VideoJourney } from './video/VideoScreen/VideoJourney';
export { default as VideoJourneyDetail } from './video/VideoScreen/VideoJourneyDetail';
export { default as VideoScreen } from './video/VideoScreen';
export { default as VideoDetailSection } from './video/VideoDetailSection';
export { default as AnnotationHeader } from './video/AnnotationHeader';
export { default as AnnotationsPuzzleJourney } from './video/annotations/AnnotationsPuzzleJourney';
export { default as Comments } from './video/annotations/Comments';
export { ViewAllCommentContext as ViewAllComments } from './video/annotations/ViewAllComments';

// =====================================
// ANALYTICS - Analytics and stats components
// =====================================
export { default as AIAgents } from './analytics/AIAgents';
export { default as AgentLogs } from './analytics/AgentLogs';
export { default as VideoStats } from './analytics/VideoStats';

// =====================================
// RECORDING - Screen recording components
// =====================================
export { default as ScreenRecording } from './recording/ScreenRecording';
export { default as ScreenRecordingClient } from './recording/ScreenRecordingClient';

// =====================================
// TYPE EXPORTS
// =====================================
export type { Video } from '@/types/videos.types';
export type { Course } from '@/types/course.types';

// =====================================
// COMPONENT USAGE GUIDELINES
// =====================================
/**
 * RECOMMENDED USAGE:
 * 
 * 1. PREFER UI components for basic interface elements:
 *    - Button, Input, Text, Icon, Card, Dialog, etc.
 * 
 * 2. PREFER FORMS components for form-related functionality:
 *    - SearchBox, form combinations, etc.
 * 
 * 3. PREFER CONTENT components for data display:
 *    - CourseCard, VideoPlayer, PaymentCard, etc.
 * 
 * 4. USE FEATURES for domain-specific variants:
 *    - CourseContentInstructor, VideoPlayerInstructor, etc.
 * 
 * 5. USE LAYOUT for structural components:
 *    - Sidebar, navigation, page layouts
 * 
 * 6. USE COMMON for utility components:
 *    - Loading states, tables, client-only wrappers
 * 
 * SEMANTIC STRUCTURE:
 * - ui/ = Basic reusable UI elements
 * - forms/ = Form and input components  
 * - content/ = Data display and content components
 * - layout/ = Page structure and navigation
 * - features/ = Domain-specific implementations
 * - common/ = Shared utilities and helpers
 * - auth/ = Authentication-related components
 * - templates/ = Page-level templates
 */