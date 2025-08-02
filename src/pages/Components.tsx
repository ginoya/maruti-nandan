import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui';

const Components: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 p-2xl">
      <div className="max-w-6xl mx-auto space-y-2xl">
        {/* Header */}
        <div className="text-center space-y-lg p-2xl">
          <h1 className="text-4xl font-bold text-secondary-900 mb-md">
            UI Components
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Explore our design system components with different variants and states
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
          <div className="flex flex-wrap gap-md border-b border-gray-200 pb-md">
            <Link to="/components">
              <Button 
                variant={isActive('/components') ? 'primary' : 'ghost'}
                size="sm"
              >
                Overview
              </Button>
            </Link>
            <Link to="/components/buttons">
              <Button 
                variant={isActive('/components/buttons') ? 'primary' : 'ghost'}
                size="sm"
              >
                Buttons
              </Button>
            </Link>
            <Link to="/components/inputs">
              <Button 
                variant={isActive('/components/inputs') ? 'primary' : 'ghost'}
                size="sm"
              >
                Inputs
              </Button>
            </Link>
            <Link to="/components/forms">
              <Button 
                variant={isActive('/components/forms') ? 'primary' : 'ghost'}
                size="sm"
              >
                Forms
              </Button>
            </Link>
          </div>
          
          {/* Content Area */}
          <div className="pt-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Components; 