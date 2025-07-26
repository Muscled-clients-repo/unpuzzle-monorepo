'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/Dialog';
import { Progress } from '../../../../components/ui/Progress';
import { videoExportService } from '../../../../services/videoExport.service';

interface ExportSettings {
  format: 'mp4' | 'webm' | 'mov';
  quality: 'low' | 'medium' | 'high' | '4k';
  fps: 24 | 30 | 60;
  includeAudio: boolean;
}

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoClips: any[];
  aiAudioClips: any[];
  onExportComplete: (exportedVideoUrl: string) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  videoClips,
  aiAudioClips,
  onExportComplete,
}) => {
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'mp4',
    quality: 'high',
    fps: 30,
    includeAudio: true,
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<string>('');

  const qualitySettings = {
    low: { width: 854, height: 480, bitrate: '1M' },
    medium: { width: 1280, height: 720, bitrate: '2.5M' },
    high: { width: 1920, height: 1080, bitrate: '5M' },
    '4k': { width: 3840, height: 2160, bitrate: '20M' },
  };

  // Cleanup FFmpeg on unmount
  useEffect(() => {
    return () => {
      videoExportService.terminate();
    };
  }, []);

  const startExport = async () => {
    if (videoClips.length === 0) {
      alert('No video clips to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('Initializing export engine...');

    try {
      // Initialize FFmpeg if not already done
      await videoExportService.initialize();
      setExportStatus('Export engine ready');

      // Export the video
      const exportedBlob = await videoExportService.exportVideo(
        videoClips,
        aiAudioClips,
        [], // Text overlays - to be implemented
        {
          ...exportSettings,
          resolution: qualitySettings[exportSettings.quality],
          onProgress: (progress) => {
            setExportProgress(progress);
            setExportStatus(`Exporting video... ${Math.round(progress)}%`);
          }
        }
      );

      // Create download URL
      const exportUrl = URL.createObjectURL(exportedBlob);
      
      setExportStatus('Export completed!');
      
      // Trigger download
      const a = document.createElement('a');
      a.href = exportUrl;
      a.download = `export-${Date.now()}.${exportSettings.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Notify parent
      onExportComplete(exportUrl);
      
      // Cleanup after delay
      setTimeout(() => {
        URL.revokeObjectURL(exportUrl);
        setIsExporting(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => {
        setIsExporting(false);
      }, 3000);
    }
  };

  const formatSizeEstimate = () => {
    if (videoClips.length === 0) return '0 MB';
    
    const totalDuration = videoClips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
    const quality = qualitySettings[exportSettings.quality];
    const bitrateNum = parseFloat(quality.bitrate);
    const estimatedMB = Math.round((totalDuration * bitrateNum * 0.125));
    
    return `~${estimatedMB} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Video</DialogTitle>
        </DialogHeader>

        {!isExporting ? (
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['mp4', 'webm', 'mov'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportSettings(prev => ({ ...prev, format }))}
                    className={`p-2 border rounded-lg text-sm ${
                      exportSettings.format === format
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(qualitySettings).map(([quality, settings]) => (
                  <button
                    key={quality}
                    onClick={() => setExportSettings(prev => ({ ...prev, quality: quality as any }))}
                    className={`p-3 border rounded-lg text-sm ${
                      exportSettings.quality === quality
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{quality === '4k' ? '4K' : quality.charAt(0).toUpperCase() + quality.slice(1)}</div>
                    <div className="text-xs text-gray-500">
                      {settings.width} x {settings.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frame Rate
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([24, 30, 60] as const).map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setExportSettings(prev => ({ ...prev, fps }))}
                    className={`p-2 border rounded-lg text-sm ${
                      exportSettings.fps === fps
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Options */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportSettings.includeAudio}
                  onChange={(e) => setExportSettings(prev => ({ 
                    ...prev, 
                    includeAudio: e.target.checked 
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Include Audio</span>
              </label>
            </div>

            {/* Export Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated size:</span>
                <span className="font-medium">{formatSizeEstimate()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Video clips:</span>
                <span className="font-medium">{videoClips.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">AI voice clips:</span>
                <span className="font-medium">{aiAudioClips.length}</span>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startExport}
                disabled={videoClips.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Export Video
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Exporting Video
              </h3>
              <p className="text-sm text-gray-600 mb-4">{exportStatus}</p>
              
              <div className="space-y-2">
                <Progress value={exportProgress} className="w-full" />
                <p className="text-sm text-gray-500">
                  {Math.round(exportProgress)}% complete
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;