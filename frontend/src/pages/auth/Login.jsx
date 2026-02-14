import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaWarehouse, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../../Components/ui/Button';
import Input from '../../Components/ui/Input';
import Card from '../../Components/ui/Card';

const Login = () => {
  const navigate = useNavigate();
  const { actions, loading, error } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (loginError) setLoginError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSuccessMessage('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setLoginError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setLoginError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setLoginError('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await actions.login(formData);
      if (result.success) {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setLoginError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-105 transition-transform duration-300">
            <FaWarehouse className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InventoryPro</h1>
          <p className="text-gray-600">Sign in to manage your inventory</p>
        </div>

        {/* Login form */}
        <Card variant="elevated" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success message */}
            {successMessage && (
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                <FaCheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            )}

            {/* Error message */}
            {loginError && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                <FaExclamationTriangle className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-red-800 font-medium">{loginError}</p>
              </div>
            )}

            {/* Email field */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon={FaEnvelope}
              required
              variant={loginError && !formData.email ? 'error' : 'default'}
              helperText="We'll never share your email with anyone else"
            />

            {/* Password field */}
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={FaLock}
                required
                variant={loginError && !formData.password ? 'error' : 'default'}
                helperText="Must be at least 6 characters long"
              />
              {/* Show/Hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                {showPassword ? (
                  <>
                    <FaEyeSlash className="mr-2 h-4 w-4" />
                    Hide password
                  </>
                ) : (
                  <>
                    <FaEye className="mr-2 h-4 w-4" />
                    Show password
                  </>
                )}
              </button>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
              className="py-4 text-base font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 InventoryPro. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <button className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</button>
            <button className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</button>
            <button className="text-sm text-gray-500 hover:text-gray-700">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
