// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVER_URL || 'https://dev.nazmulcodes.org';
export const M1_BASE_URL = process.env.NEXT_PUBLIC_M1_SERVER_URL || API_BASE_URL;

// App URLs for cross-app navigation
export const STUDENT_APP_URL = process.env.NEXT_PUBLIC_STUDENT_APP_URL || 'https://unpuzzle-mono-repo-frontend.vercel.app';
export const INSTRUCTOR_APP_URL = process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL || 'https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app';

// API Endpoints
export const API_ENDPOINTS = {
  // Base API URL (for Redux services)
  BASE: `${API_BASE_URL}/api`,
  
  // Specific endpoints
  AUTH: `${API_BASE_URL}/api/auth`,
  COURSES: `${API_BASE_URL}/api/courses`,
  VIDEOS: `${API_BASE_URL}/api/videos`,
  PUZZLES: `${API_BASE_URL}/api/puzzles`,
  USERS: `${API_BASE_URL}/api/users`,
  PERMISSIONS: `${API_BASE_URL}/api/permissions`,
  ENROLLMENTS: `${API_BASE_URL}/api/enrollments`,
  QUIZZES: `${API_BASE_URL}/api/quizzes`,
  SCRIPTS: `${API_BASE_URL}/api/scripts`,
  STRIPE: `${API_BASE_URL}/api/stripe`,
  
  // M1 Server endpoints
  M1: {
    BASE: M1_BASE_URL,
    SOCKET: M1_BASE_URL, // For WebSocket connections
  }
};

// WebSocket configuration
export const SOCKET_URL = process.env.NEXT_PUBLIC_M1_SERVER_URL || API_BASE_URL;