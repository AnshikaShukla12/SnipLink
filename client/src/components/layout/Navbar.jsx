import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineLink, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                <HiOutlineLink className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold gradient-text">SnipLink</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-dark-300 hover:text-white transition-colors text-sm font-medium no-underline"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-dark-300">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-dark-400 hover:text-danger-400 transition-colors ml-2 bg-transparent border-none cursor-pointer"
                    >
                      <HiOutlineLogout className="text-lg" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-dark-300 hover:text-white transition-colors text-sm font-medium no-underline"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="no-underline">
                    <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-dark-300 bg-transparent border-none cursor-pointer"
            >
              {mobileOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 pb-4"
          >
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-dark-300 hover:text-white transition-colors text-sm font-medium no-underline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-danger-400 text-sm font-medium text-left bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-dark-300 hover:text-white transition-colors text-sm font-medium no-underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-primary-400 text-sm font-medium no-underline"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
