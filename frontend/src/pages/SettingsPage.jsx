import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateSettings, changePassword, isLoading } = useAuthStore();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'en',
    distanceUnit: 'km'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Load user settings when component mounts
  useEffect(() => {
    if (user && user.settings) {
      setSettings({
        notifications: user.settings.notifications ?? true,
        emailAlerts: user.settings.emailAlerts ?? true,
        darkMode: user.settings.darkMode ?? false,
        language: user.settings.language ?? 'en',
        distanceUnit: user.settings.distanceUnit ?? 'km'
      });
    }
  }, [user]);
  
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      // Assuming updateSettings is a function in your authStore
      await updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };
  
  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      // Assuming changePassword is a function in your authStore
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Please log in to view your settings.
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      
      {/* App Preferences Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">App Preferences</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize your app experience.
          </p>
        </div>
        
        <form onSubmit={saveSettings}>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Notifications</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notifications"
                      name="notifications"
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={handleSettingChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notifications" className="font-medium text-gray-700 dark:text-gray-300">
                      Enable Push Notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive updates about bus arrivals and service changes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailAlerts"
                      name="emailAlerts"
                      type="checkbox"
                      checked={settings.emailAlerts}
                      onChange={handleSettingChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailAlerts" className="font-medium text-gray-700 dark:text-gray-300">
                      Email Alerts
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive service updates and announcements via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={handleSettingChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="pa">Punjabi</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="distanceUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Distance Unit
                </label>
                <select
                  id="distanceUnit"
                  name="distanceUnit"
                  value={settings.distanceUnit}
                  onChange={handleSettingChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="km">Kilometers</option>
                  <option value="mi">Miles</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Password Change Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ensure your account is using a secure password.
          </p>
        </div>
        
        <form onSubmit={updatePassword}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;