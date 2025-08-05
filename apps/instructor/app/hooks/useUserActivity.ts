import { useState, useCallback, useEffect } from "react";
import { useGetActivityLogsQuery } from '../redux/hooks';

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

export const useUserActivityContext = (): UserActivityContextType => {
  const [videoId, setVideoId] = useState<string>('');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useGetActivityLogsQuery(videoId, {
    skip: !videoId
  });

  useEffect(() => {
    if (data) {
      setActivityLogs(data);
    }
  }, [data]);

  const getActivityLogs = useCallback(async (newVideoId: string): Promise<ActivityLog[]> => {
    setVideoId(newVideoId);
    setManualLoading(true);
    setManualError(null);
    
    try {
      const result = await refetch();
      const logs = result.data || [];
      setActivityLogs(logs);
      return logs;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch activity logs';
      setManualError(errorMessage);
      return [];
    } finally {
      setManualLoading(false);
    }
  }, [refetch]);

  const updateActivityLogs = useCallback((logs: ActivityLog[]) => {
    setActivityLogs(logs);
  }, []);

  const clearActivityLogs = useCallback(() => {
    setActivityLogs([]);
    setManualError(null);
  }, []);

  return {
    activityLogs,
    loading: isLoading || manualLoading,
    error: error?.message || manualError,
    getActivityLogs,
    updateActivityLogs,
    clearActivityLogs,
    setLoading: setManualLoading,
    setError: setManualError,
  };
};