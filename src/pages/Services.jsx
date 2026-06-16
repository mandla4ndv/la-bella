import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import Layout from '../components/layout/Layout';
import { Clock, ArrowRight } from 'lucide-react';

const FALLBACK_SERVICES = [
  // Facials & Skin Care
  { id: '1', name: 'LED Facial: Acne & Scarring', description: 'Targeted LED light therapy to reduce active acne breakouts and minimize the appearance of acne scarring.', price: 200, duration: 30, category: 'Facials', active: true },
  { id: '2', name: 'LED Facial: Pigmentation', description: 'Advanced LED treatment focused on breaking down dark spots and evening out overall skin pigmentation.', price: 200, duration: 30, category: 'Facials', active: true },
  { id: '3', name: 'LED Facial: Spider Veins', description: 'Specialized LED therapy to calm redness and reduce the visible appearance of superficial spider veins.', price: 200, duration: 30, category: 'Facials', active: true },
  { id: '4', name: 'LED Facial: Skin Rejuvenation', description: 'Revitalizing LED light therapy to boost collagen production and restore a healthy, youthful glow.', price: 200, duration: 30, category: 'Facials', active: true },
  { id: '5', name: 'Basic Facial', description: 'A refreshing introductory facial tailored to your skin type to cleanse, tone, and hydrate.', price: 350, duration: 60, category: 'Facials', active: true },
  { id: '6', name: 'Basic Facial with Mask/Scrub', description: 'Our standard facial elevated with a customized exfoliating scrub and nourishing mask for deeper results.', price: 400, duration: 60, category: 'Facials', active: true },
  { id: '7', name: 'Deep Cleansing Facial', description: 'Thorough cleansing, exfoliation, and extraction to clear congested pores and deeply refresh your skin.', price: 450, duration: 60, category: 'Facials', active: true },

  // Hair Removal
  { id: '8', name: 'Hair Removal: Upper Lip & Chin', description: 'Quick and effective hair removal for the delicate upper lip and chin areas.', price: 200, duration: 30, category: 'Hair Removal', active: true },
  { id: '9', name: 'Hair Removal: Brazilian', description: 'Complete and professional hair removal for the bikini area.', price: 450, duration: 45, category: 'Hair Removal', active: true },
  { id: '10', name: 'Hair Removal: Half Legs', description: 'Smooth, long-lasting hair removal for the lower or upper half of the legs.', price: 350, duration: 45, category: 'Hair Removal', active: true },
  { id: '11', name: 'Hair Removal: Male Back', description: 'Comprehensive hair removal targeting the full back area.', price: 450, duration: 45, category: 'Hair Removal', active: true },
  { id: '12', name: 'Hair Removal: Arms', description: 'Effective hair removal for smooth, hair-free arms.', price: 300, duration: 45, category: 'Hair Removal', active: true },
  { id: '13', name: 'Hair Removal: Face', description: 'Gentle and precise hair removal for the full facial area.', price: 300, duration: 30, category: 'Hair Removal', active: true },
  { id: '14', name: 'Hair Removal: Full Legs', description: 'Complete hair removal from upper thighs to ankles. (Alternatively R250 per leg).', price: 500, duration: 60, category: 'Hair Removal', active: true },
  { id: '15', name: 'Hair Removal: Under Arms', description: 'Quick and lasting hair removal for smooth underarms.', price: 300, duration: 30, category: 'Hair Removal', active: true },
  { id: '16', name: 'Hair Removal: Anal', description: 'Professional and discreet hair removal for targeted sensitive areas.', price: 550, duration: 30, category: 'Hair Removal', active: true },
  { id: '17', name: 'Hair Removal: Head', description: 'Specialized complete hair removal for the scalp area.', price: 600, duration: 45, category: 'Hair Removal', active: true },
  { id: '18', name: 'Hair Removal: Chest', description: 'Effective hair removal focused on the chest area.', price: 400, duration: 45, category: 'Hair Removal', active: true },

  // IPL Treatments
  { id: '19', name: 'IPL: Acne & Scarring', description: 'Intense Pulsed Light therapy targeting acne-causing bacteria and breaking down scar tissue.', price: 250, duration: 30, category: 'IPL Treatments', active: true },
  { id: '20', name: 'IPL: Pigmentation', description: 'Targeted light therapy to shatter excess melanin and clear dark spots for a more even complexion.', price: 250, duration: 30, category: 'IPL Treatments', active: true },
  { id: '21', name: 'IPL: Spider Veins', description: 'Effective IPL treatment that safely collapses and diminishes the appearance of superficial veins.', price: 350, duration: 30, category: 'IPL Treatments', active: true },
  { id: '22', name: 'IPL: Skin Rejuvenation', description: 'Broad-spectrum light therapy to stimulate collagen, improve texture, and restore skin radiance.', price: 350, duration: 30, category: 'IPL Treatments', active: true },

  // Slimming Treatments
  { id: '23', name: 'Laser Lipo', description: 'Instant, non-invasive fat reduction using low-level laser therapy to shrink fat cells.', price: 250, duration: 20, category: 'Slimming Treatments', active: true },
  { id: '24', name: 'Cavitation', description: 'Ultrasound technology that breaks down fat cells instantly for targeted non-surgical slimming.', price: 250, duration: 20, category: 'Slimming Treatments', active: true },
  { id: '25', name: 'Visible Cellulite Reduction', description: 'Advanced treatment focused on smoothing the skin and significantly reducing the appearance of cellulite.', price: 350, duration: 40, category: 'Slimming Treatments', active: true },
  { id: '26', name: 'Infrared Sauna Blanket', description: 'Deep penetrating heat therapy to detoxify the body, burn calories, and improve circulation.', price: 250, duration: 20, category: 'Slimming Treatments', active: true },
  { id: '27', name: 'Sauna Blanket & Cavitation', description: 'A powerful combination of ultrasound fat breakdown and infrared detoxification for maximum results.', price: 450, duration: 40, category: 'Slimming Treatments', active: true },
  { id: '28', name: 'Fat Freeze', description: 'Cryolipolysis treatment that freezes and permanently destroys stubborn fat cells.', price: 550, duration: 60, category: 'Slimming Treatments', active: true },

  // Non-Surgical Body Contouring
  { id: '29', name: 'Breast / Bum Augmentation', description: 'Non-surgical vacuum therapy designed to safely lift, tone, and enhance volume in targeted areas.', price: 450, duration: 45, category: 'Body Contouring', active: true },
  
  // Skin Tightening
  { id: '30', name: 'Skin Tightening: Abdomen', description: 'Firm and tighten loose or sagging skin on the stomach area.', price: 400, duration: 60, category: 'Skin Tightening', active: true },
  { id: '31', name: 'Skin Tightening: Hands', description: 'Restore youthfulness to the hands by tightening the skin. (Alternatively R200 per hand).', price: 400, duration: 60, category: 'Skin Tightening', active: true },
  { id: '32', name: 'Skin Tightening: Love Handles', description: 'Targeted skin firming and contouring for the flanks and love handles.', price: 400, duration: 60, category: 'Skin Tightening', active: true },
  { id: '33', name: 'Skin Tightening: Double Chin', description: 'Firm and sculpt the skin under the chin and along the jawline.', price: 250, duration: 30, category: 'Skin Tightening', active: true },
  { id: '34', name: 'Skin Tightening: Thighs', description: 'Tighten and smooth the skin on the upper legs. (Alternatively R200 per leg).', price: 400, duration: 60, category: 'Skin Tightening', active: true },
  { id: '35', name: 'Skin Tightening: Chest', description: 'Firming treatment focused on improving skin elasticity on the chest area.', price: 350, duration: 30, category: 'Skin Tightening', active: true },
  { id: '36', name: 'Skin Tightening: Saddle Bags', description: 'Contour and tighten the skin around the lower back and saddle bag area.', price: 400, duration: 60, category: 'Skin Tightening', active: true },

  // Specialized Treatments
  { id: '37', name: 'Radio Frequency: Anti-Aging', description: 'Advanced RF technology to deeply heat the skin, boost collagen, and combat signs of aging.', price: 450, duration: 50, category: 'Specialized Treatments', active: true },
  { id: '38', name: 'Radio Frequency: Wrinkle Reduction', description: 'Targeted RF treatment specifically focused on smoothing out fine lines and deeper wrinkles.', price: 450, duration: 50, category: 'Specialized Treatments', active: true },
  { id: '39', name: 'Bedroom Vitality (External)', description: 'Specialized rejuvenation treatment for the labia majora.', price: 600, duration: 30, category: 'Specialized Treatments', active: true },
  { id: '40', name: 'Reduction of Scarring & Stretch Marks', description: 'Advanced resurfacing to fade stretch marks and scars. (Price is per area).', price: 400, duration: 30, category: 'Specialized Treatments', active: true },
  { id: '41', name: 'Laser Hair Regrowth', description: 'Stimulate dormant hair follicles and encourage natural hair regrowth using laser therapy.', price: 180, duration: 30, category: 'Specialized Treatments', active: true },

  // Massages
  { id: '42', name: 'Swedish Relax Massage (Full Body - 60 Min)', description: 'A classic 60-minute therapeutic massage to melt away tension and promote full-body relaxation.', price: 550, duration: 60, category: 'Massages', active: true },
  { id: '43', name: 'Swedish Relax Massage (Full Body - 90 Min)', description: 'An extended 90-minute luxurious massage for deep relaxation and stress relief.', price: 750, duration: 90, category: 'Massages', active: true },
  { id: '44', name: 'Swedish Massage: Back & Neck', description: 'Targeted relief for tension held in the upper back, shoulders, and neck.', price: 350, duration: 30, category: 'Massages', active: true },
  { id: '45', name: 'Swedish Massage: Hand & Foot', description: 'A soothing massage focused on the pressure points of the hands and feet.', price: 250, duration: 30, category: 'Massages', active: true },
  { id: '46', name: 'Hot Stone Massage (Full Body - 90 Min)', description: 'Heated stones are used alongside massage techniques to deeply relax muscles and ease stiffness.', price: 700, duration: 90, category: 'Massages', active: true },
  { id: '47', name: 'Hot Stone Massage: Back & Neck', description: 'Targeted hot stone therapy to release deep knots and tension in the back and neck.', price: 400, duration: 30, category: 'Massages', active: true },
  { id: '48', name: 'Indian Massage (30 Min)', description: 'A traditional, invigorating 30-minute massage technique to balance energy and relieve stress.', price: 300, duration: 30, category: 'Massages', active: true },
  { id: '49', name: 'Indian Massage (60 Min)', description: 'An extended, immersive 60-minute traditional Indian massage experience.', price: 450, duration: 60, category: 'Massages', active: true }
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
