import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowRight } from 'lucide-react';

const PLACEHOLDER_COLORS = [
  'from-rose/20 to-blush/30',
  'from-gold/15 to-cream',
  'from-blush/25 to-rose/15',
  'from-gold/20 to-rose/10',
  'from-rose/15 to-gold/20',
  'from-blush/30 to-gold/15',
];

export default function GalleryPreview() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(6));
        const snap = await getDocs(q);
        setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {}
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <section className="py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <span className="section-label">Portfolio</span>
            <h2 className="section-title">Our Work Speaks</h2>
            <div className="w-12 h-px bg-gold mt-5" />
          </div>
          <Link to="/gallery" className="btn-ghost flex items-center gap-2 hover:gap-3 transition-all">
            View Full Gallery <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(images.length > 0 ? images : Array(6).fill(null)).map((img, i) => (
            <motion.div
              key={img?.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group relative overflow-hidden ${i === 0 ? 'md:row-span-2' : ''}`}
            >
              <div className={`w-full ${i === 0 ? 'aspect-[3/4]' : 'aspect-square'} bg-gradient-to-br ${PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]} relative`}>
                {img?.url ? (
                  <img src={img.url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center opacity-40">
                      <div className="w-12 h-12 rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto mb-3">
                        <span className="text-gold font-display text-lg">✦</span>
                      </div>
                      <p className="text-xs tracking-widest uppercase font-body text-warm-gray">
                        {['Facials', 'Skin', 'Lashes', 'Brows', 'Before/After', 'Treatments'][i]}
                      </p>
                    </div>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-500 flex items-center justify-center">
                  <p className="text-cream text-xs tracking-widest uppercase font-body opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {img?.category || ['Facials', 'Skin', 'Lashes', 'Brows', 'Before/After', 'Treatments'][i]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
