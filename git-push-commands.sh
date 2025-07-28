#!/bin/bash

# Git commands to push the latest changes

echo "📝 Adding all changes to git..."
git add .

echo "📸 Creating commit..."
git commit -m "feat: Complete student app production setup with authentication

- Integrated Clerk authentication with sign-in/sign-up pages
- Built professional home page with hero, features, and CTAs
- Updated all API URLs to use NEXT_PUBLIC_CORE_SERVER_URL
- Fixed hardcoded localhost URLs in Redux services
- Created centralized API configuration
- Enhanced middleware for route protection
- Updated TypeScript definitions
- Added cross-app navigation component
- Configured proper environment variables for production
- Updated layout to exclude sidebar on home/auth pages

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Done! Changes have been pushed to GitHub."