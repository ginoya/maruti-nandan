import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../components/ui';

const ComponentsOverview: React.FC = () => {
  return (
    <div className="space-y-2xl">
      <div className="text-center space-y-lg">
        <h2 className="text-3xl font-bold text-secondary-900">
          Component Library
        </h2>
        <p className="text-secondary-600">
          Browse our collection of reusable UI components
        </p>
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
        {/* Buttons Card */}
        <div className="bg-secondary-50 rounded-lg p-xl space-y-lg">
          <div className="text-center space-y-md">
            <h3 className="text-xl font-semibold text-secondary-900">Buttons</h3>
            <p className="text-sm text-secondary-600">
              Interactive buttons with multiple variants and states
            </p>
          </div>
          <div className="flex flex-wrap gap-sm justify-center">
            <Button size="sm" variant="primary">Primary</Button>
            <Button size="sm" variant="secondary">Secondary</Button>
            <Button size="sm" variant="outline">Outline</Button>
          </div>
          <div className="text-center">
            <Link to="/components/buttons">
              <Button variant="ghost" size="sm">
                View All Buttons →
              </Button>
            </Link>
          </div>
        </div>

        {/* Inputs Card */}
        <div className="bg-secondary-50 rounded-lg p-xl space-y-lg">
          <div className="text-center space-y-md">
            <h3 className="text-xl font-semibold text-secondary-900">Inputs</h3>
            <p className="text-sm text-secondary-600">
              Form inputs with validation and different states
            </p>
          </div>
          <div className="space-y-sm">
            <Input 
              placeholder="Sample input" 
              size="sm"
              helperText="With helper text"
            />
          </div>
          <div className="text-center">
            <Link to="/components/inputs">
              <Button variant="ghost" size="sm">
                View All Inputs →
              </Button>
            </Link>
          </div>
        </div>

        {/* Forms Card */}
        <div className="bg-secondary-50 rounded-lg p-xl space-y-lg">
          <div className="text-center space-y-md">
            <h3 className="text-xl font-semibold text-secondary-900">Forms</h3>
            <p className="text-sm text-secondary-600">
              Complete form layouts and validation examples
            </p>
          </div>
          <div className="text-center">
            <Button variant="gradient" size="sm">
              Form Example
            </Button>
          </div>
          <div className="text-center">
            <Link to="/components/forms">
              <Button variant="ghost" size="sm">
                View All Forms →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="bg-white rounded-lg p-lg text-center">
          <div className="text-2xl font-bold text-primary-600">5</div>
          <div className="text-sm text-secondary-600">Button Variants</div>
        </div>
        <div className="bg-white rounded-lg p-lg text-center">
          <div className="text-2xl font-bold text-primary-600">3</div>
          <div className="text-sm text-secondary-600">Input Sizes</div>
        </div>
        <div className="bg-white rounded-lg p-lg text-center">
          <div className="text-2xl font-bold text-primary-600">10+</div>
          <div className="text-sm text-secondary-600">Color Tokens</div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsOverview; 