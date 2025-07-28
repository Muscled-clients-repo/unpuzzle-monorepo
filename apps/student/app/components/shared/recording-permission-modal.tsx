'use client'
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/modal-dialog';

interface RecordingWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: 'refresh' | 'navigate' | 'close';
}

const RecordingWarningModal: React.FC<RecordingWarningModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  action,
}) => {
  const getActionText = () => {
    switch (action) {
      case 'refresh':
        return 'refresh this page';
      case 'navigate':
        return 'navigate away from this page';
      case 'close':
        return 'close this tab';
      default:
        return 'leave this page';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Recording in Progress</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-red-800">
                Screen recording is currently active
              </p>
              <p className="text-xs text-red-600">
                Your recording will be lost if you continue
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-700">
            <p className="mb-2">
              You are about to <strong>{getActionText()}</strong> while recording is in progress.
            </p>
            <p className="text-gray-600">
              This will stop the recording and <strong>all recorded content will be lost</strong>.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              💡 What you can do instead:
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Stop the recording first, then navigate</li>
              <li>• Minimize this window instead of closing it</li>
              <li>• Open a new tab for other websites</li>
              <li>• Use Ctrl+Shift+R to check recording status</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Stay on Page
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Recording & {action === 'refresh' ? 'Refresh' : 'Leave'}
            </button>
          </div>

          <div className="text-xs text-center text-gray-500">
            Your recording will be automatically saved when you stop it properly
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingWarningModal;