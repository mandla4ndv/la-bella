import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import Layout from '../components/layout/Layout';
import { Clock, ArrowRight } from 'lucide-react';

const FALLBACK_SERVICES = [
  { id: '1', name: 'Signature Facial', description: 'Our bespoke facial tailored to your skin type. Includes deep cleanse, exfoliation, extraction, mask and professional serum application. Leaves skin luminous and refreshed.', price: 650, duration: 75, category: 'Facials', active: true },
  { id: '2', name: 'Anti-Aging Facial', description: 'Target fine lines and loss of firmness with our potent anti-aging facial using peptide-rich serums and lifting massage techniques.', price: 850, duration: 90, category: 'Facials', active: true },
  { id: '3', name: 'Microneedling', description: 'Stimulate collagen with precision microneedling. Improves texture, reduces scarring and hyperpigmentation. Includes numbing and post-treatment serum.', price: 1200, duration: 90, category: 'Skin Treatments', active: true },
  { id: '4', name: 'Chemical Peel (Light)', description: 'Gentle resurfacing peel to brighten complexion and improve skin texture. Ideal for first-time peel clients.', price: 750, duration: 60, category: 'Skin Treatments', active: true },
  { id: '5', name: 'Chemical Peel (Medium)', description: 'Deeper resurfacing for more significant skin concerns including hyperpigmentation, acne scarring and uneven tone.', price: 1100, duration: 75, category: 'Skin Treatments', active: true },
  { id: '6', name: 'Classic Lash Extensions', description: 'Natural-looking individual lash extensions for an effortless, wide-eyed effect. Long-lasting and low maintenance.', price: 750, duration: 120, category: 'Lashes', active: true },
  { id: '7', name: 'Volume Lash Extensions', description: 'Luxurious volume fans for dramatic, full lashes. Perfect for a glamorous, statement look.', price: 950, duration: 150, category: 'Lashes', active: true },
  { id: '8', name: 'Lash Lift & Tint', description: 'Semi-permanent curl and darkening of your natural lashes. No extensions required — just beautifully lifted lashes.', price: 550, duration: 75, category: 'Lashes', active: true },
  { id: '9', name: 'Brow Design & Tint', description: 'Expert shaping using a mix of waxing and threading, followed by tinting for defined, natural-looking brows.', price: 350, duration: 45, category: 'Brows', active: true },
  { id: '10', name: 'Brow Lamination', description: 'Straighten and set brow hairs in your desired shape for full, fluffy, "soap brow" effect that lasts 6-8 weeks.', price: 480, duration: 60, category: 'Brows', active: true },
];

const CATEGORIES = ['All', 'Facials', 'Skin Treatments', 'Lashes', 'Brows', 'Aesthetic'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'services'), where('active', '==', true), orderBy('category'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setServices(FALLBACK_SERVICES);
        }
      } catch (e) {
        setServices(FALLBACK_SERVICES);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  return (
    <Layout>
      <Helmet>
        <title>Services | La Bella Aesthetic Polokwane</title>
        <meta name="description" content="Browse our full range of aesthetic treatments in Polokwane. Facials, microneedling, chemical peels, lash extensions, brow treatments and more." />
      </Helmet>

      {/* Page Header */}
      <div className="pt-40 pb-20 bg-gradient-to-b from-cream to-white px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-label">What We Offer</span>
            <h1 className="section-title mb-4">Our Treatments</h1>
            <div className="gold-divider" />
            <p className="text-warm-gray font-body font-300 leading-relaxed mt-6">
              Each treatment is expertly designed and personalised to your unique skin type and beauty goals.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-y border-gold/15 px-6 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-5 text-[10px] tracking-widest uppercase font-body whitespace-nowrap transition-all border-b-2 ${
                  activeCategory === cat
                    ? 'border-rose text-rose'
                    : 'border-transparent text-warm-gray hover:text-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20 px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="shimmer h-72 rounded-none" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group bg-cream border border-gold/15 p-8 hover:border-gold/40 hover:shadow-lg hover:shadow-rose/5 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-[10px] tracking-widest uppercase font-body text-gold bg-gold/10 px-3 py-1">
                      {service.category}
                    </span>
                    <div className="flex items-center gap-1 text-warm-gray/60">
                      <Clock size={12} />
                      <span className="text-xs font-body">{service.duration} min</span>
                    </div>
                  </div>

                  <h3 className="font-display text-2xl text-charcoal mb-3 group-hover:text-rose transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-warm-gray font-body leading-relaxed mb-6 font-300">
                    {service.description}
                  </p>

                  {service.beforeAfter && service.beforeAfter.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {service.beforeAfter.slice(0, 2).map((img, j) => (
                        <div key={j} className="aspect-square bg-blush/30 overflow-hidden">
                          <img src={img} alt="Before/After" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end justify-between pt-5 border-t border-gold/15">
                    <div>
                      <p className="text-[10px] text-warm-gray/60 font-body uppercase tracking-wider mb-0.5">Price</p>
                      <p className="font-display text-3xl text-charcoal">R{service.price?.toLocaleString()}</p>
                      <p className="text-[10px] text-warm-gray/60 font-body mt-0.5">
                        Deposit: R{Math.round((service.price || 0) * 0.5)?.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      to={`/booking?service=${service.id}`}
                      className="btn-primary text-[10px] py-3 px-5 flex items-center gap-2 group"
                    >
                      Book <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
