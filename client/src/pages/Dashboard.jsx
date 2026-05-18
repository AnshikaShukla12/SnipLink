import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLink, HiOutlineCursorClick, HiOutlineChartBar, HiOutlineTrendingUp } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ShortenForm from '../components/url/ShortenForm';
import UrlCard from '../components/url/UrlCard';
import GlobeVisualization from '../components/three/GlobeVisualization';
import urlService from '../services/urlService';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="stat-card"
  >
    <div className="flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}20`, color }}
      >
        <Icon className="text-xl" />
      </div>
      <div>
        <p className="text-2xl font-bold text-dark-100">{value}</p>
        <p className="text-xs text-dark-400 mt-0.5">{label}</p>
      </div>
    </div>
  </motion.div>
);

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

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [overviewData, urlsData] = await Promise.all([
        urlService.getOverview(),
        urlService.getAll({ limit: 10 }),
      ]);
      setOverview(overviewData.overview);
      setUrls(urlsData.urls);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUrlCreated = (newUrl) => {
    setUrls((prev) => [newUrl, ...prev]);
    if (overview) {
      setOverview((prev) => ({
        ...prev,
        totalLinks: prev.totalLinks + 1,
        activeLinks: prev.activeLinks + 1,
      }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await urlService.delete(id);
      setUrls((prev) => prev.filter((u) => u.id !== id));
      toast.success('URL deleted');
      if (overview) {
        setOverview((prev) => ({
          ...prev,
          totalLinks: prev.totalLinks - 1,
        }));
      }
    } catch {
      toast.error('Failed to delete URL');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-100">Dashboard</h1>
        <p className="text-sm text-dark-400 mt-1">Manage your links and track performance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineLink} label="Total Links" value={overview?.totalLinks || 0} color="#6366f1" delay={0} />
        <StatCard icon={HiOutlineCursorClick} label="Total Clicks" value={overview?.totalClicks || 0} color="#ec4899" delay={0.05} />
        <StatCard icon={HiOutlineChartBar} label="Active Links" value={overview?.activeLinks || 0} color="#22c55e" delay={0.1} />
        <StatCard icon={HiOutlineTrendingUp} label="This Week" value={overview?.recentClicks || 0} color="#f59e0b" delay={0.15} />
      </div>

      {/* Chart + Globe Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Clicks Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-dark-300 mb-4">Clicks Over Time</h3>
          {overview?.clicksTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={overview.clicksTrend}>
                <defs>
                  <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(99,102,241,0.1)' }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(99,102,241,0.1)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  fill="url(#clickGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-dark-500 text-sm">
              No click data yet — share your links to see analytics!
            </div>
          )}
        </motion.div>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6 flex flex-col items-center justify-center"
        >
          <h3 className="text-sm font-semibold text-dark-300 mb-2">Global Reach</h3>
          <GlobeVisualization />
          <p className="text-xs text-dark-500 mt-2">Click origins worldwide</p>
        </motion.div>
      </div>

      {/* Shorten Form */}
      <div>
        <h3 className="text-lg font-semibold text-dark-200 mb-3">Create New Link</h3>
        <ShortenForm onUrlCreated={handleUrlCreated} />
      </div>

      {/* Recent Links */}
      <div>
        <h3 className="text-lg font-semibold text-dark-200 mb-3">Recent Links</h3>
        {urls.length > 0 ? (
          <div className="space-y-3">
            {urls.map((url, i) => (
              <UrlCard key={url.id} url={url} index={i} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <HiOutlineLink className="text-4xl text-dark-500 mx-auto mb-3" />
            <p className="text-dark-400">No links yet. Create your first short link above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
