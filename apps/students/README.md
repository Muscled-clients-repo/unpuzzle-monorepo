# Unpuzzle AI - AI-Powered Educational Video Platform

Transform the way students learn with interactive video content, AI-powered learning assistants, and real-time collaboration tools.

## 🚀 Overview

Unpuzzle AI is a comprehensive educational technology platform that combines video-based learning with advanced AI features to enhance student engagement and learning outcomes. Built with Next.js and TypeScript, it provides educators with powerful tools to create interactive courses while giving students an immersive learning experience.

## ✨ Features

### 🎓 Course Management
- Create and organize courses with multiple chapters
- YouTube integration and direct video uploads
- Course pricing and visibility controls
- Comprehensive course catalog with search functionality
- Support for public and private courses

### 🤖 AI Learning Assistants
- **Puzzle Hint**: Provides contextual hints when students need help
- **Puzzle Check**: Interactive quizzes for knowledge testing
- **Puzzle Reflect**: Encourages deep learning through reflection
- **Puzzle Path**: Personalized learning path recommendations

### 🎬 Advanced Video Editor
- Multi-track timeline editor
- AI voice generation with script editing
- Screen, audio, and camera recording capabilities
- Export with multiple format options
- Real-time preview and editing

### 📝 Interactive Annotations
- Text, audio, and video annotations
- Timeline-based placement
- Real-time collaboration
- Comment threads for student-teacher discussions
- Annotation categorization (Annotations vs Confusions)

### 📊 Analytics Dashboard
- Course engagement metrics
- Student progress tracking
- Pause summary analytics
- Performance insights
- Activity logs and user behavior analysis

### 💳 Subscription Management
- Multiple pricing tiers:
  - **Free Tier**: Basic features for individual learners
  - **Plus Plan** ($100/month): Team collaboration, custom dashboards
  - **Enterprise Plan** ($200/month): Unlimited users, premium support
- Stripe payment integration
- Subscription management portal

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Authentication**: Custom Auth (@unpuzzle/auth)
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS v4
- **Payment**: Stripe
- **Real-time**: Socket.io
- **UI Components**: Radix UI
- **Video**: Wavesurfer.js, Custom video player
- **Media**: React Media Recorder

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- Git
- Backend API server running (see Environment Setup)
- Stripe account for payments (optional)

## 🔧 Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Configure required environment variables:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=your_backend_api_url
   
   # Stripe Payment (Optional)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   # Socket.io Configuration (Required for real-time features)
   NEXT_PUBLIC_SOCKET_URL=your_socket_server_url
   
   # Additional Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Ensure your backend API is running and accessible at the configured URL

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Muscled-clients-repo/unpuzzle-ai-next.git
   cd unpuzzle-ai-next
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables (see Environment Setup section)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
unpuzzle-ai-next/
├── app/
│   ├── api/              # API routes
│   │   ├── activity-logs/
│   │   ├── orders/
│   │   └── puzzel-path/
│   ├── components/       # React components
│   │   ├── screens/      # Page-level components
│   │   ├── shared/       # Reusable components
│   │   └── dashboard/    # Dashboard components
│   ├── context/          # React contexts and providers
│   ├── hooks/            # Custom React hooks
│   ├── redux/            # Redux store, slices, and services
│   │   ├── features/     # Redux slices
│   │   └── services/     # API service definitions
│   ├── types/            # TypeScript type definitions
│   └── [routes]/         # Next.js page routes
├── public/               # Static assets
│   └── assets/          # Images, icons, videos
├── middleware.ts         # Next.js middleware
└── ...config files
```

## 👥 User Roles

The platform supports four distinct user roles with different permissions:

- **Students**: Access courses, view content, interact with AI assistants, submit assignments
- **Teachers**: Create courses, manage content, add annotations, view analytics
- **Administrators**: Platform management, user management, system analytics
- **Moderators**: Content moderation, review submissions, manage comments

## 🔌 API Documentation

### Internal API Endpoints

- `GET /api/activity-logs?videoId={id}` - Fetch video activity logs
- `POST /api/orders` - Create payment intents for subscriptions
- `GET /api/puzzel-path?videoId={id}&endTime={time}` - Generate AI learning paths
- `GET/POST /api/puzzel-reflects` - Manage reflection data and audio

### External Backend API

The application connects to a backend API (configured via `NEXT_PUBLIC_API_URL`) for:
- User authentication and management
- Course CRUD operations
- Video storage and streaming
- AI agent responses
- Real-time collaboration features

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Use functional components with React hooks
- Follow existing TypeScript patterns
- Maintain consistent file and folder structure
- Add proper types for all props and state
- Use meaningful variable and function names
- Comment complex logic

### Commit Message Format

```
type(scope): Brief description

Longer explanation if needed

Closes #123
```

Types: feat, fix, docs, style, refactor, test, chore

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify `NEXT_PUBLIC_API_URL` is correctly set
   - Ensure backend server is running
   - Check for CORS configuration

2. **Authentication Issues**
   - Verify authentication service is properly configured
   - Clear browser cache and cookies
   - Check backend API authentication endpoints

3. **Video Upload Problems**
   - Verify file size limits (default: 100MB)
   - Check supported formats: MP4, WebM, MOV
   - Ensure proper API permissions

4. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Delete `node_modules` and reinstall
   - Check for TypeScript errors: `npm run type-check`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## 📄 License

This project is proprietary software. All rights reserved.

## 💬 Support

- **Documentation**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/Muscled-clients-repo/unpuzzle-ai-next/issues)
- **Email**: support@unpuzzle.ai
- **Community**: [Coming Soon]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Custom authentication system (@unpuzzle/auth)
- Payments powered by [Stripe](https://stripe.com/)

---

Made with ❤️ by the Unpuzzle AI Team