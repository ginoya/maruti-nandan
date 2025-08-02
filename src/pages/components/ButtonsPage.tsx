import React from 'react';
import { Button } from '../../components/ui';

const ButtonsPage: React.FC = () => {
  return (
    <div className="space-y-2xl">
      <div className="text-center space-y-lg">
        <h2 className="text-3xl font-bold text-secondary-900">
          Button Components
        </h2>
        <p className="text-secondary-600">
          Explore all button variants, sizes, and states
        </p>
      </div>

      {/* Button Variants */}
      <div className="space-y-xl">
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Button Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Primary</h4>
              <div className="flex flex-wrap gap-sm">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Secondary</h4>
              <div className="flex flex-wrap gap-sm">
                <Button variant="secondary" size="sm">Small</Button>
                <Button variant="secondary" size="md">Medium</Button>
                <Button variant="secondary" size="lg">Large</Button>
              </div>
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Outline</h4>
              <div className="flex flex-wrap gap-sm">
                <Button variant="outline" size="sm">Small</Button>
                <Button variant="outline" size="md">Medium</Button>
                <Button variant="outline" size="lg">Large</Button>
              </div>
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Ghost</h4>
              <div className="flex flex-wrap gap-sm">
                <Button variant="ghost" size="sm">Small</Button>
                <Button variant="ghost" size="md">Medium</Button>
                <Button variant="ghost" size="lg">Large</Button>
              </div>
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Gradient</h4>
              <div className="flex flex-wrap gap-sm">
                <Button variant="gradient" size="sm">Small</Button>
                <Button variant="gradient" size="md">Medium</Button>
                <Button variant="gradient" size="lg">Large</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Button States */}
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Button States</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Interactive States</h4>
              <div className="flex flex-wrap gap-sm">
                <Button variant="primary">Normal</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Loading State</h4>
              <div className="flex flex-wrap gap-sm">
                <Button variant="primary" disabled>
                  <span className="animate-spin mr-sm">⏳</span>
                  Loading...
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Button Groups */}
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Button Groups</h3>
          <div className="space-y-lg">
            <div>
              <h4 className="text-lg font-medium text-secondary-700 mb-md">Action Group</h4>
              <div className="flex flex-wrap gap-sm">
                <Button variant="primary">Save</Button>
                <Button variant="outline">Cancel</Button>
                <Button variant="ghost">Delete</Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-secondary-700 mb-md">Size Group</h4>
              <div className="flex flex-wrap gap-sm items-center">
                <Button variant="secondary" size="sm">Small</Button>
                <Button variant="secondary" size="md">Medium</Button>
                <Button variant="secondary" size="lg">Large</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Usage Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Form Actions</h4>
              <div className="bg-secondary-50 rounded-lg p-md space-y-sm">
                <p className="text-sm text-secondary-600">Submit form with primary action</p>
                <div className="flex gap-sm">
                  <Button variant="primary">Submit</Button>
                  <Button variant="outline">Reset</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Navigation</h4>
              <div className="bg-secondary-50 rounded-lg p-md space-y-sm">
                <p className="text-sm text-secondary-600">Navigation with ghost buttons</p>
                <div className="flex gap-sm">
                  <Button variant="ghost" size="sm">Previous</Button>
                  <Button variant="ghost" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonsPage; 