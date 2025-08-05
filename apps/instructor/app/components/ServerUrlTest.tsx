'use client';

import React, { useEffect, useState } from 'react';

export default function ServerUrlTest() {
  const [serverUrl, setServerUrl] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_APP_SERVER_URL || 'http://localhost:3001';
    setServerUrl(url);

    // Test connection to server
    const testConnection = async () => {
      try {
        const response = await fetch(`${url}/health`, { 
          method: 'GET',
          timeout: 5000 
        } as any);
        
        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('failed');
        }
      } catch (error) {
        console.log('Server connection test failed:', error);
        setConnectionStatus('failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Backend Server Connection Test</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Server URL:</strong> {serverUrl}</p>
        <p>
          <strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded ${
            connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
            connectionStatus === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {connectionStatus === 'checking' && 'Checking...'}
            {connectionStatus === 'connected' && '✅ Connected'}
            {connectionStatus === 'failed' && '❌ Connection Failed'}
          </span>
        </p>
        <p className="text-xs text-gray-600">
          This component tests if the frontend can reach the backend server running on port 3001.
        </p>
      </div>
    </div>
  );
}