import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'pending_payment', label: 'Pending Payment', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'deposit_received', label: 'Deposit Received', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'confirmed', label: 'Confirmed', color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'completed', label: 'Completed', color: 'text-gray-500 bg-gray-50 border-gray-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-500 bg-red-50 border-red-200' },
  { value: 'no_show', label: 'No Show', color: 'text-red-500 bg-red-50 border-red-200' },
];

function getStatusConfig(value) {
  return STATUSES.find(s => s.value === value) || STATUSES[0];
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [updating, setUpdating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')));
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { toast.error('Failed to load appointments.'); }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, 'appointments', id), { status: newStatus });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast.success('Status updated!');
    } catch { toast.error('Update failed.'); }
    setUpdating(null);
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filtered = appointments.filter(a => {
    const matchSearch = !search ||
      a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a.reference?.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchDate = !filterDate || a.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  return (
    <>
      <Helmet><title>Appointments | Admin</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="section-label">Manage</span>
            <h1 className="font-display text-4xl text-charcoal">Appointments</h1>
          </div>
          <span className="text-sm font-body text-warm-gray bg-white border border-gold/15 px-4 py-2">
            {filtered.length} of {appointments.length} appointments
          </span>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gold/15 p-5 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray/50" />
            <input
              type="text" placeholder="Search by name, reference, service..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-luxury pl-9 py-2.5 text-sm"
            />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="input-luxury py-2.5 text-sm max-w-xs">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="input-luxury py-2.5 text-sm max-w-[170px]" />
          {(search || filterStatus !== 'all' || filterDate) && (
            <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterDate(''); }}
              className="text-xs tracking-widest uppercase font-body text-rose hover:text-rose-deep whitespace-nowrap">
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-gold/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gold/10 bg-cream/50">
                  {['Ref', 'Client', 'Service', 'Date & Time', 'Amount / Deposit', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-[10px] tracking-widest uppercase font-body text-warm-gray/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/8">
                {loading ? (
                  Array(6).fill(null).map((_, i) => (
                    <tr key={i}>
                      {Array(7).fill(null).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="shimmer h-4 w-full rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-warm-gray font-body">
                      No appointments match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map(appt => {
                    const sc = getStatusConfig(appt.status);
                    const isExpanded = expandedId === appt.id;
                    return (
                      <>
                        <tr key={appt.id}
                          className="hover:bg-cream/30 transition-colors cursor-pointer"
                          onClick={() => setExpandedId(isExpanded ? null : appt.id)}
                        >
                          <td className="px-5 py-4 text-xs font-body font-500 text-rose">{appt.reference}</td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-body font-500 text-charcoal">{appt.fullName}</p>
                            <p className="text-xs text-warm-gray font-body">{appt.phone}</p>
                          </td>
                          <td className="px-5 py-4 text-sm font-body text-warm-gray">{appt.serviceName}</td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-body text-charcoal">{formatDate(appt.date)}</p>
                            <p className="text-xs text-warm-gray font-body">{appt.time}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-body font-500 text-charcoal">R{appt.servicePrice?.toLocaleString()}</p>
                            <p className="text-xs text-warm-gray font-body">Dep: R{appt.deposit?.toLocaleString()}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] tracking-wider uppercase font-body px-2.5 py-1 border ${sc.color}`}>
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <ChevronDown size={15} className={`text-warm-gray transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </td>
                        </tr>

                        {/* Expanded row */}
                        {isExpanded && (
                          <tr key={`${appt.id}-expanded`} className="bg-cream/60">
                            <td colSpan={7} className="px-5 py-5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                  <p className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60 mb-3">Contact Info</p>
                                  <p className="text-sm font-body text-charcoal">{appt.fullName}</p>
                                  <p className="text-sm font-body text-warm-gray">{appt.email}</p>
                                  <p className="text-sm font-body text-warm-gray">{appt.phone}</p>
                                </div>
                                {appt.notes && (
                                  <div>
                                    <p className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60 mb-3">Notes</p>
                                    <p className="text-sm font-body text-warm-gray">{appt.notes}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60 mb-3">Update Status</p>
                                  <div className="flex flex-wrap gap-2">
                                    {STATUSES.map(s => (
                                      <button
                                        key={s.value}
                                        disabled={appt.status === s.value || updating === appt.id}
                                        onClick={e => { e.stopPropagation(); updateStatus(appt.id, s.value); }}
                                        className={`text-[10px] tracking-wider uppercase font-body px-3 py-1.5 border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                          appt.status === s.value ? `${s.color} cursor-default` : 'border-gold/20 text-warm-gray hover:border-gold'
                                        }`}
                                      >
                                        {updating === appt.id ? '...' : s.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
}
