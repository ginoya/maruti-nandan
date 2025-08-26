import React, { useState } from 'react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to the page they were trying to access, or home
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      } else {
        // Only show error for actual authentication failures, not profile issues
        if (result.error && result.error.includes('Invalid email or password')) {
          setError(result.error);
        } else {
          // For other errors, show a generic message to avoid exposing internal details
          setError('Invalid email or password');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 p-xl">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center space-y-xl mb-3xl mt-xl">
          <div>
            <h1 
              className="text-3xl font-bold tracking-[5px]"
              style={{
                background: 'linear-gradient(to right, rgb(44, 62, 80), rgb(52, 152, 219))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Santkrupa Gold
            </h1>
            <p className="text-secondary-600 mt-sm">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-xl">
          {/* Error Message */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-md">
              <p className="text-error-600 text-sm">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-sm">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              size="md"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-sm">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              size="md"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-sm">⏳</span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login; 