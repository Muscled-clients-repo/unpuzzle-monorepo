'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import {
  setSnappingEnabled,
  setShowAlignmentGuides,
  addMarker,
  clearMarkers
} from '../../../../../redux/features/videoEditor/videoEditorSlice';

const SnappingControls: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    snappingEnabled, 
    showAlignmentGuides, 
    currentTime,
    markers 
  } = useSelector((state: RootState) => state.videoEditor);

  const handleAddMarker = () => {
    dispatch(addMarker(currentTime));
  };

  return (
    <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50 border-b border-gray-200">
      {/* Snapping Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => dispatch(setSnappingEnabled(!snappingEnabled))}
          className={`
            flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${snappingEnabled 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          title="Toggle Snapping (Alt+S)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 3H5C3.9 3 3 3.9 3 5V9C3 10.1 3.9 11 5 11H9C10.1 11 11 10.1 11 9V5C11 3.9 10.1 3 9 3ZM9 9H5V5H9V9Z"/>
            <path d="M19 3H15C13.9 3 13 3.9 13 5V9C13 10.1 13.9 11 15 11H19C20.1 11 21 10.1 21 9V5C21 3.9 20.1 3 19 3ZM19 9H15V5H19V9Z"/>
            <path d="M9 13H5C3.9 13 3 13.9 3 15V19C3 20.1 3.9 21 5 21H9C10.1 21 11 20.1 11 19V15C11 13.9 10.1 13 9 13ZM9 19H5V15H9V19Z"/>
            <path d="M19 13H15C13.9 13 13 13.9 13 15V19C13 20.1 13.9 21 15 21H19C20.1 21 21 20.1 21 19V15C21 13.9 20.1 13 19 13ZM19 19H15V15H19V19Z"/>
            <path d="M12 8H8V12H12V8Z" opacity={snappingEnabled ? "1" : "0.3"}/>
            <path d="M16 8H12V12H16V8Z" opacity={snappingEnabled ? "1" : "0.3"}/>
            <path d="M12 12H8V16H12V12Z" opacity={snappingEnabled ? "1" : "0.3"}/>
            <path d="M16 12H12V16H16V12Z" opacity={snappingEnabled ? "1" : "0.3"}/>
          </svg>
          <span>Snapping</span>
        </button>
      </div>

      {/* Alignment Guides Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => dispatch(setShowAlignmentGuides(!showAlignmentGuides))}
          disabled={!snappingEnabled}
          className={`
            flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${showAlignmentGuides && snappingEnabled
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
            ${!snappingEnabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title="Toggle Alignment Guides"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 11H21V13H3V11Z"/>
            <path d="M11 3H13V21H11V3Z"/>
            <path d="M7 7L17 17" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
            <path d="M17 7L7 17" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
          </svg>
          <span>Guides</span>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Marker Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleAddMarker}
          className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors"
          title="Add Marker at Playhead (M)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l4.25 2.52.77-1.28-3.52-2.09V7z"/>
          </svg>
          <span>Add Marker</span>
        </button>
        
        {markers.length > 0 && (
          <button
            onClick={() => dispatch(clearMarkers())}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
            title="Clear All Markers"
          >
            Clear ({markers.length})
          </button>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Snap Info */}
      <div className="text-xs text-gray-500">
        {snappingEnabled ? (
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8"/>
            </svg>
            <span>Snapping active</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8"/>
            </svg>
            <span>Snapping disabled</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default SnappingControls;