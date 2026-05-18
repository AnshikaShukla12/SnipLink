import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineLink } from 'react-icons/hi';
import ShortenForm from '../components/url/ShortenForm';
import UrlCard from '../components/url/UrlCard';
import urlService from '../services/urlService';
import toast from 'react-hot-toast';

export default function MyLinks() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchUrls = async () => {
    try {
      const data = await urlService.getAll({ page, limit: 10, search });
      setUrls(data.urls);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [page, search]);

  const handleUrlCreated = (newUrl) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await urlService.delete(id);
      setUrls((prev) => prev.filter((u) => u.id !== id));
      toast.success('URL deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-dark-100">My Links</h1>
        <p className="text-sm text-dark-400 mt-1">Create and manage all your short links</p>
      </motion.div>

      <ShortenForm onUrlCreated={handleUrlCreated} />

      {/* Search */}
      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field"
          style={{ paddingLeft: '44px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Links List */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : urls.length > 0 ? (
        <div className="space-y-3">
          {urls.map((url, i) => (
            <UrlCard key={url.id} url={url} index={i} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <HiOutlineLink className="text-4xl text-dark-500 mx-auto mb-3" />
          <p className="text-dark-400">{search ? 'No links match your search' : 'No links yet'}</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all border-none cursor-pointer ${
                p === page
                  ? 'text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
              style={p === page ? { background: 'linear-gradient(135deg, #6366f1, #4f46e5)' } : { background: 'rgba(99,102,241,0.1)' }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
