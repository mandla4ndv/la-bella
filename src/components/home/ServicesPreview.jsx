import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowRight } from 'lucide-react';

const FALLBACK_SERVICES = [
  { 
    id: '1', 
    name: 'Cavitation (Fat Reduction)', 
    description: 'Non-invasive body contouring treatment to break down fat cells and reshape your body.', 
    price: 250, 
    duration: 20, 
    category: 'Body Contouring' 
  },
  { 
    id: '2', 
    name: 'Laser Lipo (Fat Reduction)', 
    description: 'Advanced laser technology to target and reduce stubborn fat deposits for a slimmer silhouette.', 
    price: 250, 
    duration: 20, 
    category: 'Body Contouring' 
  },
  { 
    id: '3', 
    name: 'Skin Tightening', 
    description: 'Firm and lift sagging skin to restore a youthful, toned appearance to your face or body.', 
    price: 350, 
    duration: 60, 
    category: 'Skin Treatments' 
  },
  { 
    id: '4', 
    name: 'Permanent Hair Removal', 
    description: 'Long-lasting hair reduction using advanced laser technology for smooth, hair-free skin.', 
    price: 300, 
    duration: 20, 
    category: 'Laser Treatments' 
  },
  { 
    id: '5', 
    name: 'Massage Therapies', 
    description: 'Relaxing and therapeutic massages to relieve tension, improve circulation, and promote wellness.', 
    price: 550, 
    duration: 60, 
    category: 'Wellness' 
  },
  { 
    id: '6', 
    name: 'Skin Rejuvenation', 
    description: 'Revitalize dull, tired skin to restore a bright, healthy, and radiant complexion.', 
    price: 950, 
    duration: 60, 
    category: 'Skin Treatments' 
  },
  { 
    id: '7', 
    name: 'Laser Hair Regrowth', 
    description: 'Stimulate hair follicles and promote natural hair growth with targeted laser therapy.', 
    price: 350, 
    duration: 30, 
    category: 'Hair Treatments' 
  },
  { 
    id: '8', 
    name: 'Deep Cleaning Facial', 
    description: 'Thorough cleansing, exfoliation, and extraction to clear pores and refresh your skin.', 
    price: 450, 
    duration: 30, 
    category: 'Facials' 
  },
  { 
    id: '9', 
    name: 'Reduction of Pigmentation', 
    description: 'Target dark spots and uneven skin tone for a clear, luminous, and balanced complexion.', 
    price: 200, 
    duration: 30, 
    category: 'Skin Treatments' 
  },
  { 
    id: '10', 
    name: 'Reduction of Acne Scarring', 
    description: 'Advanced resurfacing treatments to smooth skin texture and minimize the appearance of acne scars.', 
    price: 200, 
    duration: 30, 
    category: 'Skin Treatments' 
  },
  { 
    id: '11', 
    name: 'Reduction of Spider Veins', 
    description: 'Safely and effectively diminish the appearance of superficial spider veins for clearer skin.', 
    price: 200, 
    duration: 30, 
    category: 'Laser Treatments' 
  },
  { 
    id: '12', 
    name: 'Anti-Aging & Wrinkle Reduction', 
    description: 'Targeted aesthetic treatments to smooth fine lines and restore youthful volume to your face.', 
    price: 450, 
    duration: 50, 
    category: 'Aesthetic' 
  },
  { 
    id: '13', 
    name: 'Breast/Bum Augmentation (Vacuum)', 
    description: 'Non-surgical vacuum therapy to lift, tone, and enhance the volume of targeted areas.', 
    price: 450, 
    duration: 45, 
    category: 'Body Contouring' 
  }
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
          Please feel free to consult on our WhatsApp line for more services. Note prices may vary based on individual needs and treatment plans.
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
