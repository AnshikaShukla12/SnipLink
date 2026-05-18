import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLink as LinkIcon } from 'react-icons/hi';
import LoginForm from '../components/auth/LoginForm';

/**
 * Login Screen Page.
 * Renders glassmorphic containers, ambient floating blurred background blobs,
 * and mounts the modular LoginForm controller.
 */
export default function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#020617' }}
    >
      {/* Visual background gradient glow blobs */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: '#6366f1', top: '10%', left: '10%' }}
      />
      <div
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: '#ec4899', bottom: '10%', right: '10%' }}
      />

      {/* Main card wrapper with Framer Motion entry reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Logo & Heading Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
            >
              <LinkIcon className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold gradient-text">SnipLink</span>
          </Link>
          <h1 className="text-2xl font-bold text-dark-100 mt-4">Welcome back</h1>
          <p className="text-sm text-dark-400 mt-1">Sign in to your account</p>
        </div>

        {/* Central Glassmorphism Card hosting the Form Component */}
        <div className="glass-card p-8">
          <LoginForm />

          {/* Registration Redirect Toggle */}
          <p className="text-center text-sm text-dark-400 mt-6 mb-0">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 no-underline font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
