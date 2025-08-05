import React from 'react';

// Student profile and settings page - Personal information, preferences, and account settings
export default function ProfilePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Management</h2>
          
          {/* TODO: Add profile picture and basic info */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-2xl">👤</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-gray-600">john.doe@example.com</p>
                <p className="text-gray-500 text-sm">Member since January 2024</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Change Profile Picture
            </button>
          </div>

          {/* TODO: Add profile form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow text-left">
              <h3 className="text-xl font-bold mb-4">Personal Information</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" value="John" className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value="Doe" className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value="john.doe@example.com" className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value="+1 (555) 123-4567" className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Update Profile
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow text-left">
              <h3 className="text-xl font-bold mb-4">Learning Preferences</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Learning Pace</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2">
                    <option>Self-paced</option>
                    <option>Structured</option>
                    <option>Intensive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Quality</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2">
                    <option>Auto</option>
                    <option>720p</option>
                    <option>1080p</option>
                    <option>4K</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Playback Speed</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2">
                    <option>1.0x</option>
                    <option>1.25x</option>
                    <option>1.5x</option>
                    <option>2.0x</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="autoplay" className="mr-2" />
                  <label htmlFor="autoplay" className="text-sm text-gray-700">Enable autoplay for next lesson</label>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save Preferences
                </button>
              </form>
            </div>
          </div>

          {/* TODO: Add security settings */}
          <div className="bg-white p-6 rounded-lg shadow text-left">
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
          
          <p className="text-gray-500 mt-6">
            TODO: Implement profile updates, preference saving, and security features
          </p>
        </div>
      </div>
    </div>
  );
}