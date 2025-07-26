'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { addTextOverlay, updateTextOverlay, removeTextOverlay } from '../../../../../redux/features/videoEditor/videoEditorSlice';

interface TextOverlayEditorProps {
  overlayId?: string;
  onClose: () => void;
}

const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Courier New'
];

const TextOverlayEditor: React.FC<TextOverlayEditorProps> = ({ overlayId, onClose }) => {
  const dispatch = useDispatch();
  const { textOverlays, currentTime, duration } = useSelector((state: RootState) => state.videoEditor);
  
  const existingOverlay = overlayId ? textOverlays.find(o => o.id === overlayId) : null;
  
  const [text, setText] = useState(existingOverlay?.text || '');
  const [startTime, setStartTime] = useState(existingOverlay?.startTime || currentTime);
  const [endTime, setEndTime] = useState(existingOverlay?.endTime || Math.min(currentTime + 5, duration));
  const [fontSize, setFontSize] = useState(existingOverlay?.style.fontSize || 24);
  const [fontFamily, setFontFamily] = useState(existingOverlay?.style.fontFamily || 'Arial');
  const [color, setColor] = useState(existingOverlay?.style.color || '#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState(existingOverlay?.style.backgroundColor || '');
  const [bold, setBold] = useState(existingOverlay?.style.bold || false);
  const [italic, setItalic] = useState(existingOverlay?.style.italic || false);
  const [position, setPosition] = useState(existingOverlay?.position || { x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    const overlayData = {
      id: overlayId || `text-${Date.now()}`,
      text,
      startTime,
      endTime,
      position,
      style: {
        fontSize,
        fontFamily,
        color,
        backgroundColor,
        bold,
        italic
      }
    };

    if (overlayId) {
      dispatch(updateTextOverlay({ id: overlayId, updates: overlayData }));
    } else {
      dispatch(addTextOverlay(overlayData));
    }

    onClose();
  };

  const handleDelete = () => {
    if (overlayId && window.confirm('Delete this text overlay?')) {
      dispatch(removeTextOverlay(overlayId));
      onClose();
    }
  };

  // Handle dragging in preview
  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = position.x;
    const startPosY = position.y;

    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newX = Math.max(0, Math.min(100, startPosX + (deltaX / rect.width) * 100));
      const newY = Math.max(0, Math.min(100, startPosY + (deltaY / rect.height) * 100));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {overlayId ? 'Edit Text Overlay' : 'Add Text Overlay'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview (drag to position)
            </label>
            <div 
              ref={previewRef}
              className="relative bg-gray-900 rounded-lg overflow-hidden"
              style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
            >
              <div
                className={`absolute cursor-move select-none ${isDragging ? 'opacity-75' : ''}`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${fontSize}px`,
                  fontFamily,
                  color,
                  backgroundColor: backgroundColor || 'transparent',
                  padding: backgroundColor ? '8px 12px' : '0',
                  borderRadius: '4px',
                  fontWeight: bold ? 'bold' : 'normal',
                  fontStyle: italic ? 'italic' : 'normal'
                }}
                onMouseDown={handlePreviewMouseDown}
              >
                {text || 'Your text here...'}
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter your text..."
            />
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time (seconds)
              </label>
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(parseFloat(e.target.value))}
                min={0}
                max={duration}
                step={0.1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time (seconds)
              </label>
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(parseFloat(e.target.value))}
                min={startTime}
                max={duration}
                step={0.1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Font Settings */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <input
                type="range"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                min={12}
                max={72}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">{fontSize}px</div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color (optional)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={backgroundColor || '#000000'}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="None"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Style Options */}
          <div className="flex items-center space-x-4 mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={bold}
                onChange={(e) => setBold(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">Bold</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={italic}
                onChange={(e) => setItalic(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">Italic</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <div>
              {overlayId && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {overlayId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextOverlayEditor;