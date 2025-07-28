'use client'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { addTransition } from '../../../../redux/features/videoEditor/videoEditorSlice';

interface TransitionType {
  id: string;
  name: string;
  type: 'fade' | 'dissolve' | 'wipe' | 'slide';
  duration: number;
  preview: string;
}

const transitions: TransitionType[] = [
  {
    id: 'fade',
    name: 'Fade',
    type: 'fade',
    duration: 1,
    preview: '▢ → ▣'
  },
  {
    id: 'dissolve',
    name: 'Dissolve',
    type: 'dissolve',
    duration: 1,
    preview: '▤ ⟷ ▤'
  },
  {
    id: 'wipe-left',
    name: 'Wipe Left',
    type: 'wipe',
    duration: 1,
    preview: '▌→ ▐'
  },
  {
    id: 'wipe-right',
    name: 'Wipe Right',
    type: 'wipe',
    duration: 1,
    preview: '▐ ← ▌'
  },
  {
    id: 'slide-left',
    name: 'Slide Left',
    type: 'slide',
    duration: 1,
    preview: '◀ ▶'
  },
  {
    id: 'slide-right',
    name: 'Slide Right',
    type: 'slide',
    duration: 1,
    preview: '▶ ◀'
  }
];

interface TransitionPickerProps {
  onClose: () => void;
  fromClipId: string;
  toClipId: string;
  position: { x: number; y: number };
}

const TransitionPicker: React.FC<TransitionPickerProps> = ({
  onClose,
  fromClipId,
  toClipId,
  position
}) => {
  const dispatch = useDispatch();
  const [selectedTransition, setSelectedTransition] = useState<TransitionType | null>(null);
  const [duration, setDuration] = useState(1);

  const handleApply = () => {
    if (!selectedTransition) return;

    dispatch(addTransition({
      id: `transition-${Date.now()}`,
      type: selectedTransition.type,
      duration,
      fromClipId,
      toClipId,
      startTime: 0 // This would be calculated based on clip positions
    }));

    onClose();
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-xl p-4 w-80"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add Transition</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {transitions.map((transition) => (
          <button
            key={transition.id}
            onClick={() => setSelectedTransition(transition)}
            className={`
              p-3 rounded-lg border-2 transition-all
              ${selectedTransition?.id === transition.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="text-2xl mb-1">{transition.preview}</div>
            <div className="text-sm font-medium">{transition.name}</div>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration: {duration}s
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={duration}
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          disabled={!selectedTransition}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default TransitionPicker;