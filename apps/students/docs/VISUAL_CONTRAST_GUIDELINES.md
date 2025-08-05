# Visual Contrast Guidelines

## ❌ NEVER DO THIS
- `bg-white text-white` - White text on white background
- `bg-gray-50 text-gray-100` - Light text on light background  
- `bg-black text-gray-900` - Dark text on dark background

## ✅ ALWAYS USE PROPER CONTRAST

### For Buttons and Interactive Elements

#### Success/Enrolled States
```jsx
// ✅ Good contrast
<div className="bg-green-600 text-white">Enrolled</div>
<div className="bg-emerald-700 text-white">Success</div>

// ✅ Alternative with border for extra definition
<div className="bg-green-600 text-white border border-green-700">Enrolled</div>
```

#### Warning/Pending States
```jsx
// ✅ Good contrast
<div className="bg-yellow-500 text-black">Pending</div>
<div className="bg-amber-600 text-white">Processing</div>
```

#### Error States
```jsx
// ✅ Good contrast
<div className="bg-red-600 text-white">Failed</div>
<div className="bg-red-700 text-white">Error</div>
```

#### Primary Actions
```jsx
// ✅ Good contrast
<div className="bg-blue-600 text-white">Buy Now</div>
<div className="bg-purple-600 text-white">Enroll</div>
```

### For Status Indicators

#### Light Background with Dark Text
```jsx
// ✅ Good contrast
<div className="bg-green-100 text-green-800">Success</div>
<div className="bg-yellow-100 text-yellow-800">Warning</div>
<div className="bg-red-100 text-red-800">Error</div>
```

## Contrast Testing

Before implementing any UI component:

1. **Visual Test**: Can you clearly read the text?
2. **Accessibility Test**: Does it meet WCAG contrast requirements?
3. **Different Screens**: Test on various screen brightness levels

## Quick Fix for Existing Issues

If you find white-on-white or poor contrast:

```jsx
// ❌ Bad
<div className="bg-white text-white">Text</div>

// ✅ Quick fix - use solid color with explicit text color
<div className="bg-green-600 text-white">Text</div>

// ✅ Or use light background with dark text
<div className="bg-green-100 text-green-800">Text</div>
```

## Component-Specific Guidelines

### Enrollment Buttons
- **Enrolled State**: `bg-green-600 text-white` or `bg-green-100 text-green-800`
- **Available State**: `bg-blue-600 text-white` or `bg-blue-100 text-blue-800`

### Order Status
- **Paid**: `bg-green-100 text-green-800` with `text-green-600` icon
- **Pending**: `bg-yellow-100 text-yellow-800` with `text-yellow-600` icon
- **Failed**: `bg-red-100 text-red-800` with `text-red-600` icon

### Loading States
- Use `bg-gray-100 text-gray-800` or `bg-blue-100 text-blue-800`
- Never use `bg-white` without sufficient contrast

Remember: **User experience is more important than aesthetic preferences. Always prioritize readability and accessibility.**