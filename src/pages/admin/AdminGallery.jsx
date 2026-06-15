import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Upload, Trash2, X, Image, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Skin Treatments', 'Lashes', 'Brows', 'Facials', 'Before & After', 'General'];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Skin Treatments');
  const [caption, setCaption] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleting, setDeleting] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')));
      setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { toast.error('Failed to load gallery.'); }
    setLoading(false);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    let done = 0;
    for (const file of files) {
      try {
        if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB limit.`); continue; }
        const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await addDoc(collection(db, 'gallery'), {
          url, caption, category: selectedCategory,
          storagePath: storageRef.fullPath,
          createdAt: serverTimestamp(),
        });
        done++;
        setUploadProgress(Math.round((done / files.length) * 100));
      } catch (err) { toast.error(`Failed to upload ${file.name}.`); }
    }
    if (done > 0) toast.success(`${done} image${done > 1 ? 's' : ''} uploaded!`);
    setUploading(false);
    setUploadProgress(0);
    setCaption('');
    fetchImages();
    fileInputRef.current.value = '';
  };

  const handleDelete = async (img) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    setDeleting(img.id);
    try {
      if (img.storagePath) {
        try { await deleteObject(ref(storage, img.storagePath)); } catch {}
      }
      await deleteDoc(doc(db, 'gallery', img.id));
      setImages(prev => prev.filter(i => i.id !== img.id));
      toast.success('Image deleted.');
    } catch { toast.error('Delete failed.'); }
    setDeleting(null);
  };

  const filtered = filterCat === 'All' ? images : images.filter(i => i.category === filterCat);

  return (
    <>
      <Helmet><title>Gallery | Admin</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <span className="section-label">Manage</span>
          <h1 className="font-display text-4xl text-charcoal">Gallery</h1>
        </div>

        {/* Upload Zone */}
        <div className="bg-white border border-gold/15 p-6 mb-8">
          <h2 className="font-display text-xl text-charcoal mb-5">Upload Images</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="section-label mb-2">Category</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="input-luxury">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="section-label mb-2">Caption (Optional)</label>
              <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="e.g. Microneedling result - 3 sessions" className="input-luxury" />
            </div>
          </div>

          {uploading ? (
            <div className="border-2 border-dashed border-gold/30 p-10 text-center">
              <Loader size={28} className="text-gold animate-spin mx-auto mb-3" />
              <p className="text-sm font-body text-warm-gray">Uploading... {uploadProgress}%</p>
              <div className="w-48 h-1.5 bg-gold/10 rounded-full mx-auto mt-3">
                <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gold/30 p-10 text-center cursor-pointer hover:border-gold hover:bg-cream/30 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={28} className="text-gold/50 mx-auto mb-3" />
              <p className="font-body font-500 text-charcoal mb-1">Click or drag images here</p>
              <p className="text-xs text-warm-gray font-body">JPG, PNG, WebP — max 10MB per file. Multiple files supported.</p>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-0 overflow-x-auto border-b border-gold/15 mb-6">
          {['All', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-5 py-3.5 text-[10px] tracking-widest uppercase font-body whitespace-nowrap border-b-2 transition-all ${
                filterCat === cat ? 'border-rose text-rose' : 'border-transparent text-warm-gray hover:text-charcoal'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Image grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array(10).fill(null).map((_, i) => <div key={i} className="shimmer aspect-square" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gold/15">
            <Image size={36} className="text-gold/30 mx-auto mb-3" />
            <p className="font-display text-2xl text-charcoal/40">No images yet</p>
            <p className="text-sm text-warm-gray font-body mt-2">Upload images using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(img => (
              <motion.div key={img.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="group relative aspect-square bg-cream overflow-hidden border border-gold/15">
                <img src={img.url} alt={img.caption || img.category}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <p className="text-[9px] tracking-widest uppercase text-cream font-body px-2 text-center">{img.caption || img.category}</p>
                  <button onClick={() => handleDelete(img)} disabled={deleting === img.id}
                    className="w-9 h-9 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                    {deleting === img.id ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}
