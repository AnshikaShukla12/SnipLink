import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineLink, HiOutlineChartBar, HiOutlineQrcode, HiOutlineShieldCheck, HiOutlineLightningBolt, HiOutlineGlobe } from 'react-icons/hi';
import HeroScene from '../components/three/HeroScene';
import AnimatedBackground from '../components/three/AnimatedBackground';
import Navbar from '../components/layout/Navbar';

const features = [
  {
    icon: HiOutlineLightningBolt,
    title: 'Lightning Fast',
    description: 'Generate short links instantly with our optimized engine. Every millisecond counts.',
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Deep Analytics',
    description: 'Track every click with detailed insights — devices, browsers, locations, and referrers.',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
  },
  {
    icon: HiOutlineQrcode,
    title: 'QR Codes',
    description: 'Auto-generate beautiful QR codes for every link. Download and share anywhere.',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with JWT authentication and rate limiting built-in.',
    gradient: 'linear-gradient(135deg, #06b6d4, #67e8f9)',
  },
  {
    icon: HiOutlineLink,
    title: 'Custom Aliases',
    description: 'Create branded short links with custom aliases that are memorable and professional.',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  {
    icon: HiOutlineGlobe,
    title: 'Global Reach',
    description: 'Track visitors worldwide with geographic analytics and real-time click data.',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
];

const stats = [
  { value: '10M+', label: 'Links Created' },
  { value: '500M+', label: 'Clicks Tracked' },
  { value: '99.9%', label: 'Uptime' },
  { value: '150+', label: 'Countries' },
];

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#020617' }}>
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <HeroScene />

        <div className="relative z-10 text-center max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Now with 3D Analytics Dashboard
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight"
          >
            Shorten Links.
            <br />
            <span className="gradient-text">Amplify Reach.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg sm:text-xl text-dark-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Transform long URLs into powerful short links with real-time analytics,
            QR codes, and insights that help you understand your audience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="no-underline">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg"
                style={{ padding: '16px 40px', borderRadius: '16px' }}
              >
                Start For Free
              </motion.button>
            </Link>
            <Link to="/login" className="no-underline">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg"
                style={{ padding: '16px 40px', borderRadius: '16px' }}
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{' '}
              <span className="gradient-text">manage links</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Powerful features designed for professionals who want more than just a short link.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass-card p-6 cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: feature.gradient }}
                >
                  <feature.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-dark-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-dark-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card p-12 gradient-border"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-dark-400 mb-8 max-w-lg mx-auto">
            Join thousands of professionals using SnipLink to create, manage, and track their links.
          </p>
          <Link to="/register" className="no-underline">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg"
              style={{ padding: '16px 48px', borderRadius: '16px' }}
            >
              Create Free Account
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t" style={{ borderColor: 'rgba(99, 102, 241, 0.1)' }}>
        <p className="text-xs text-dark-500">
          © 2024 SnipLink. Built with ❤️ for the web.
        </p>
      </footer>
    </div>
  );
}
