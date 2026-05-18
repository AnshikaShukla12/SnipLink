import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineLink,
  HiOutlineChartBar,
  HiOutlineCog,
} from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', icon: HiOutlineHome, label: 'Overview' },
  { to: '/dashboard/links', icon: HiOutlineLink, label: 'My Links' },
  { to: '/dashboard/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-64px)] p-4"
      style={{
        background: 'rgba(15, 23, 42, 0.5)',
        borderRight: '1px solid rgba(99, 102, 241, 0.1)',
      }}
    >
      <nav className="flex flex-col gap-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                isActive
                  ? 'text-white'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-white/5'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }
                : {}
            }
          >
            <item.icon className="text-lg" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 rounded-xl" style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
      }}>
        <p className="text-xs text-dark-400 mb-1">SnipLink Pro</p>
        <p className="text-xs text-dark-500">Unlimited links & analytics</p>
      </div>
    </motion.aside>
  );
}
