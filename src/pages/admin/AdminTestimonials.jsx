import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, X, Check, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', service: '', rating: 5, text: '', active: true };

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'testimonials'));
      setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { toast.error('Failed to load testimonials.'); }
    setLoading(false);
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
  const openEdit = (t) => { setForm({ name: t.name, service: t.service, rating: t.rating, text: t.text, active: t.active ?? true }); setEditingId(t.id); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.text) { toast.error('Name and review text are required.'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), { ...form, updatedAt: serverTimestamp() });
        toast.success('Testimonial updated!');
      } else {
        await addDoc(collection(db, 'testimonials'), { ...form, createdAt: serverTimestamp() });
        toast.success('Testimonial added!');
      }
      setShowModal(false);
      fetchTestimonials();
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast.success('Deleted.');
    } catch { toast.error('Delete failed.'); }
  };

  const toggleActive = async (t) => {
    try {
      await updateDoc(doc(db, 'testimonials', t.id), { active: !t.active });
      setTestimonials(prev => prev.map(item => item.id === t.id ? { ...item, active: !item.active } : item));
    } catch { toast.error('Update failed.'); }
  };

  return (
    <>
      <Helmet><title>Testimonials | Admin</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="section-label">Manage</span>
            <h1 className="font-display text-4xl text-charcoal">Testimonials</h1>
          </div>
          <button onClick={openCreate} className="btn-primary"><Plus size={14} /> Add Review</button>
        </div>

        {loading ? (
          <div className="space-y-4">{Array(4).fill(null).map((_, i) => <div key={i} className="shimmer h-28 rounded-none" />)}</div>
        ) : testimonials.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gold/15">
            <Star size={36} className="text-gold/30 mx-auto mb-3" />
            <p className="font-display text-2xl text-charcoal/40 mb-2">No testimonials yet</p>
            <button onClick={openCreate} className="btn-primary mt-4">Add First Review</button>
          </div>
        ) : (
          <div className="bg-white border border-gold/15 divide-y divide-gold/8">
            {testimonials.map(t => (
              <div key={t.id} className={`p-5 flex gap-4 ${!t.active ? 'opacity-50' : ''}`}>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="font-body font-500 text-charcoal">{t.name}</p>
                    <span className="text-[10px] tracking-widest uppercase font-body text-gold">{t.service}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12} className={i <= t.rating ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                    {!t.active && <span className="text-[10px] font-body text-warm-gray/50 border border-warm-gray/20 px-2 py-0.5">Hidden</span>}
                  </div>
                  <p className="text-sm text-warm-gray font-body font-300 leading-relaxed line-clamp-2">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(t)} title={t.active ? 'Hide' : 'Show'}>
                    {t.active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-warm-gray" />}
                  </button>
                  <button onClick={() => openEdit(t)} className="w-8 h-8 border border-gold/20 flex items-center justify-center hover:border-gold transition-all text-warm-gray">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="w-8 h-8 border border-red-100 flex items-center justify-center hover:border-red-300 text-red-400 hover:text-red-500 transition-all">
                    <Trash2 size={13} />
                  </button>
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-gold/15">
                <h2 className="font-display text-2xl text-charcoal">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button onClick={() => setShowModal(false)} className="text-warm-gray hover:text-rose"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label mb-2">Client Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Thandi M." className="input-luxury" />
                  </div>
                  <div>
                    <label className="section-label mb-2">Service</label>
                    <input type="text" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      placeholder="e.g. Microneedling" className="input-luxury" />
                  </div>
                </div>
                <div>
                  <label className="section-label mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} type="button" onClick={() => setForm(f => ({ ...f, rating: i }))}>
                        <Star size={22} className={i <= form.rating ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="section-label mb-2">Review Text *</label>
                  <textarea rows={4} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    placeholder="Write the client's review..." className="input-luxury resize-none" />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? 'bg-green-400' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? 'left-5' : 'left-1'}`} />
                  </button>
                  <span className="text-sm font-body text-charcoal">Show on website</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-5 border-t border-gold/15">
                <button onClick={() => setShowModal(false)} className="btn-outline py-2.5 px-6 text-xs">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6 text-xs disabled:opacity-50">
                  <Check size={13} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
