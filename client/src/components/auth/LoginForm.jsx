import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Modular LoginForm Component.
 * Integrates email validations, password toggles, loading animations,
 * and API responses via useAuth().
 */
export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Controller
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple basic client-side check
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      // Calls our global auth context login action
      await login(formData);
      toast.success('Welcome back to SnipLink!');
      navigate('/dashboard');
    } catch (error) {
      // Reads the normalized message computed by our api.js interceptor!
      toast.error(error.friendlyMessage || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email Input Field */}
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

      {/* Password Input Field with Visibility Toggle */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-dark-300 block">
            Password
          </label>
        </div>
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
            autoComplete="current-password"
          />
          {/* Toggle Password Visibility */}
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

      {/* Form Submission Button */}
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
          'Sign In'
        )}
      </motion.button>
    </form>
  );
}
