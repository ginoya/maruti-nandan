import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../components/ui';

const Settings: React.FC = () => {
  const [email, setEmail] = useState('user@example.com');
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 p-2xl">
      <div className="max-w-4xl mx-auto space-y-2xl">
        {/* Header */}
        <div className="text-center space-y-lg p-2xl">
          <h1 className="text-4xl font-bold text-secondary-900 mb-md">
            Settings
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-xl">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl space-y-lg">
            <h2 className="text-2xl font-semibold text-secondary-900">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <Input
                label="First Name"
                placeholder="Enter your first name"
                helperText="Your given name"
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                helperText="Your family name"
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="We'll use this for notifications"
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                helperText="Optional contact number"
              />
            </div>
            <div className="flex gap-sm">
              <Button variant="primary">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl space-y-lg">
            <h2 className="text-2xl font-semibold text-secondary-900">Notification Settings</h2>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-secondary-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-secondary-900">Email Notifications</h3>
                  <p className="text-sm text-secondary-600">Receive updates via email</p>
                </div>
                <Button
                  variant={notifications ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setNotifications(!notifications)}
                >
                  {notifications ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-md bg-secondary-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-secondary-900">Push Notifications</h3>
                  <p className="text-sm text-secondary-600">Receive push notifications</p>
                </div>
                <Button variant="outline" size="sm">
                  Disabled
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-md bg-secondary-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-secondary-900">SMS Notifications</h3>
                  <p className="text-sm text-secondary-600">Receive updates via SMS</p>
                </div>
                <Button variant="outline" size="sm">
                  Disabled
                </Button>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl space-y-lg">
            <h2 className="text-2xl font-semibold text-secondary-900">Theme Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div 
                className={`border-2 rounded-lg p-lg cursor-pointer transition-all ${
                  theme === 'light' 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTheme('light')}
              >
                <div className="text-center space-y-sm">
                  <div className="w-full h-16 bg-white border border-gray-200 rounded"></div>
                  <h3 className="font-medium text-secondary-900">Light Theme</h3>
                  <p className="text-xs text-secondary-600">Clean and bright interface</p>
                </div>
              </div>
              
              <div 
                className={`border-2 rounded-lg p-lg cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTheme('dark')}
              >
                <div className="text-center space-y-sm">
                  <div className="w-full h-16 bg-gray-800 border border-gray-700 rounded"></div>
                  <h3 className="font-medium text-secondary-900">Dark Theme</h3>
                  <p className="text-xs text-secondary-600">Easy on the eyes</p>
                </div>
              </div>
              
              <div 
                className={`border-2 rounded-lg p-lg cursor-pointer transition-all ${
                  theme === 'auto' 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTheme('auto')}
              >
                <div className="text-center space-y-sm">
                  <div className="w-full h-16 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded"></div>
                  <h3 className="font-medium text-secondary-900">Auto Theme</h3>
                  <p className="text-xs text-secondary-600">Follows system preference</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl space-y-lg">
            <h2 className="text-2xl font-semibold text-secondary-900">Security Settings</h2>
            <div className="space-y-md">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter your current password"
                helperText="Required to change password"
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                helperText="Minimum 8 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                helperText="Must match new password"
              />
            </div>
            <div className="flex gap-sm">
              <Button variant="primary">Change Password</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-soft border border-error-200 p-xl space-y-lg">
            <h2 className="text-2xl font-semibold text-error-700">Danger Zone</h2>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-error-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-error-700">Delete Account</h3>
                  <p className="text-sm text-error-600">Permanently delete your account and all data</p>
                </div>
                <Button variant="outline" size="sm" className="border-error-300 text-error-700 hover:bg-error-50">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link to="/">
            <Button variant="ghost">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings; 