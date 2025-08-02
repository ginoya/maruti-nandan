import React, { useState } from 'react';
import { Input, Button } from '../../components/ui';

const InputsPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [errorValue, setErrorValue] = useState('');

  return (
    <div className="space-y-2xl">
      <div className="text-center space-y-lg">
        <h2 className="text-3xl font-bold text-secondary-900">
          Input Components
        </h2>
        <p className="text-secondary-600">
          Explore all input variants, sizes, and validation states
        </p>
      </div>

      {/* Input Sizes */}
      <div className="space-y-xl">
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Input Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Small</h4>
              <Input
                placeholder="Small input"
                size="sm"
                helperText="Small size input"
              />
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Medium</h4>
              <Input
                placeholder="Medium input"
                size="md"
                helperText="Medium size input (default)"
              />
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Large</h4>
              <Input
                placeholder="Large input"
                size="lg"
                helperText="Large size input"
              />
            </div>
          </div>
        </div>

        {/* Input Types */}
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Input Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Text Input</h4>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Enter your complete name"
              />
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Email Input</h4>
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                helperText="We'll never share your email"
              />
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Password Input</h4>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                helperText="Minimum 8 characters"
              />
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Number Input</h4>
              <Input
                label="Age"
                type="number"
                placeholder="Enter your age"
                helperText="Must be 18 or older"
              />
            </div>
          </div>
        </div>

        {/* Input States */}
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Input States</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Normal State</h4>
              <Input
                label="Normal Input"
                placeholder="This is a normal input"
                helperText="This input is in normal state"
              />
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Error State</h4>
              <Input
                label="Error Input"
                placeholder="This input has an error"
                value={errorValue}
                onChange={(e) => setErrorValue(e.target.value)}
                error="This field is required"
              />
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Disabled State</h4>
              <Input
                label="Disabled Input"
                placeholder="This input is disabled"
                disabled
                helperText="This input cannot be modified"
              />
            </div>
            
            <div className="space-y-md">
              <h4 className="text-lg font-medium text-secondary-700">Read Only</h4>
              <Input
                label="Read Only Input"
                value="This value cannot be changed"
                readOnly
                helperText="This input is read-only"
              />
            </div>
          </div>
        </div>

        {/* Interactive Example */}
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Interactive Example</h3>
          <div className="bg-secondary-50 rounded-lg p-lg space-y-lg">
            <div className="space-y-md">
              <Input
                label="Username"
                placeholder="Enter your username"
                helperText="Username must be at least 3 characters"
                error={inputValue.length > 0 && inputValue.length < 3 ? "Username too short" : ""}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            
            <div className="flex gap-sm">
              <Button 
                variant="primary"
                disabled={inputValue.length < 3}
              >
                Submit
              </Button>
              <Button 
                variant="outline"
                onClick={() => setInputValue('')}
              >
                Clear
              </Button>
            </div>
            
            {inputValue.length >= 3 && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-md">
                <p className="text-success-700 text-sm">
                  ✅ Username is valid!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Example */}
        <div className="bg-white rounded-lg p-xl space-y-lg">
          <h3 className="text-2xl font-semibold text-secondary-900">Form Example</h3>
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
              label="Email"
              type="email"
              placeholder="your@email.com"
              helperText="We'll use this for notifications"
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              helperText="Optional contact number"
            />
          </div>
          
          <div className="flex gap-sm">
            <Button variant="primary">Save Profile</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputsPage; 