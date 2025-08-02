/**
 * UI Components
 * Centralized exports for all UI components
 */

// Authentication & User Components
export * from './UserButton'
export * from './UserStatus'

// Course Components  
export * from './CourseEnrollButton'

// Navigation Components
import NavigationBackButton from './navigation-back-button'
import CrossAppNavigation from './cross-app-navigation'
export { NavigationBackButton, CrossAppNavigation }

// Data Display Components
import DataTable from './data-table'
import OptimizedImage from './optimized-image'
export { DataTable, OptimizedImage }

// Form & Input Components
import BaseButton from './base-button'
export { BaseButton }

// Loading & Skeleton Components
import LoadingIndicator from './loading-indicator'
import PageLoadingSpinner from './page-loading-spinner'
export { LoadingIndicator, PageLoadingSpinner }
export * from './loading'

// Error Handling Components
import ApiErrorHandler from './api-error-handler'
import ComponentErrorBoundary from './component-error-boundary'
export { ApiErrorHandler, ComponentErrorBoundary }

// Wrapper Components
import ClientSideWrapper from './client-side-wrapper'
export { ClientSideWrapper }

// SEO Components (moved to separate module)
export { default as SEOBreadcrumb } from './seo-breadcrumb'
export { default as SEOStructuredData } from './seo-structured-data'

// Re-export UI sub-components
export * from './ui'