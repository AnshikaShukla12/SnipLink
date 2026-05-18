import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineClipboardCopy,
  HiOutlineExternalLink,
  HiOutlineTrash,
  HiOutlineChartBar,
  HiOutlineQrcode,
} from 'react-icons/hi';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { timeAgo } from '../../utils/formatDate';

export default function UrlCard({ url, onDelete, index = 0 }) {
  const shortUrl = url.shortUrl || `${window.location.origin}/${url.shortId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-card p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* URL Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {url.title && (
              <span className="text-sm font-semibold text-dark-200">{url.title}</span>
            )}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: url.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: url.isActive ? '#4ade80' : '#f87171',
                border: `1px solid ${url.isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              }}
            >
              {url.isActive ? 'Active' : 'Disabled'}
            </span>
          </div>

          {/* Short URL */}
          <div className="flex items-center gap-2 mb-1">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 font-semibold text-sm hover:text-primary-300 transition-colors no-underline"
            >
              {shortUrl.replace(/^https?:\/\//, '')}
            </a>
            <button
              onClick={() => copyToClipboard(shortUrl)}
              className="text-dark-400 hover:text-primary-400 transition-colors bg-transparent border-none cursor-pointer p-1"
              title="Copy to clipboard"
            >
              <HiOutlineClipboardCopy className="text-base" />
            </button>
          </div>

          {/* Original URL */}
          <p
            className="text-xs text-dark-500 truncate"
            style={{ maxWidth: '400px' }}
            title={url.originalUrl}
          >
            {url.originalUrl}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 text-xs text-dark-500">
            <span>{timeAgo(url.createdAt)}</span>
            <span className="flex items-center gap-1">
              <HiOutlineChartBar />
              {url.totalClicks} click{url.totalClicks !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/link/${url.id}`}
            className="btn-secondary no-underline"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <HiOutlineChartBar />
            Details
          </Link>
          <button
            onClick={() => onDelete && onDelete(url.id)}
            className="btn-danger"
            style={{ padding: '8px 12px' }}
          >
            <HiOutlineTrash />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
