import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Modular RegisterForm Component.
 * Integrates validations, dual password visibility toggles, loading state wrappers,
 * and API responses via useAuth().
 */
export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Controller
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Password confirmation validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match. Please verify both inputs.');
      return;
    }

    // 2. Minimum length validation
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Calls global registration hook (excludes confirmPassword from payload)
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Account created successfully! Welcome!');
      navigate('/dashboard');
    } catch (error) {
      // Reads the normalized message computed by our api.js interceptor!
      toast.error(error.friendlyMessage || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Full Name Input */}
      <div>
        <label className="text-sm font-medium text-dark-300 mb-2 block">
          Full Name
        </label>
        <div className="relative">
          <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="input-field w-full"
            style={{ paddingLeft: '44px' }}
            required
            autoComplete="name"
          />
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label className="text-sm font-medium text-dark-300 mb-2 block">
          Email Address
        </label>
        <div className="relative">
          <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="input-field w-full"
            style={{ paddingLeft: '44px' }}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password Input with Visibility Toggle */}
      <div>
        <label className="text-sm font-medium text-dark-300 mb-2 block">
          Password
        </label>
        <div className="relative">
          <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="input-field w-full"
            style={{ paddingLeft: '44px', paddingRight: '44px' }}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Input with Visibility Toggle */}
      <div>
        <label className="text-sm font-medium text-dark-300 mb-2 block">
          Confirm Password
        </label>
        <div className="relative">
          <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field w-full"
            style={{ paddingLeft: '44px', paddingRight: '44px' }}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors focus:outline-none"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full justify-center mt-2 flex items-center"
        style={{ padding: '14px' }}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Create Account'
        )}
      </motion.button>
    </form>
  );
}
