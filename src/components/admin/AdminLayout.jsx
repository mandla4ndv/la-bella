import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Calendar, Scissors, Image, MessageSquare,
  Settings, Users, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/admin/services', icon: Scissors, label: 'Services' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-cream/10">
        <span className="font-display text-2xl text-cream block leading-none">La Bella</span>
        <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-body mt-1 block">Admin Panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-[11px] tracking-widest uppercase font-body transition-all group ${
                isActive
                  ? 'bg-rose text-white'
                  : 'text-cream/60 hover:text-cream hover:bg-cream/5'
              }`
            }
          >
            <Icon size={15} />
            <span>{label}</span>
            <ChevronRight size={11} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-cream/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-rose/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-display text-cream">{(userProfile?.fullName || 'A')[0]}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-body text-cream truncate">{userProfile?.fullName || 'Admin'}</p>
            <p className="text-[10px] text-cream/40 font-body">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[11px] tracking-widest uppercase font-body text-cream/60 hover:text-rose hover:bg-cream/5 transition-all">
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f0ec]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-60 bg-charcoal flex-shrink-0 fixed top-0 left-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-64 bg-charcoal z-50 lg:hidden flex flex-col">
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)} className="text-cream/60 hover:text-cream">
                  <X size={20} />
                </button>
              </div>
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-grow lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b border-gold/15 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-charcoal hover:text-rose">
            <Menu size={20} />
          </button>
          <div className="flex-grow" />
          <span className="text-xs tracking-widest uppercase font-body text-warm-gray">
            {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {/* Page content */}
        <div className="flex-grow p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
