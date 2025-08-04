import React, { useState, useEffect } from "react";
import { useOptionalAuth } from "../../../../hooks/useOptionalAuth";

interface Event {
  id: string;
  created_at: string;
  updated_at: string;
  type: "images" | "audio" | "loom";
  loom_link: string | null;
  user_id: string;
  video_id: string;
  title: string;
  images?: string[];
  audio_url?: string;
}

function getLoomEmbedUrl(url: string | null) {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  if (url.includes('/share/')) return url.replace('/share/', '/embed/');
  return url;
}

const PuzzleReflect = () => {
  // Use the same videoId as NewVideoPlayer component
  const videoId = "uQsyobT2Rv8";
  const { getToken } = useOptionalAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedMediaIdx, setSelectedMediaIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('videoId:', videoId);
        if (videoId) {
          // Call the local API endpoint directly
          const response = await fetch(`/api/puzzel-reflects?videoId=${encodeURIComponent(videoId)}&endTime=60`);
          console.log('API response:', response);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const responseData = await response.json();
          console.log('Response data:', responseData);
          
          // Extract events from the response
          const allEvents = responseData.data?.completion || responseData.completion || [];
          console.log('Parsed events:', allEvents);
          
          setEvents(allEvents);
          setDebugInfo(`videoId: ${videoId}, response type: ${typeof responseData}, events count: ${allEvents.length}`);
        } else {
          setDebugInfo('No videoId found');
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError("Failed to load puzzle reflects.");
        setDebugInfo(`Error: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [videoId]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedMediaIdx(null);
  };

  const handleBackClick = () => {
    setSelectedEvent(null);
    setSelectedMediaIdx(null);
  };

  const closeModal = () => {
    setSelectedMediaIdx(null);
  };

  if (loading) {
    return <div className="bg-white rounded-lg p-4">Loading...</div>;
  }
  if (error) {
    return <div className="bg-white rounded-lg p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg">
     
      
      {selectedEvent ? (
        <div className="p-3 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackClick}
              className="text-gray-600 hover:text-gray-800 gap-4 flex items-center space-x-1 cursor-pointer font-inter text-xs font-medium leading-normal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 6.50022C16 5.99043 15.5867 5.57717 15.077 5.57717L3.15164 5.57717L6.49913 2.23002C6.85962 1.86957 6.85965 1.28512 6.49919 0.924634C6.13874 0.564142 5.5543 0.564113 5.19381 0.924568L0.270388 5.84749C0.0972624 6.0206 0 6.25539 0 6.50022C0 6.74504 0.0972624 6.97984 0.270388 7.15295L5.19381 12.0759C5.5543 12.4363 6.13874 12.4363 6.49919 12.0758C6.85965 11.7153 6.85962 11.1309 6.49913 10.7704L3.15164 7.42327L15.077 7.42327C15.5867 7.42327 16 7.01 16 6.50022Z" fill="#1D1D1D"/>
              </svg>
              <span className="text-sm text-[#1D1D1D] font-inter text-sm font-semibold leading-normal">
                {selectedEvent.type === 'images' ? 'Screenshot' : 
                 selectedEvent.type === 'audio' ? 'Voice Memo' : 'Loom Video'}
              </span>
            </button>
            <div className="text-[#00AFF0] font-inter text-sm font-medium leading-normal">
              {formatTime(selectedEvent.created_at)}
            </div>
          </div>

          {/* Images as Loom video if loom_link exists */}
          {selectedEvent.type === 'images' && selectedEvent.loom_link && (
            <div className="rounded-lg border border-[#E4E4E4] bg-[#F9F9F9] p-3">
              <iframe
                className="w-full h-64 rounded-lg"
                src={getLoomEmbedUrl(selectedEvent.loom_link)}
                frameBorder="0"
                allowFullScreen
                title="Loom Video"
              />
            </div>
          )}

          {/* Audio */}
          {selectedEvent.type === 'audio' && (
            <div className="rounded-lg border border-[#E4E4E4] bg-[#F9F9F9] p-3 flex flex-col items-center">
              {selectedEvent.audio_url ? (
                <audio src={selectedEvent.audio_url} controls className="w-full" />
              ) : (
                <span className="text-gray-500">No audio available</span>
              )}
              <div className="text-[#606060] font-inter text-xs font-normal leading-[24px] mt-2">Voice Memo</div>
            </div>
          )}

          {/* Loom Video */}
          {selectedEvent.type === 'loom' && selectedEvent.loom_link && (
            <div className="rounded-lg border border-[#E4E4E4] bg-[#F9F9F9] p-3">
              <iframe
                className="w-full h-64 rounded-lg"
                src={getLoomEmbedUrl(selectedEvent.loom_link)}
                frameBorder="0"
                allowFullScreen
                title="Loom Video"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="">
          <div className="grid grid-cols-4 gap-4 mb-3 font-medium text-gray-700">
            <div className="h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Time</div>
            <div className="col-span-2 h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Type</div>
            <div className="h-12 flex items-center text-[#212636] font-inter text-sm font-medium leading-[21px]">Action</div>
          </div>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="grid grid-cols-4 gap-4 items-center">
                <div className="text-[#212636] font-inter text-sm font-medium leading-[21px] h-12 flex items-center">
                  {formatTime(event.created_at)}
                </div>
                <div className="text-[#212636] font-inter text-sm font-medium leading-[21px] col-span-2 h-12 flex items-center">
                  {event.type === 'images' ? 'Screenshot' : 
                   event.type === 'audio' ? 'Voice Memo' : 'Loom Video'}
                </div>
                <div className="h-12 flex items-center">
                  <button
                    className="bg-black text-white font-inter text-xs font-medium leading-normal px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleReflect;