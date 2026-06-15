import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const WHY_US = [
  'Certified aesthetic professionals',
  'Premium medical-grade products',
  'Personalised treatment plans',
  'Hygienic and welcoming environment',
  'Visible, lasting results',
  'Ongoing client support',
];

export default function AboutPreview() {
  const { settings } = useSettings();

  return (
    <section className="py-28 px-6 lg:px-10 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Main visual frame */}
            <div className="relative aspect-[4/5] bg-gradient-to-br from-rose/10 via-blush/15 to-gold/10 border border-gold/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose/20 to-gold/20 flex items-center justify-center mx-auto mb-8 border border-gold/30">
                    <span className="font-display text-3xl text-rose italic">LB</span>
                  </div>
                  <p className="font-display text-2xl text-charcoal italic mb-4">Est. 2019</p>
                  <p className="text-sm text-warm-gray font-body font-300">Polokwane, Limpopo</p>
                </div>
              </div>
              {/* Corner ornaments */}
              <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-gold/40" />
              <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-gold/40" />
              <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-gold/40" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-gold/40" />
            </div>

            {/* Floating accent card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-8 -right-8 bg-rose text-white p-6 w-44 shadow-xl"
            >
              <p className="font-display text-4xl text-white">500+</p>
              <p className="text-xs tracking-widest uppercase font-body mt-1 text-white/80">Satisfied Clients</p>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Our Story</span>
            <h2 className="section-title mb-6">
              Beauty Elevated,<br />
              <em className="text-rose not-italic">Confidence Restored</em>
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />

            <p className="text-warm-gray font-body font-300 leading-relaxed mb-6">
              {settings.aboutStory}
            </p>
            <p className="text-warm-gray font-body font-300 leading-relaxed mb-10">
              Located in the heart of Polokwane, we offer a sanctuary where science meets beauty. Every treatment is evidence-based, results-driven, and delivered with the utmost care.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {WHY_US.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={15} className="text-gold flex-shrink-0" />
                  <span className="text-sm font-body text-charcoal">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-4">
              <Link to="/about" className="btn-primary">Our Story</Link>
              <Link to="/booking" className="btn-outline">Book Now</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
