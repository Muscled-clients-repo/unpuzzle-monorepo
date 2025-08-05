"use client";

import React from 'react';
import { useAuth } from '@unpuzzle/auth';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

// Student profile and settings page - Personal information, preferences, and account settings
export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      {/* Verification Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
        <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-900">Important Notice</h3>
          <p className="text-sm text-amber-700 mt-1">
            All information provided here will be included in your certificates. To issue official certificates, 
            we may need to verify your identity with government-issued ID (e.g., passport, driver's license, national ID).
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Picture and Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={user?.image_url || "/assets/profileUser.svg"} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg">
                <CameraIcon className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user?.first_name || 'Student'}
              </h3>
              <p className="text-gray-600">{user?.email || 'No email provided'}</p>
              <p className="text-gray-500 text-sm">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
              <div className="mt-2 flex items-center">
                <CheckBadgeIcon className="h-5 w-5 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Email Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management - All User Data */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <UserIcon className="h-6 w-6 mr-2" />
            Account Information
          </h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                defaultValue={user?.first_name || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                defaultValue={user?.last_name || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  defaultValue={user?.email || ''} 
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10" 
                  placeholder="Enter your email"
                />
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <input 
                  type="tel" 
                  defaultValue={user?.phone || ''} 
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10" 
                  placeholder="+1 (555) 123-4567"
                />
                <PhoneIcon className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea 
                rows={3} 
                defaultValue={user?.bio || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
              <input 
                type="text" 
                defaultValue={user?.title || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="e.g. Software Developer, Designer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input 
                type="date" 
                defaultValue={user?.date_of_birth || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
              />
            </div>
          </form>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <MapPinIcon className="h-6 w-6 mr-2" />
            Address Information
          </h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input 
                type="text" 
                defaultValue={user?.address?.street || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="123 Main St, Apt 4B"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                type="text" 
                defaultValue={user?.address?.city || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
              <input 
                type="text" 
                defaultValue={user?.address?.state || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
              <input 
                type="text" 
                defaultValue={user?.address?.zip || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="10001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input 
                type="text" 
                defaultValue={user?.address?.country || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="United States"
              />
            </div>
          </form>
        </div>

        {/* Social Media Profiles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <GlobeAltIcon className="h-6 w-6 mr-2" />
            Social Media Profiles
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input 
                type="url" 
                defaultValue={user?.social?.linkedin || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <input 
                type="url" 
                defaultValue={user?.social?.github || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
              <input 
                type="url" 
                defaultValue={user?.social?.twitter || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="https://twitter.com/yourusername"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
              <input 
                type="url" 
                defaultValue={user?.social?.website || ''} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="https://yourwebsite.com"
              />
            </div>
          </form>
        </div>

        {/* Certificates Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <AcademicCapIcon className="h-6 w-6 mr-2" />
            Certificate Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name on Certificate</label>
              <input 
                type="text" 
                defaultValue={user?.certificate_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim()} 
                className="w-full border border-gray-300 rounded px-3 py-2" 
                placeholder="How your name should appear on certificates"
              />
              <p className="text-xs text-gray-500 mt-1">This is how your name will appear on all certificates</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Verification Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email Verification</span>
                  <span className="text-sm text-green-600 font-medium">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Identity Verification</span>
                  <span className="text-sm text-orange-600 font-medium">Pending</span>
                </div>
                <button className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                  Complete Identity Verification
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Your Certificates</h4>
              <p className="text-gray-600 text-sm">No certificates earned yet. Complete courses to earn certificates!</p>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Learning Preferences</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Learning Pace</label>
              <select defaultValue={user?.preferences?.learning_pace || 'self-paced'} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="self-paced">Self-paced</option>
                <option value="structured">Structured</option>
                <option value="intensive">Intensive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Quality</label>
              <select defaultValue={user?.preferences?.video_quality || 'auto'} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="auto">Auto</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="4k">4K</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Playback Speed</label>
              <select defaultValue={user?.preferences?.playback_speed || '1x'} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="0.5x">0.5x</option>
                <option value="0.75x">0.75x</option>
                <option value="1x">1.0x</option>
                <option value="1.25x">1.25x</option>
                <option value="1.5x">1.5x</option>
                <option value="2x">2.0x</option>
              </select>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="autoplay" 
                defaultChecked={user?.preferences?.autoplay || false}
                className="mr-2" 
              />
              <label htmlFor="autoplay" className="text-sm text-gray-700">Enable autoplay for next lesson</label>
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <h4 className="font-medium">Change Password</h4>
                <p className="text-gray-600 text-sm">Update your account password</p>
              </div>
              <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                Change
              </button>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Enable
              </button>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-gray-600 text-sm">Permanently delete your account and all data</p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}