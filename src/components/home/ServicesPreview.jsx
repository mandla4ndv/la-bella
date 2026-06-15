import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowRight } from 'lucide-react';

const FALLBACK_SERVICES = [
  { id: '1', name: 'Advanced Facials', description: 'Customised facial treatments targeting your unique skin concerns for a radiant, healthy glow.', price: 650, duration: 60, category: 'Facials' },
  { id: '2', name: 'Microneedling', description: 'Stimulate collagen production and improve skin texture with our precision microneedling treatment.', price: 1200, duration: 90, category: 'Skin Treatments' },
  { id: '3', name: 'Chemical Peels', description: 'Resurface your skin and reveal a brighter, more youthful complexion with our tailored chemical peels.', price: 850, duration: 60, category: 'Skin Treatments' },
  { id: '4', name: 'Lash Extensions', description: 'Enhance your natural lashes with our premium extensions for effortlessly glamorous eyes.', price: 750, duration: 120, category: 'Lashes' },
  { id: '5', name: 'Brow Design', description: 'Expertly shaped and defined brows to frame your face and enhance your natural features.', price: 350, duration: 45, category: 'Brows' },
  { id: '6', name: 'Aesthetic Treatments', description: 'Comprehensive aesthetic procedures to address specific concerns and enhance your natural beauty.', price: 1500, duration: 90, category: 'Aesthetic' },
];

const CATEGORY_ICONS = {
  'Facials': '✦',
  'Skin Treatments': '◇',
  'Lashes': '◈',
  'Brows': '◉',
  'Aesthetic': '⬡',
  'Peels': '✧',
};

export default function ServicesPreview() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'services'), where('active', '==', true), limit(6));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (e) { /* use fallback */ }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <section className="py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-18"
        >
          <span className="section-label">Our Treatments</span>
          <h2 className="section-title">Services Crafted for You</h2>
          <div className="gold-divider" />
          <p className="text-warm-gray font-body font-300 max-w-xl mx-auto mt-4 leading-relaxed">
            Each treatment is personalised to your unique skin needs, combining the latest techniques with premium products for visible, lasting results.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-gold/15">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group border-r border-b border-gold/15 p-8 hover:bg-cream transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-2xl text-gold/60 group-hover:text-gold transition-colors">
                  {CATEGORY_ICONS[service.category] || '✦'}
                </span>
                <span className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60 bg-gold/10 px-3 py-1">
                  {service.category}
                </span>
              </div>

              <h3 className="font-display text-2xl text-charcoal mb-3 group-hover:text-rose transition-colors">
                {service.name}
              </h3>
              <p className="text-sm text-warm-gray font-body leading-relaxed mb-6 font-300">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gold/10">
                <div>
                  <p className="text-xs text-warm-gray/60 font-body uppercase tracking-wider mb-0.5">From</p>
                  <p className="font-display text-2xl text-charcoal">R{service.price?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-warm-gray/60 font-body uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="text-sm font-body font-500 text-warm-gray">{service.duration} min</p>
                </div>
              </div>

              <Link to="/booking" className="mt-4 flex items-center gap-2 text-[10px] tracking-widest uppercase font-body text-rose opacity-0 group-hover:opacity-100 transition-all duration-300 hover:gap-3">
                Book this treatment <ArrowRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link to="/services" className="btn-outline">
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
