import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-2xl">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
        <div className="text-center space-y-lg">
          <h2 className="text-3xl font-bold text-secondary-900">
            Welcome back, User!
          </h2>
          <p className="text-lg text-secondary-600">
            Here's what's happening with your account today
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-lg">
          <div className="text-center space-y-sm">
            <div className="text-3xl font-bold text-primary-600">1,234</div>
            <div className="text-sm text-secondary-600">Total Views</div>
            <div className="text-xs text-success-600">+12% from last month</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-lg">
          <div className="text-center space-y-sm">
            <div className="text-3xl font-bold text-primary-600">567</div>
            <div className="text-sm text-secondary-600">Active Users</div>
            <div className="text-xs text-success-600">+8% from last week</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-lg">
          <div className="text-center space-y-sm">
            <div className="text-3xl font-bold text-primary-600">89</div>
            <div className="text-sm text-secondary-600">New Signups</div>
            <div className="text-xs text-success-600">+23% from yesterday</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-lg">
          <div className="text-center space-y-sm">
            <div className="text-3xl font-bold text-primary-600">$12,345</div>
            <div className="text-sm text-secondary-600">Revenue</div>
            <div className="text-xs text-success-600">+15% from last month</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <Link to="/dashboard/profile">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              Download Report
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Recent Activity</h3>
          <div className="space-y-md">
            <div className="flex items-center space-x-md p-md bg-secondary-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-secondary-900">Profile Updated</div>
                <div className="text-xs text-secondary-600">2 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-md p-md bg-secondary-50 rounded-lg">
              <div className="w-2 h-2 bg-success-600 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-secondary-900">New User Registered</div>
                <div className="text-xs text-secondary-600">4 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-md p-md bg-secondary-50 rounded-lg">
              <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-secondary-900">Settings Changed</div>
                <div className="text-xs text-secondary-600">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl space-y-lg">
        <h3 className="text-2xl font-semibold text-secondary-900">Recent Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          <div className="border border-gray-200 rounded-lg p-lg space-y-md">
            <h4 className="font-medium text-secondary-900">E-commerce Platform</h4>
            <p className="text-sm text-secondary-600">Online shopping platform with payment integration</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-success-600 bg-success-50 px-sm py-xs rounded">Active</span>
              <span className="text-xs text-secondary-600">Updated 2 days ago</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-lg space-y-md">
            <h4 className="font-medium text-secondary-900">Mobile App</h4>
            <p className="text-sm text-secondary-600">Cross-platform mobile application</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-accent-600 bg-accent-50 px-sm py-xs rounded">In Progress</span>
              <span className="text-xs text-secondary-600">Updated 1 week ago</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-lg space-y-md">
            <h4 className="font-medium text-secondary-900">Admin Dashboard</h4>
            <p className="text-sm text-secondary-600">Administrative interface for data management</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-secondary-600 bg-secondary-50 px-sm py-xs rounded">Planning</span>
              <span className="text-xs text-secondary-600">Updated 3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 