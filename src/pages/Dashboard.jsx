import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, User, Phone, Mail, Plus } from 'lucide-react';

const STATUS_CONFIG = {
  pending_payment: { label: 'Pending Payment', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
  deposit_received: { label: 'Deposit Received', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-gray-50 text-gray-600 border-gray-200', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
  no_show: { label: 'No Show', color: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
};

export default function Dashboard() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="shimmer w-64 h-8" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;

  const now = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(a => a.date >= now && a.status !== 'cancelled' && a.status !== 'completed');
  const history = appointments.filter(a => a.date < now || a.status === 'completed' || a.status === 'cancelled');

  const displayed = activeTab === 'upcoming' ? upcoming : history;

  const formatDate = (str) => {
    if (!str) return '';
    return new Date(str + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Layout>
      <Helmet><title>My Account | La Bella Aesthetic</title></Helmet>

      <div className="pt-32 pb-20 px-6 lg:px-10 min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <span className="section-label">Client Portal</span>
              <h1 className="font-display text-4xl text-charcoal">
                Welcome, {userProfile?.fullName?.split(' ')[0] || 'Lovely'}
              </h1>
            </div>
            <Link to="/booking" className="btn-primary self-start sm:self-auto">
              <Plus size={14} /> New Booking
            </Link>
          </motion.div>

          {/* Profile card + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-gold/15 p-6 md:col-span-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose/20 to-gold/20 border border-gold/20 flex items-center justify-center">
                  <span className="font-display text-xl text-rose">
                    {(userProfile?.fullName || user.displayName || 'U')[0]}
                  </span>
                </div>
                <div>
                  <p className="font-body font-500 text-charcoal">{userProfile?.fullName || user.displayName}</p>
                  <p className="text-xs text-warm-gray font-body">Client</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-warm-gray font-body">
                  <Mail size={13} className="text-gold" /> {user.email}
                </div>
                {userProfile?.phone && (
                  <div className="flex items-center gap-2 text-sm text-warm-gray font-body">
                    <Phone size={13} className="text-gold" /> {userProfile.phone}
                  </div>
                )}
              </div>
            </div>
            {[
              { label: 'Total Bookings', value: appointments.length, icon: Calendar },
              { label: 'Upcoming', value: upcoming.length, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white border border-gold/15 p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-rose/8 border border-rose/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-rose" />
                </div>
                <div>
                  <p className="font-display text-4xl text-charcoal">{value}</p>
                  <p className="text-xs tracking-widest uppercase font-body text-warm-gray">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Appointments */}
          <div className="bg-white border border-gold/15">
            <div className="flex border-b border-gold/15">
              {['upcoming', 'history'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-[10px] tracking-widest uppercase font-body transition-all border-b-2 ${
                    activeTab === tab ? 'border-rose text-rose' : 'border-transparent text-warm-gray hover:text-charcoal'
                  }`}>
                  {tab === 'upcoming' ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
                </button>
              ))}
            </div>

            <div className="divide-y divide-gold/10">
              {loading ? (
                <div className="p-8 space-y-4">
                  {[1,2,3].map(i => <div key={i} className="shimmer h-20 rounded-none" />)}
                </div>
              ) : displayed.length === 0 ? (
                <div className="py-20 text-center">
                  <Calendar size={36} className="text-gold/30 mx-auto mb-4" />
                  <p className="font-display text-2xl text-charcoal/50 mb-2">
                    {activeTab === 'upcoming' ? 'No upcoming appointments' : 'No booking history'}
                  </p>
                  {activeTab === 'upcoming' && (
                    <Link to="/booking" className="btn-primary mt-4 inline-flex">Book Now</Link>
                  )}
                </div>
              ) : (
                displayed.map((appt) => {
                  const status = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending_payment;
                  const StatusIcon = status.icon;
                  return (
                    <motion.div key={appt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="p-6 hover:bg-cream/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-body font-500 text-charcoal">{appt.serviceName}</h3>
                            <span className={`inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-body px-2.5 py-1 border ${status.color}`}>
                              <StatusIcon size={11} /> {status.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-warm-gray font-body">
                            <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(appt.date)}</span>
                            <span className="flex items-center gap-1"><Clock size={11} /> {appt.time}</span>
                            <span className="text-[10px] text-warm-gray/60">Ref: {appt.reference}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-display text-2xl text-charcoal">R{appt.servicePrice?.toLocaleString()}</p>
                          <p className="text-xs text-warm-gray font-body">Deposit: R{appt.deposit?.toLocaleString()}</p>
                        </div>
                      </div>
                      {appt.status === 'pending_payment' && (
                        <div className="mt-4 pt-4 border-t border-gold/10 flex flex-wrap gap-3">
                          <p className="text-xs text-amber-700 font-body flex-grow">
                            ⚠️ Deposit payment required to confirm this booking.
                          </p>
                          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer"
                            className="text-[10px] tracking-widest uppercase font-body text-rose hover:text-rose-deep">
                            Send Proof →
                          </a>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}