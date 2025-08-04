import { Course } from "@/app/types/course.types";
import { API_ENDPOINTS } from "@/app/config/api.config";

export async function getCourseById(courseId: string, customHeaders?: HeadersInit): Promise<Course | null> {
  // Validate courseId
  if (!courseId || typeof courseId !== 'string' || courseId.trim() === '') {
    console.error('getCourseById: Invalid courseId provided');
    return null;
  }
  
  try {
    // Convert Headers object to plain object if needed
    const headersObj: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (customHeaders) {
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => {
          headersObj[key] = value;
        });
      } else {
        Object.assign(headersObj, customHeaders);
      }
    }
    
    const response = await fetch(`${API_ENDPOINTS.COURSES}/${courseId}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: headersObj,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result)
    return result.body || result;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export async function getAllCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.COURSES}`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const {body} = await response.json();
    return body
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function getPopularCourses(limit: number = 8): Promise<Course[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.COURSES}?limit=${limit}&sort=popular&page=1`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch popular courses: ${response.statusText}`);
    }

    const result = await response.json();
    return result.body?.data || result.data || [];
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    return [];
  }
}

export async function getCoursesByCategory(category: string): Promise<Course[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.COURSES}?category=${encodeURIComponent(category)}`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses by category: ${response.statusText}`);
    }

    const result = await response.json();
    return result.body?.data || result.data || [];
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    return [];
  }
}

export async function searchCourses(query: string): Promise<Course[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.COURSES}/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search courses: ${response.statusText}`);
    }

    const result = await response.json();
    return result.body?.data || result.data || [];
  } catch (error) {
    console.error("Error searching courses:", error);
    return [];
  }
}