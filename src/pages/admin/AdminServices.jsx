import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Facials', 'Skin Treatments', 'Chemical Peels', 'Lashes', 'Brows', 'Aesthetic Treatments', 'Body Treatments', 'Other'];

const EMPTY_FORM = { name: '', description: '', category: 'Facials', price: '', duration: '', depositPercent: 50, active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'services'), orderBy('category')));
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { toast.error('Failed to load services.'); }
    setLoading(false);
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
  const openEdit = (svc) => {
    setForm({ name: svc.name, description: svc.description, category: svc.category, price: svc.price, duration: svc.duration, depositPercent: svc.depositPercent || 50, active: svc.active ?? true });
    setEditingId(svc.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) { toast.error('Name, price and duration are required.'); return; }
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), duration: Number(form.duration), depositPercent: Number(form.depositPercent) };
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), { ...data, updatedAt: serverTimestamp() });
        toast.success('Service updated!');
      } else {
        await addDoc(collection(db, 'services'), { ...data, createdAt: serverTimestamp() });
        toast.success('Service created!');
      }
      setShowModal(false);
      fetchServices();
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service deleted.');
    } catch { toast.error('Delete failed.'); }
    setDeleting(null);
  };

  const toggleActive = async (svc) => {
    try {
      await updateDoc(doc(db, 'services', svc.id), { active: !svc.active });
      setServices(prev => prev.map(s => s.id === svc.id ? { ...s, active: !s.active } : s));
    } catch { toast.error('Update failed.'); }
  };

  const grouped = services.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});

  return (
    <>
      <Helmet><title>Services | Admin</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="section-label">Manage</span>
            <h1 className="font-display text-4xl text-charcoal">Services</h1>
          </div>
          <button onClick={openCreate} className="btn-primary">
            <Plus size={14} /> Add Service
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">{Array(4).fill(null).map((_, i) => <div key={i} className="shimmer h-20 rounded-none" />)}</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([cat, catServices]) => (
              <div key={cat}>
                <p className="section-label mb-4">{cat}</p>
                <div className="bg-white border border-gold/15 divide-y divide-gold/8">
                  {catServices.map(svc => (
                    <div key={svc.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${!svc.active ? 'opacity-50' : 'hover:bg-cream/30'}`}>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-body font-500 text-charcoal">{svc.name}</p>
                          {!svc.active && <span className="text-[10px] tracking-widest uppercase font-body text-warm-gray/50 border border-warm-gray/20 px-2 py-0.5">Inactive</span>}
                        </div>
                        <p className="text-xs text-warm-gray font-body mt-0.5 truncate max-w-lg">{svc.description}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs font-body text-warm-gray/70">R{svc.price?.toLocaleString()}</span>
                          <span className="text-xs font-body text-warm-gray/70">{svc.duration} min</span>
                          <span className="text-xs font-body text-warm-gray/70">Deposit: {svc.depositPercent || 50}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => toggleActive(svc)} title={svc.active ? 'Deactivate' : 'Activate'}
                          className="text-warm-gray hover:text-rose transition-colors">
                          {svc.active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
                        </button>
                        <button onClick={() => openEdit(svc)} className="w-8 h-8 border border-gold/20 flex items-center justify-center hover:border-gold text-warm-gray hover:text-charcoal transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(svc.id)} disabled={deleting === svc.id}
                          className="w-8 h-8 border border-red-100 flex items-center justify-center hover:border-red-300 text-red-400 hover:text-red-500 transition-all disabled:opacity-40">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/60 flex items-center justify-center p-6"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-gold/15">
                <h2 className="font-display text-2xl text-charcoal">{editingId ? 'Edit Service' : 'New Service'}</h2>
                <button onClick={() => setShowModal(false)} className="text-warm-gray hover:text-rose transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="section-label mb-2">Service Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Signature Facial" className="input-luxury" />
                </div>
                <div>
                  <label className="section-label mb-2">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="input-luxury">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="section-label mb-2">Description</label>
                  <textarea rows={3} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the treatment..." className="input-luxury resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label mb-2">Price (R) *</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="650" className="input-luxury" />
                  </div>
                  <div>
                    <label className="section-label mb-2">Duration (min) *</label>
                    <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                      placeholder="60" className="input-luxury" />
                  </div>
                </div>
                <div>
                  <label className="section-label mb-2">Deposit % (default 50)</label>
                  <input type="number" min={0} max={100} value={form.depositPercent}
                    onChange={e => setForm(f => ({ ...f, depositPercent: e.target.value }))}
                    className="input-luxury max-w-[120px]" />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? 'bg-green-400' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? 'left-5' : 'left-1'}`} />
                  </button>
                  <span className="text-sm font-body text-charcoal">{form.active ? 'Active (visible to clients)' : 'Inactive (hidden)'}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-5 border-t border-gold/15">
                <button onClick={() => setShowModal(false)} className="btn-outline py-2.5 px-6 text-xs">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6 text-xs disabled:opacity-50">
                  <Check size={13} /> {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
