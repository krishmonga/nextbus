import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Admin Dashboard
      </h1>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'overview'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'users'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'routes'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('routes')}
          >
            Routes
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'settings'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary-600">1,234</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Active Routes</h3>
          <p className="text-3xl font-bold text-primary-600">42</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Rides</h3>
          <p className="text-3xl font-bold text-primary-600">156</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New user registration</p>
              <p className="text-sm text-gray-500">John Doe (john@example.com)</p>
            </div>
            <span className="text-sm text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Route updated</p>
              <p className="text-sm text-gray-500">Route #123 - Downtown Express</p>
            </div>
            <span className="text-sm text-gray-500">15 minutes ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New booking</p>
              <p className="text-sm text-gray-500">Taxi booking #456</p>
            </div>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;