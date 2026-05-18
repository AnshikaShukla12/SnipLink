import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#020617' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-8xl mb-6"
        >
          🔗
        </motion.div>
        <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
        <p className="text-xl text-dark-300 mb-2">Link Not Found</p>
        <p className="text-sm text-dark-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or the short link has expired.
        </p>
        <Link to="/" className="no-underline">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            <HiOutlineHome />
            Go Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
