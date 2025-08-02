import React from 'react';

export interface TabProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export interface TabItemProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ children, className = '' }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

export const TabList: React.FC<TabListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const TabItem: React.FC<TabItemProps> = ({ 
  children, 
  isActive = false, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-lg py-md font-medium text-sm transition-colors
        ${isActive 
          ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ 
  children, 
  isActive = false, 
  className = '' 
}) => {
  if (!isActive) return null;
  
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}; 