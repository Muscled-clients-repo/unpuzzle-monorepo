"use client";

import React, { useState, useEffect } from "react";
import "./settings.css";
import Image from "next/image";
import { 
  UserIcon, 
  CogIcon, 
  BellIcon, 
  EyeIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  AcademicCapIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  KeyIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
// Using simplified inline components instead of deleted UI components
import { useSettings } from "@/hooks/useSettings";

// Simple inline UI components to replace deleted ones
const TabsContext = React.createContext<{ activeTab: string; setActiveTab: (tab: string) => void } | null>(null);

const Tabs = ({ value, onValueChange, children }: { value: string; onValueChange: (value: string) => void; children: React.ReactNode }) => {
  const contextValue = {
    activeTab: value,
    setActiveTab: onValueChange
  };
  
  return (
    <TabsContext.Provider value={contextValue}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={className}>{children}</div>;
};

const TabsTrigger = ({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  
  return (
    <button
      className={`${className} ${isActive ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-600 border-gray-200'} px-4 py-2 border rounded-lg transition-colors`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  
  const { activeTab } = context;
  const isVisible = activeTab === value;
  
  if (!isVisible) return null;
  
  return <div className={className}>{children}</div>;
};

const Switch = ({ checked, onCheckedChange, className }: { checked: boolean; onCheckedChange: (checked: boolean) => void; className?: string }) => {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`${className} relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-gray-500 mt-2">{children}</p>;
};

const DialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-end gap-2 mt-6">{children}</div>;
};

interface SettingsState {
  // Profile settings
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatar: string;
    timeZone: string;
    language: string;
    publicProfile: boolean;
  };
  
  // Learning preferences
  learning: {
    autoplay: boolean;
    subtitles: boolean;
    playbackSpeed: number;
    quality: string;
    skipIntro: boolean;
    pauseOnBlur: boolean;
    continuousPlay: boolean;
    rememberPosition: boolean;
    downloadQuality: string;
  };
  
  // Notifications
  notifications: {
    email: {
      courseUpdates: boolean;
      newCourses: boolean;
      announcements: boolean;
      reminders: boolean;
      marketing: boolean;
    };
    push: {
      courseDeadlines: boolean;
      liveEvents: boolean;
      messages: boolean;
      achievements: boolean;
    };
    frequency: string;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  
  // Privacy & Security
  privacy: {
    profileVisibility: string;
    showProgress: boolean;
    showCertificates: boolean;
    allowMessages: boolean;
    dataSharing: boolean;
    analytics: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  
  // Appearance
  appearance: {
    theme: string;
    fontSize: string;
    contrast: string;
    reducedMotion: boolean;
    compactMode: boolean;
    sidebarCollapsed: boolean;
  };
  
  // Accessibility
  accessibility: {
    screenReader: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
    largeText: boolean;
    colorBlindMode: string;
    focusIndicator: boolean;
    animations: boolean;
  };
}

const defaultSettings: SettingsState = {
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatar: "",
    timeZone: "UTC",
    language: "en",
    publicProfile: false,
  },
  learning: {
    autoplay: false,
    subtitles: true,
    playbackSpeed: 1,
    quality: "auto",
    skipIntro: false,
    pauseOnBlur: true,
    continuousPlay: false,
    rememberPosition: true,
    downloadQuality: "720p",
  },
  notifications: {
    email: {
      courseUpdates: true,
      newCourses: false,
      announcements: true,
      reminders: true,
      marketing: false,
    },
    push: {
      courseDeadlines: true,
      liveEvents: true,
      messages: true,
      achievements: true,
    },
    frequency: "daily",
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  },
  privacy: {
    profileVisibility: "public",
    showProgress: true,
    showCertificates: true,
    allowMessages: true,
    dataSharing: false,
    analytics: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
  },
  appearance: {
    theme: "light",
    fontSize: "medium",
    contrast: "normal",
    reducedMotion: false,
    compactMode: false,
    sidebarCollapsed: false,
  },
  accessibility: {
    screenReader: false,
    keyboardNavigation: true,
    highContrast: false,
    largeText: false,
    colorBlindMode: "none",
    focusIndicator: true,
    animations: true,
  },
};

export default function SettingsClient() {
  const { settings, updateSettings, saveSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<SettingsState>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Initialize settings when component mounts
  useEffect(() => {
    setLocalSettings(defaultSettings);
  }, []);

  // Merge with saved settings
  useEffect(() => {
    if (settings) {
      setLocalSettings(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleSettingChange = (category: keyof SettingsState, key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedSettingChange = (category: keyof SettingsState, subCategory: string, key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...(prev[category] as any)[subCategory],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(localSettings);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    setHasChanges(true);
    setShowResetDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 settings-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">Manage your account and preferences</p>
            </div>
            {hasChanges && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-orange-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  Unsaved changes
                </span>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <AcademicCapIcon className="w-4 h-4" />
              Learning
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellIcon className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <PaintBrushIcon className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4" />
              Accessibility
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <Image
                    src={localSettings.profile.avatar || "/assets/userAvatar.svg"}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700">
                    <CogIcon className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium">{localSettings.profile.firstName} {localSettings.profile.lastName}</h4>
                  <p className="text-gray-500 text-sm">{localSettings.profile.email}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="text-sm text-blue-600 hover:underline">Change Photo</button>
                    <button className="text-sm text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={localSettings.profile.firstName}
                    onChange={(e) => handleSettingChange("profile", "firstName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={localSettings.profile.lastName}
                    onChange={(e) => handleSettingChange("profile", "lastName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={localSettings.profile.email}
                    onChange={(e) => handleSettingChange("profile", "email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select
                    value={localSettings.profile.timeZone}
                    onChange={(e) => handleSettingChange("profile", "timeZone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={localSettings.profile.bio}
                  onChange={(e) => handleSettingChange("profile", "bio", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Public Profile</h4>
                  <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                </div>
                <Switch
                  checked={localSettings.profile.publicProfile}
                  onCheckedChange={(checked) => handleSettingChange("profile", "publicProfile", checked)}
                  className="switch-enhanced"
                />
              </div>
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Video Player Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Autoplay Videos</h4>
                    <p className="text-sm text-gray-500">Automatically play the next video</p>
                  </div>
                  <Switch
                    checked={localSettings.learning.autoplay}
                    onCheckedChange={(checked) => handleSettingChange("learning", "autoplay", checked)}
                    className="switch-enhanced"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Subtitles</h4>
                    <p className="text-sm text-gray-500">Display captions when available</p>
                  </div>
                  <Switch
                    checked={localSettings.learning.subtitles}
                    onCheckedChange={(checked) => handleSettingChange("learning", "subtitles", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Pause on Tab Switch</h4>
                    <p className="text-sm text-gray-500">Pause video when you switch tabs</p>
                  </div>
                  <Switch
                    checked={localSettings.learning.pauseOnBlur}
                    onCheckedChange={(checked) => handleSettingChange("learning", "pauseOnBlur", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Remember Position</h4>
                    <p className="text-sm text-gray-500">Resume videos where you left off</p>
                  </div>
                  <Switch
                    checked={localSettings.learning.rememberPosition}
                    onCheckedChange={(checked) => handleSettingChange("learning", "rememberPosition", checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Playback Speed</label>
                  <select
                    value={localSettings.learning.playbackSpeed}
                    onChange={(e) => handleSettingChange("learning", "playbackSpeed", parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x (Normal)</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Quality</label>
                  <select
                    value={localSettings.learning.quality}
                    onChange={(e) => handleSettingChange("learning", "quality", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="auto">Auto</option>
                    <option value="1080p">1080p</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                    <option value="360p">360p</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Course Updates</h4>
                    <p className="text-sm text-gray-500">New lessons, assignments, and announcements</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications.email.courseUpdates}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "email", "courseUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Courses</h4>
                    <p className="text-sm text-gray-500">Recommendations and new course releases</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications.email.newCourses}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "email", "newCourses", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reminders</h4>
                    <p className="text-sm text-gray-500">Study reminders and deadlines</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications.email.reminders}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "email", "reminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing</h4>
                    <p className="text-sm text-gray-500">Promotions and special offers</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications.email.marketing}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "email", "marketing", checked)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Course Deadlines</h4>
                    <p className="text-sm text-gray-500">Assignment and quiz deadlines</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications.push.courseDeadlines}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "push", "courseDeadlines", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Live Events</h4>
                    <p className="text-sm text-gray-500">Webinars and live sessions</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications.push.liveEvents}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "push", "liveEvents", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Messages</h4>
                    <p className="text-sm text-gray-500">Direct messages from instructors</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications.push.messages}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "push", "messages", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Achievements</h4>
                    <p className="text-sm text-gray-500">Badges and completion certificates</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications.push.achievements}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "push", "achievements", checked)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Enable Quiet Hours</h4>
                  <p className="text-sm text-gray-500">No notifications during specified hours</p>
                </div>
                <Switch
                  checked={localSettings.notifications.quietHours.enabled}
                  onCheckedChange={(checked) => handleNestedSettingChange("notifications", "quietHours", "enabled", checked)}
                />
              </div>

              {localSettings.notifications.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={localSettings.notifications.quietHours.start}
                      onChange={(e) => handleNestedSettingChange("notifications", "quietHours", "start", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={localSettings.notifications.quietHours.end}
                      onChange={(e) => handleNestedSettingChange("notifications", "quietHours", "end", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                  <select
                    value={localSettings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="students">Students Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Learning Progress</h4>
                    <p className="text-sm text-gray-500">Display your course progress publicly</p>
                  </div>
                  <Switch
                    checked={localSettings.privacy.showProgress}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "showProgress", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Certificates</h4>
                    <p className="text-sm text-gray-500">Display earned certificates on profile</p>
                  </div>
                  <Switch
                    checked={localSettings.privacy.showCertificates}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "showCertificates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow Messages</h4>
                    <p className="text-sm text-gray-500">Let other users send you messages</p>
                  </div>
                  <Switch
                    checked={localSettings.privacy.allowMessages}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "allowMessages", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Sharing</h4>
                    <p className="text-sm text-gray-500">Share anonymized data for product improvement</p>
                  </div>
                  <Switch
                    checked={localSettings.privacy.dataSharing}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "dataSharing", checked)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Security</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {localSettings.privacy.twoFactorAuth && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                    <Switch
                      checked={localSettings.privacy.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange("privacy", "twoFactorAuth", checked)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <select
                    value={localSettings.privacy.sessionTimeout}
                    onChange={(e) => handleSettingChange("privacy", "sessionTimeout", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={480}>8 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Theme & Display</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["light", "dark", "auto"].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleSettingChange("appearance", "theme", theme)}
                        className={`p-3 rounded-lg border-2 capitalize ${
                          localSettings.appearance.theme === theme
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSettingChange("appearance", "fontSize", size)}
                        className={`p-3 rounded-lg border-2 capitalize ${
                          localSettings.appearance.fontSize === size
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Compact Mode</h4>
                    <p className="text-sm text-gray-500">Reduce spacing and padding for more content</p>
                  </div>
                  <Switch
                    checked={localSettings.appearance.compactMode}
                    onCheckedChange={(checked) => handleSettingChange("appearance", "compactMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reduce Motion</h4>
                    <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                  </div>
                  <Switch
                    checked={localSettings.appearance.reducedMotion}
                    onCheckedChange={(checked) => handleSettingChange("appearance", "reducedMotion", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Collapse Sidebar</h4>
                    <p className="text-sm text-gray-500">Start with sidebar collapsed by default</p>
                  </div>
                  <Switch
                    checked={localSettings.appearance.sidebarCollapsed}
                    onCheckedChange={(checked) => handleSettingChange("appearance", "sidebarCollapsed", checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Accessibility Options</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Screen Reader Support</h4>
                    <p className="text-sm text-gray-500">Optimize for screen readers</p>
                  </div>
                  <Switch
                    checked={localSettings.accessibility.screenReader}
                    onCheckedChange={(checked) => handleSettingChange("accessibility", "screenReader", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Keyboard Navigation</h4>
                    <p className="text-sm text-gray-500">Enhanced keyboard shortcuts and navigation</p>
                  </div>
                  <Switch
                    checked={localSettings.accessibility.keyboardNavigation}
                    onCheckedChange={(checked) => handleSettingChange("accessibility", "keyboardNavigation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">High Contrast</h4>
                    <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                  </div>
                  <Switch
                    checked={localSettings.accessibility.highContrast}
                    onCheckedChange={(checked) => handleSettingChange("accessibility", "highContrast", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Large Text</h4>
                    <p className="text-sm text-gray-500">Increase text size for better readability</p>
                  </div>
                  <Switch
                    checked={localSettings.accessibility.largeText}
                    onCheckedChange={(checked) => handleSettingChange("accessibility", "largeText", checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Blind Support</label>
                  <select
                    value={localSettings.accessibility.colorBlindMode}
                    onChange={(e) => handleSettingChange("accessibility", "colorBlindMode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia</option>
                    <option value="deuteranopia">Deuteranopia</option>
                    <option value="tritanopia">Tritanopia</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Focus Indicator</h4>
                    <p className="text-sm text-gray-500">Show enhanced focus indicators</p>
                  </div>
                  <Switch
                    checked={localSettings.accessibility.focusIndicator}
                    onCheckedChange={(checked) => handleSettingChange("accessibility", "focusIndicator", checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Reset All Settings</h4>
                <p className="text-sm text-gray-500">Reset all settings to default values</p>
              </div>
              <button
                onClick={() => setShowResetDialog(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Reset Settings
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete Account
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Settings Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Settings</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowResetDialog(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reset Settings
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}