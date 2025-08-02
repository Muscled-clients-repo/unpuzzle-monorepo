/**
 * @unpuzzle/ui Package
 * Centralized UI components library for Unpuzzle platform
 * Uses named exports for better tree-shaking
 */

// Components
export {
  // User components
  UserButton,
  UserStatus,
  // Course components  
  CourseEnrollButton,
  // Navigation
  NavigationBackButton,
  CrossAppNavigation,
  // Data display
  DataTable,
  OptimizedImage,
  // Forms
  BaseButton,
  // Loading
  LoadingIndicator,
  PageLoadingSpinner,
  // Error handling
  ApiErrorHandler,
  ComponentErrorBoundary,
  // Wrappers
  ClientSideWrapper,
  // SEO Components
  SEOBreadcrumb,
  SEOStructuredData
} from './src/components'

// Layout
export {
  Header,
  Footer
} from './src/layout'

// SEO utilities
export {
  generateSEOMetadata,
  generateOrganizationSchema,
  generateCourseSchema,
  generateBreadcrumbSchema,
  generateVideoSchema,
  generateFAQSchema
} from './src/seo'

// Loading components
export {
  CourseDetailSkeleton,
  ContentCardSkeleton,
  CourseGridSkeleton,
  TableRowSkeleton,
  CourseListSkeleton,
  CourseCardSkeleton,
  LayoutSkeleton
} from './src/components/loading'

// UI Sub-components
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ContentCard
} from './src/components/ui'

// UI Components with default exports
import LoadingSpinner from './src/components/ui/loading-spinner'
export { LoadingSpinner }

// Modal Dialog exports
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from './src/components/ui/modal-dialog'

export {
  Progress
} from './src/components/ui/progress-indicator'

export {
  Switch
} from './src/components/ui/toggle-switch'