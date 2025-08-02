/**
 * UI Components
 * Centralized exports for all UI components
 */

// Button Components - all consolidated in ./Buttons
export * from './Buttons'

// Data Display Components
export { default as Table, DataTable } from './Table'

// Loading & Skeleton Components - all consolidated in ./Loading
export * from './Loading'

// Error Handling Components
export { default as ErrorBoundary } from './ErrorBoundary'
export { default as ComponentErrorBoundary } from './ErrorBoundary' // Backward compatibility

// UI Components
export * from './Card'
export * from './Dialog'
export * from './Progress'
export * from './Switch'