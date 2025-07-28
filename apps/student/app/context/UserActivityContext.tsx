import React, { createContext, useState, useCallback, ReactNode } from "react";

interface ActivityLog {
  id: string;
  videoId: string;
  timestamp: number;
  action: string;
  details?: any;
  [key: string]: any;
}

interface UserActivityContextType {
  activityLogs: ActivityLog[];
  loading: boolean;
  error: string | null;
  getActivityLogs: (videoId: string) => Promise<ActivityLog[]>;
  updateActivityLogs: (logs: ActivityLog[]) => void;
  clearActivityLogs: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(
  undefined
);

const UserActivityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getActivityLogs = useCallback(
    async (videoId: string): Promise<ActivityLog[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/activity-logs?videoId=${encodeURIComponent(videoId)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch activity logs");
        }

        const { data } = await response.json();
        setActivityLogs(data);
        return data;
      } catch (error: any) {
        console.error("Error fetching activity logs:", error);
        const errorMessage = error.message || "Failed to fetch activity logs";
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateActivityLogs = useCallback((logs: ActivityLog[]) => {
    setActivityLogs(logs);
  }, []);

  const clearActivityLogs = useCallback(() => {
    setActivityLogs([]);
    setError(null);
  }, []);

  return (
    <UserActivityContext.Provider
      value={{
        activityLogs,
        loading,
        error,
        getActivityLogs,
        updateActivityLogs,
        clearActivityLogs,
        setLoading,
        setError,
      }}
    >
      {children}
    </UserActivityContext.Provider>
  );
};

export { UserActivityContext, UserActivityProvider };
