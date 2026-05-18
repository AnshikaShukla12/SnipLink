import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineClipboardCopy,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import QrCodeDisplay from '../components/url/QrCodeDisplay';
import { copyToClipboard } from '../utils/copyToClipboard';
import { formatDate } from '../utils/formatDate';
import urlService from '../services/urlService';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card" style={{ padding: '10px 14px' }}>
        <p className="text-xs text-dark-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-primary-400">{payload[0].value} clicks</p>
      </div>
    );
  }
  return null;
};

export default function UrlDetails() {
  const { id } = useParams();
  const [url, setUrl] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [urlData, analyticsData] = await Promise.all([
          urlService.getOne(id),
          urlService.getAnalytics(id, 30),
        ]);
        setUrl(urlData.url);
        setAnalytics(analyticsData.analytics);
      } catch {
        toast.error('Failed to load URL details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!url) {
    return (
      <div className="text-center py-20">
        <p className="text-dark-400">URL not found</p>
        <Link to="/dashboard" className="text-primary-400 text-sm mt-2 no-underline">← Back to dashboard</Link>
      </div>
    );
  }

  const shortUrl = url.shortUrl || `${window.location.origin}/${url.shortId}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-dark-200 transition-colors no-underline">
        <HiOutlineArrowLeft /> Back to Dashboard
      </Link>

      {/* URL Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {url.title && <h1 className="text-xl font-bold text-dark-100 mb-1">{url.title}</h1>}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary-400 font-semibold">{shortUrl.replace(/^https?:\/\//, '')}</span>
              <button onClick={() => copyToClipboard(shortUrl)} className="text-dark-400 hover:text-primary-400 transition-colors bg-transparent border-none cursor-pointer">
                <HiOutlineClipboardCopy />
              </button>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors">
                <HiOutlineExternalLink />
              </a>
            </div>
            <p className="text-xs text-dark-500 truncate max-w-lg">{url.originalUrl}</p>
            <p className="text-xs text-dark-500 mt-1">Created {formatDate(url.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black gradient-text">{analytics?.totalClicks || 0}</p>
            <p className="text-xs text-dark-400">Total Clicks</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Clicks Over Time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">Clicks Over Time (30 days)</h3>
          {analytics?.clicksByDate?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.clicksByDate}>
                <defs>
                  <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(99,102,241,0.1)' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(99,102,241,0.1)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="clicks" stroke="#6366f1" fill="url(#detailGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-dark-500 text-sm">No click data yet</div>
          )}
        </motion.div>

        {/* QR Code */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <QrCodeDisplay url={shortUrl} size={180} />
        </motion.div>
      </div>

      {/* Breakdowns Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">Devices</h3>
          {analytics?.clicksByDevice?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={analytics.clicksByDevice} dataKey="clicks" nameKey="device" cx="50%" cy="50%" outerRadius={70} strokeWidth={0}>
                  {analytics.clicksByDevice.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-dark-500 text-sm">No data</div>
          )}
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {analytics?.clicksByDevice?.map((d, i) => (
              <span key={d.device} className="text-xs text-dark-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.device} ({d.clicks})
              </span>
            ))}
          </div>
        </motion.div>

        {/* Browser Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">Browsers</h3>
          {analytics?.clicksByBrowser?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.clicksByBrowser.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: 'rgba(99,102,241,0.1)' }} />
                <YAxis type="category" dataKey="browser" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(99,102,241,0.1)' }} width={70} />
                <Bar dataKey="clicks" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-dark-500 text-sm">No data</div>
          )}
        </motion.div>

        {/* Referrers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">Top Referrers</h3>
          {analytics?.clicksByReferrer?.length > 0 ? (
            <div className="space-y-3">
              {analytics.clicksByReferrer.slice(0, 6).map((r, i) => (
                <div key={r.referrer} className="flex items-center justify-between">
                  <span className="text-xs text-dark-300 truncate flex-1 mr-2">{r.referrer}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.1)' }}>
                      <div className="h-full rounded-full" style={{
                        width: `${(r.clicks / analytics.clicksByReferrer[0].clicks) * 100}%`,
                        background: COLORS[i % COLORS.length],
                      }} />
                    </div>
                    <span className="text-xs text-dark-400 w-8 text-right">{r.clicks}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-dark-500 text-sm">No data</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
