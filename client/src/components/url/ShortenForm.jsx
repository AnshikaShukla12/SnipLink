import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLink, HiOutlineSparkles, HiOutlineTag } from 'react-icons/hi';
import toast from 'react-hot-toast';
import urlService from '../../services/urlService';

export default function ShortenForm({ onUrlCreated }) {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
  });
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.originalUrl) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const data = await urlService.create({
        originalUrl: formData.originalUrl,
        customAlias: formData.customAlias || undefined,
        title: formData.title || undefined,
      });
      toast.success('URL shortened successfully!');
      setFormData({ originalUrl: '', customAlias: '', title: '' });
      if (onUrlCreated) onUrlCreated(data.url);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <HiOutlineLink className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
            <input
              type="url"
              placeholder="Paste your long URL here..."
              value={formData.originalUrl}
              onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '44px' }}
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary whitespace-nowrap"
            style={{ minWidth: '140px', justifyContent: 'center' }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <HiOutlineSparkles />
                Shorten
              </>
            )}
          </motion.button>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-3 text-xs text-dark-400 hover:text-primary-400 transition-colors bg-transparent border-none cursor-pointer"
        >
          {showAdvanced ? '▾ Hide' : '▸ Advanced'} options
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col sm:flex-row gap-3 mt-3"
          >
            <div className="flex-1 relative">
              <HiOutlineLink className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                placeholder="Custom alias (optional)"
                value={formData.customAlias}
                onChange={(e) => setFormData({ ...formData, customAlias: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '44px', fontSize: '0.85rem' }}
              />
            </div>
            <div className="flex-1 relative">
              <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                placeholder="Title / Label (optional)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '44px', fontSize: '0.85rem' }}
              />
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
