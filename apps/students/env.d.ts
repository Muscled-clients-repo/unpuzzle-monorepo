declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_CORE_SERVER_URL: string;
    NEXT_PUBLIC_M1_SERVER_URL?: string;
    NEXT_PUBLIC_STUDENT_APP_URL?: string;
    NEXT_PUBLIC_INSTRUCTOR_APP_URL?: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
    CLERK_SECRET_KEY?: string;
  }
} 