import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile, signOut } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/home', icon: '📊' },
    { label: 'Invoice', path: '/invoice', icon: '📄' },
    { label: 'Customers', path: '/customers', icon: '👥' },
    { label: 'Payments', path: '/payments', icon: '💳' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-medium border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-lg">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-md" onClick={closeMenu}>
              <h1 
                className="text-xl font-bold tracking-[2px]"
                style={{
                  background: 'linear-gradient(to right, rgb(44, 62, 80), rgb(52, 152, 219))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                MARUTI NANDAN
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-sm px-md py-sm rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-md">
            {userProfile && (
              <div className="flex items-center space-x-sm">
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900">{userProfile.username}</p>
                  {userProfile.isAdmin && (
                    <span className="text-xs text-primary-600">Administrator</span>
                  )}
                </div>
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {userProfile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-md py-sm text-sm font-medium text-secondary-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-sm text-secondary-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-md">
            <div className="space-y-sm">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-sm px-md py-sm rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile User Info */}
              {userProfile && (
                <div className="border-t border-gray-200 pt-md mt-md">
                  <div className="flex items-center space-x-sm px-md py-sm">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">{userProfile.username}</p>
                      {userProfile.isAdmin && (
                        <span className="text-xs text-primary-600">Administrator</span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-md py-sm text-sm font-medium text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 