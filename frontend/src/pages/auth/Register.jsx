import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { FaEnvelope, FaLock, FaUser, FaWarehouse, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../../Components/ui/Button';
import Input from '../../Components/ui/Input';
import Card from '../../Components/ui/Card';

const Register = () => {
  const navigate = useNavigate();
  const { actions, loading } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: 'USER' // Default status
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (registerError) setRegisterError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setSuccessMessage('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setRegisterError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setRegisterError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Exclude confirmPassword from API call
      const { confirmPassword, ...dataToSend } = formData;
      
      const result = await actions.register(dataToSend);
      if (result.success) {
        setSuccessMessage('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setRegisterError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setRegisterError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Showcase Message */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden flex-col justify-center px-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
            <FaWarehouse className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Professional Inventory Management</h2>
          <div className="space-y-6 text-indigo-100 text-lg leading-relaxed">
            <p className="border-l-4 border-indigo-400 pl-6 italic">
              "I developed this registration form to showcase my work and demonstrate the functionality, structure, and validation features of the system I built. It is intended to give a clear view of my implementation and design approach."
            </p>
          </div>
          <div className="mt-12 flex items-center gap-4 text-sm font-medium text-indigo-200">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-indigo-900 bg-indigo-${i*100 + 400} flex items-center justify-center`}>
                  <FaUser className="text-indigo-900 text-xs" />
                </div>
              ))}
            </div>
            <span>Join potential users today</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
             <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl mb-6">
                <FaWarehouse className="h-8 w-8 text-white" />
             </div>
             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
             <p className="text-gray-500 mt-2">Sign up to get started with InventoryPro</p>
          </div>

          <Card variant="elevated" className="p-8 border-none shadow-xl shadow-gray-200/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Messages */}
              {successMessage && (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <FaCheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <p className="text-green-800 font-medium text-sm">{successMessage}</p>
                </div>
              )}

              {registerError && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <FaExclamationTriangle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                  <p className="text-red-800 font-medium text-sm">{registerError}</p>
                </div>
              )}

              {/* Name field */}
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={FaUser}
                required
              />

              {/* Email field */}
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                icon={FaEnvelope}
                required
              />

              {/* Password fields */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    icon={FaLock}
                    required
                    helperText="Must be at least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-9 right-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  icon={FaLock}
                  required
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
                className="py-4 text-base font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </Card>
          
          <div className="text-center text-xs text-gray-400">
             &copy; 2024 InventoryPro. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
