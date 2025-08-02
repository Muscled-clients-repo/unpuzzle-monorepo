/**
 * Alternative entry point with named exports
 * This provides a more tree-shakeable structure
 */

// Group similar components together
export * as Components from './components'
export * as Layout from './layout'
export * as SEO from './seo'
export * as Utils from './utils'

// Also provide direct exports for convenience
export * from './components'
export * from './layout'
export * from './seo'
export * from './utils'