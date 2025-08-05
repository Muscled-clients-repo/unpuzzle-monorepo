"use client";

import React from "react";
import { Clock, Calendar, User, Hash } from "lucide-react";

interface AgentDetailCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  timestamp?: number;
  createdAt: string;
  userId?: string;
  userName?: string;
  agentId: string;
  children: React.ReactNode;
  headerGradient?: string;
}

const AgentDetailCard: React.FC<AgentDetailCardProps> = ({
  title,
  subtitle,
  icon,
  timestamp,
  createdAt,
  userId,
  userName,
  agentId,
  children,
  headerGradient = "from-blue-500 to-purple-600"
}) => {
  // Format timestamp to MM:SS
  const formatTimestamp = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
            {icon}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Metadata List */}
        <div className="space-y-4 pb-6 border-b border-gray-200">
          {timestamp !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Timestamp</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatTimestamp(timestamp)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Created</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(createdAt)}
            </span>
          </div>
          {userName && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">Student</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {userName}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Hash className="w-4 h-4" />
              <span className="text-sm">ID</span>
            </div>
            <span className="text-sm font-medium text-gray-900 font-mono" title={agentId}>
              {agentId.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Agent-specific content */}
        <div className="pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AgentDetailCard;