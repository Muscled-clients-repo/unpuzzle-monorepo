"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  PaperClipIcon,
  ChevronDownIcon
} from "@heroicons/react/24/solid";
import { 
  HandThumbUpIcon,
  HandThumbDownIcon,
  FlagIcon
} from "@heroicons/react/24/outline";

interface VideoDetailViewProps {
  videoId?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  instructor?: {
    name: string;
    avatar?: string;
    bio?: string;
    subscribers?: number;
  };
  duration?: string;
  views?: number;
  likes?: number;
  uploadDate?: string;
  category?: string;
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
}

export default function VideoDetailView({
  videoId = "1",
  videoUrl = "/assets/WeAreGoingOnBullrun.mp4",
  title = "Advanced React Patterns: Building Scalable Applications",
  description = "In this comprehensive tutorial, we'll explore advanced React patterns including custom hooks, render props, compound components, and state management strategies. Perfect for developers looking to level up their React skills and build more maintainable applications.",
  instructor = {
    name: "Dr. Sarah Johnson",
    avatar: "/assets/user1.png",
    bio: "Senior Software Engineer with 10+ years of experience",
    subscribers: 45000
  },
  duration = "45:30",
  views = 125000,
  likes = 8900,
  uploadDate = "2 weeks ago",
  category = "Web Development",
  attachments = [
    { name: "Course Materials.pdf", size: "2.5 MB", type: "pdf" },
    { name: "Source Code.zip", size: "1.2 MB", type: "zip" },
    { name: "Slides.pptx", size: "5.8 MB", type: "pptx" }
  ]
}: VideoDetailViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [userSaved, setUserSaved] = useState(false);

  const handleLike = () => {
    setUserLiked(!userLiked);
    setUserDisliked(false);
  };

  const handleDislike = () => {
    setUserDisliked(!userDisliked);
    setUserLiked(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group">
              <video
                className="w-full h-full object-contain"
                src={videoUrl}
                poster="/assets/thumbnailWeb.svg"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                           bg-white/20 backdrop-blur-md rounded-full p-6 hover:bg-white/30
                           transition-all duration-200 group/play"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-12 w-12 text-white" />
                  ) : (
                    <PlayIcon className="h-12 w-12 text-white" />
                  )}
                </button>
                
                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setIsPlaying(!isPlaying)}>
                          {isPlaying ? (
                            <PauseIcon className="h-5 w-5 text-white" />
                          ) : (
                            <PlayIcon className="h-5 w-5 text-white" />
                          )}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)}>
                          {isMuted ? (
                            <SpeakerXMarkIcon className="h-5 w-5 text-white" />
                          ) : (
                            <SpeakerWaveIcon className="h-5 w-5 text-white" />
                          )}
                        </button>
                        <span className="text-white text-sm">{duration}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button>
                          <Cog6ToothIcon className="h-5 w-5 text-white" />
                        </button>
                        <button>
                          <ArrowsPointingOutIcon className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
              
              {/* Stats and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <EyeIcon className="h-5 w-5" />
                    <span>{views?.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{uploadDate}</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      userLiked 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span className="font-medium">{likes?.toLocaleString()}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`p-2 rounded-lg transition-colors ${
                      userDisliked 
                        ? "bg-red-100 text-red-700" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <HandThumbDownIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <ShareIcon className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setUserSaved(!userSaved)}
                    className={`p-2 rounded-lg transition-colors ${
                      userSaved 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <BookmarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="mt-6 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-200">
                    {instructor.avatar ? (
                      <Image
                        src={instructor.avatar}
                        alt={instructor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                    <p className="text-sm text-gray-600">{instructor.subscribers?.toLocaleString()} subscribers</p>
                    <p className="text-sm text-gray-500 mt-1">{instructor.bio}</p>
                  </div>
                </div>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Description */}
              <div className="mt-6">
                <div className={`text-gray-700 ${!showDescription ? 'line-clamp-3' : ''}`}>
                  {description}
                </div>
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  {showDescription ? 'Show less' : 'Show more'}
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${showDescription ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {['overview', 'comments', 'resources'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-4 font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">What you'll learn</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">Advanced React patterns and best practices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">State management strategies for large applications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">Performance optimization techniques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">Testing strategies and implementation</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span>No comments yet. Be the first to comment!</span>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Downloadable Resources</h3>
                    <div className="space-y-3">
                      {attachments?.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{attachment.name}</p>
                              <p className="text-sm text-gray-500">{attachment.size}</p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Videos</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3 cursor-pointer group">
                    <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src="/assets/thumbnailWeb.svg"
                        alt="Related video"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600">
                        React Performance Optimization - Part {i}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Dr. Sarah Johnson</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>23K views</span>
                        <span>•</span>
                        <span>1 week ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}