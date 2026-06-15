import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Layout from '../components/layout/Layout';
import { X, ZoomIn } from 'lucide-react';

const CATEGORIES = ['All', 'Skin Treatments', 'Lashes', 'Brows', 'Facials', 'Before & After'];

const PLACEHOLDER_ITEMS = Array(12).fill(null).map((_, i) => ({
  id: String(i),
  category: CATEGORIES[1 + (i % 5)],
  url: null,
  caption: CATEGORIES[1 + (i % 5)],
}));

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setImages(PLACEHOLDER_ITEMS);
        }
      } catch { setImages(PLACEHOLDER_ITEMS); }
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = activeCategory === 'All' ? images : images.filter(img => img.category === activeCategory);

  const COLORS = ['from-rose/15 to-blush/25','from-gold/12 to-cream','from-blush/20 to-rose/10','from-gold/18 to-rose/8','from-rose/10 to-gold/15','from-blush/25 to-gold/12'];

  return (
    <Layout>
      <Helmet>
        <title>Gallery | La Bella Aesthetic Polokwane</title>
        <meta name="description" content="Browse our gallery of stunning results. See our work in facials, microneedling, lash extensions, brow treatments and more." />
      </Helmet>

      <div className="pt-40 pb-20 bg-gradient-to-b from-cream to-white px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-label">Portfolio</span>
          <h1 className="section-title">Our Work</h1>
          <div className="gold-divider" />
          <p className="text-warm-gray font-body font-300 max-w-md mx-auto mt-5 leading-relaxed">
            Every result tells a story. Browse our gallery of transformations and discover what's possible.
          </p>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="bg-white border-y border-gold/15 px-6 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto flex gap-0 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-5 text-[10px] tracking-widest uppercase font-body whitespace-nowrap transition-all border-b-2 ${
                activeCategory === cat ? 'border-rose text-rose' : 'border-transparent text-warm-gray hover:text-charcoal'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Masonry */}
      <div className="py-16 px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array(8).fill(null).map((_, i) => (
                <div key={i} className="shimmer aspect-square" />
              ))}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="break-inside-avoid group relative cursor-pointer"
                  onClick={() => setLightbox(img)}
                >
                  <div className={`w-full bg-gradient-to-br ${COLORS[i % COLORS.length]} relative overflow-hidden`}
                    style={{ aspectRatio: i % 5 === 0 ? '3/4' : i % 3 === 0 ? '4/3' : '1/1' }}>
                    {img.url ? (
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30">
                        <div className="text-center">
                          <span className="font-display text-3xl text-rose">✦</span>
                          <p className="text-[10px] tracking-widest uppercase font-body text-warm-gray mt-2">{img.caption}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-400 flex items-center justify-center">
                      <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-[9px] tracking-widest uppercase text-cream font-body">{img.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 w-10 h-10 border border-cream/20 flex items-center justify-center text-cream hover:text-gold transition-colors">
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-2xl w-full max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              {lightbox.url ? (
                <img src={lightbox.url} alt={lightbox.caption} className="w-full h-full object-contain" />
              ) : (
                <div className={`w-full aspect-square bg-gradient-to-br ${COLORS[0]} flex items-center justify-center`}>
                  <p className="font-display text-3xl text-charcoal/40">{lightbox.caption}</p>
                </div>
              )}
              {lightbox.caption && (
                <p className="text-cream/60 text-xs tracking-widest uppercase font-body text-center mt-4">{lightbox.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
