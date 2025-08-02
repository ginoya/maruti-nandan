import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui';

const Dashboard: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      {/* Header */}
      <div className="bg-white shadow-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-xl py-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-lg">
              <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
              <div className="flex space-x-md">
                <Link to="/dashboard">
                  <Button 
                    variant={isActive('/dashboard') ? 'primary' : 'ghost'}
                    size="sm"
                  >
                    Overview
                  </Button>
                </Link>
                <Link to="/dashboard/profile">
                  <Button 
                    variant={isActive('/dashboard/profile') ? 'primary' : 'ghost'}
                    size="sm"
                  >
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard; 