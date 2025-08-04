'use client';

import { useUnpuzzleAiApi } from '../hooks/useUnpuzzleAiApi';
import { useEffect, useState } from 'react';

export default function UnpuzzleAiApiHealth() {
  const { apiUrl, get} = useUnpuzzleAiApi();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);


  // Example of GET request with query parameters
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await get('/api/health');
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h1>Unpuzzle AI API Health Check</h1>
      <p>API URL: {apiUrl}/api/health</p>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && <div>
        <p>Status: {data.message}</p>
        <p>Timestamp: {data.timestamp}</p>
        <p>Status: {data.success ? 'Healthy' : 'Unhealthy'}</p>
      </div>}
    </div>
  );
} 