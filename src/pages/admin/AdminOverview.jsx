import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Clock, Users, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const STATUS_COLORS = {
  pending_payment: 'text-amber-600 bg-amber-50 border-amber-200',
  deposit_received: 'text-blue-600 bg-blue-50 border-blue-200',
  confirmed: 'text-green-600 bg-green-50 border-green-200',
  completed: 'text-gray-500 bg-gray-50 border-gray-200',
  cancelled: 'text-red-500 bg-red-50 border-red-200',
  no_show: 'text-red-500 bg-red-50 border-red-200',
};
const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  deposit_received: 'Deposit Received',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};

export default function AdminOverview() {
  const [stats, setStats] = useState({ total: 0, pending: 0, todayCount: 0, revenue: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const allSnap = await getDocs(collection(db, 'appointments'));
        const all = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const today = new Date().toISOString().split('T')[0];
        setStats({
          total: all.length,
          pending: all.filter(a => a.status === 'pending_payment').length,
          todayCount: all.filter(a => a.date === today).length,
          revenue: all.filter(a => a.status === 'completed').reduce((s, a) => s + (a.servicePrice || 0), 0),
        });
        const sorted = [...all].sort((a, b) => {
          const ta = a.createdAt?.toDate?.() || new Date(0);
          const tb = b.createdAt?.toDate?.() || new Date(0);
          return tb - ta;
        });
        setRecent(sorted.slice(0, 8));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, []);

  const STAT_CARDS = [
    { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'text-rose bg-rose/8 border-rose/20' },
    { label: 'Pending Payment', value: stats.pending, icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: "Today's Appointments", value: stats.todayCount, icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Total Revenue', value: `R${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600 bg-green-50 border-green-200' },
  ];

  const formatDate = (str) => {
    if (!str) return '';
    return new Date(str + 'T12:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      <Helmet><title>Admin Dashboard | La Bella Aesthetic</title></Helmet>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <span className="section-label">Admin Panel</span>
          <h1 className="font-display text-4xl text-charcoal">Dashboard Overview</h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-gold/15 p-6">
              <div className={`w-11 h-11 border flex items-center justify-center mb-4 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="font-display text-4xl text-charcoal mb-1">{loading ? '—' : value}</p>
              <p className="text-[10px] tracking-widest uppercase font-body text-warm-gray">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div className="bg-white border border-gold/15">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gold/15">
            <h2 className="font-display text-2xl text-charcoal">Recent Bookings</h2>
            <Link to="/admin/appointments" className="text-[10px] tracking-widest uppercase font-body text-rose hover:text-rose-deep flex items-center gap-1">
              View All <ArrowRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10">
                  {['Reference', 'Client', 'Service', 'Date', 'Time', 'Amount', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] tracking-widest uppercase font-body text-warm-gray/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/8">
                {loading ? (
                  Array(5).fill(null).map((_, i) => (
                    <tr key={i}>
                      {Array(7).fill(null).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="shimmer h-4 w-24" /></td>
                      ))}
                    </tr>
                  ))
                ) : recent.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-warm-gray font-body text-sm">No bookings yet</td>
                  </tr>
                ) : (
                  recent.map(appt => (
                    <tr key={appt.id} className="hover:bg-cream/40 transition-colors">
                      <td className="px-5 py-4 text-xs font-body font-500 text-rose">{appt.reference}</td>
                      <td className="px-5 py-4 text-sm font-body text-charcoal">{appt.fullName}</td>
                      <td className="px-5 py-4 text-sm font-body text-warm-gray">{appt.serviceName}</td>
                      <td className="px-5 py-4 text-sm font-body text-warm-gray">{formatDate(appt.date)}</td>
                      <td className="px-5 py-4 text-sm font-body text-warm-gray">{appt.time}</td>
                      <td className="px-5 py-4 text-sm font-body text-charcoal font-500">R{appt.servicePrice?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] tracking-wider uppercase font-body px-2.5 py-1 border ${STATUS_COLORS[appt.status] || STATUS_COLORS.pending_payment}`}>
                          {STATUS_LABELS[appt.status] || appt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
}
