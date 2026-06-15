import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, Shield, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch { toast.error('Failed to load users.'); }
      setLoading(false);
    };
    fetch();
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!confirm(`${newRole === 'admin' ? 'Grant admin access' : 'Remove admin access'} for ${user.fullName}?`)) return;
    setUpdating(user.id);
    try {
      await updateDoc(doc(db, 'users', user.id), { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}.`);
    } catch { toast.error('Update failed.'); }
    setUpdating(null);
  };

  const filtered = users.filter(u =>
    !search ||
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (ts) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <Helmet><title>Users | Admin</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="section-label">Manage</span>
            <h1 className="font-display text-4xl text-charcoal">Users</h1>
          </div>
          <span className="text-sm font-body text-warm-gray bg-white border border-gold/15 px-4 py-2">
            {users.length} registered users
          </span>
        </div>

        {/* Search */}
        <div className="bg-white border border-gold/15 p-4 mb-6">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray/50" />
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={e => setSearch(e.target.value)} className="input-luxury pl-9 py-2.5 text-sm" />
          </div>
        </div>

        <div className="bg-white border border-gold/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gold/10 bg-cream/50">
                  {['User', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-[10px] tracking-widest uppercase font-body text-warm-gray/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/8">
                {loading ? (
                  Array(5).fill(null).map((_, i) => (
                    <tr key={i}>{Array(6).fill(null).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="shimmer h-4 w-full rounded" /></td>
                    ))}</tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-warm-gray font-body">No users found.</td></tr>
                ) : (
                  filtered.map(user => (
                    <tr key={user.id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose/20 to-gold/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-display text-rose">{(user.fullName || 'U')[0]}</span>
                          </div>
                          <p className="text-sm font-body font-500 text-charcoal">{user.fullName || '—'}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-body text-warm-gray">{user.email}</td>
                      <td className="px-5 py-4 text-sm font-body text-warm-gray">{user.phone || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-body px-2.5 py-1 border ${
                          user.role === 'admin'
                            ? 'text-purple-600 bg-purple-50 border-purple-200'
                            : 'text-warm-gray bg-gray-50 border-gray-200'
                        }`}>
                          {user.role === 'admin' && <Shield size={11} />}
                          {user.role || 'customer'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-body text-warm-gray">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleRole(user)}
                          disabled={updating === user.id}
                          className={`text-[10px] tracking-widest uppercase font-body px-3 py-1.5 border transition-all disabled:opacity-40 ${
                            user.role === 'admin'
                              ? 'border-red-200 text-red-400 hover:border-red-400'
                              : 'border-purple-200 text-purple-500 hover:border-purple-400'
                          }`}
                        >
                          {updating === user.id ? '...' : user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
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
