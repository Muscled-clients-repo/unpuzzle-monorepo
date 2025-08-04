import * as React from "react"
import { cn } from "../../../lib/utils"

// 1. Define types for Card component props
interface CardProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
}

// 2. Define Card component with forwardRef
const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

// 3. Define types for CardHeader component props
interface CardHeaderProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
}

// 4. Define CardHeader component with forwardRef
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// 5. Define types for CardTitle component props
interface CardTitleProps extends React.HTMLProps<HTMLHeadingElement> {
  className?: string
}

// 6. Define CardTitle component with forwardRef
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// 7. Define types for CardDescription component props
interface CardDescriptionProps extends React.HTMLProps<HTMLParagraphElement> {
  className?: string
}

// 8. Define CardDescription component with forwardRef
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// 9. Define types for CardContent component props
interface CardContentProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
}

// 10. Define CardContent component with forwardRef
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

// 11. Define types for CardFooter component props
interface CardFooterProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
}

// 12. Define CardFooter component with forwardRef
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// 13. Export all the components
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
