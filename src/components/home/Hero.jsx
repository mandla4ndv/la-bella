import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '15+', label: 'Treatments' },
  { value: '5★', label: 'Rated Clinic' },
  { value: '5yr', label: 'Experience' },
];

export default function Hero() {
  const { settings } = useSettings();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient background instead of image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf0ec] via-[#fdf8f5] to-[#f9f0f5]" />
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-rose/8 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-gold/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blush/15 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.025]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#2D2D2D,#2D2D2D 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#2D2D2D,#2D2D2D 1px,transparent 1px,transparent 60px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-px bg-gold" />
              <span className="section-label mb-0">Polokwane's Premier Aesthetic Studio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal leading-[1.08] mb-8"
            >
              {settings.heroTitle || 'Unveil Your Most Radiant Self'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-warm-gray font-body font-300 text-base leading-relaxed mb-10 max-w-md"
            >
              {settings.heroSubtitle || 'Premium aesthetic treatments tailored to reveal your natural beauty. Experience luxury skincare in the heart of Polokwane.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/booking" className="btn-primary group">
                Book Appointment
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services" className="btn-outline">
                View Services
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6 mt-12 pt-10 border-t border-gold/20"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-rose/40 to-gold/40 border-2 border-cream flex items-center justify-center text-[9px] font-bold text-rose">
                    {['K','T','L','N'][i-1]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-gold text-xs">★</span>)}
                </div>
                <p className="text-xs text-warm-gray font-body mt-0.5">Trusted by 500+ clients</p>
              </div>
            </motion.div>
          </div>

          {/* Right visual */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main card */}
              <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-rose/15 via-blush/20 to-gold/10 rounded-none overflow-hidden border border-gold/20">
                {/* Decorative content inside card */}
                {/* 1. Parent Wrapper MUST have 'relative' and a defined height */}
<div className="relative w-full h-[600px] overflow-hidden">
  
  {/* 2. THE BACKGROUND IMAGE */}
  <img 
    src="public/images/desk.jpg" 
    alt="Aesthetic Background" 
    className="absolute inset-0 w-full h-full object-cover" 
  />

  {/* Optional: Add a slight white/pink tint overlay so your text is easy to read */}
  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>

  {/* 3. YOUR TEXT CONTENT (I added z-10 so it stays above the image) */}
  <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center z-10">
    <Sparkles size={40} className="text-gold mb-6 opacity-60" />
    <p className="font-display text-4xl text-charcoal mb-4 italic">Beauty is an art,</p>
    <p className="font-display text-4xl text-charcoal ">we are the artists.</p>
    <div className="gold-divider mt-8" />
    <p className="text-sm text-charcoal font-body font-300 mt-4">Premium Aesthetic Treatments</p>
  </div>
</div>
                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/40" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/40" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold/40" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/40" />
              </div>

              {/* Floating stats card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-12 top-1/3 bg-white shadow-2xl shadow-rose/10 border border-gold/15 p-5 w-40"
              >
                <p className="font-display text-3xl text-rose">5★</p>
                <p className="text-xs text-warm-gray font-body mt-1">Google Rating</p>
                <div className="flex gap-0.5 mt-2">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-gold text-xs">★</span>)}
                </div>
              </motion.div>

              {/* Floating booking badge */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-8 bottom-1/4 bg-charcoal text-cream p-5 w-44"
              >
                <p className="text-xs tracking-widest uppercase font-body text-gold mb-1">Today</p>
                <p className="font-display text-lg text-cream">2 Slots Left</p>
                <Link to="/booking" className="text-[10px] tracking-widest uppercase text-rose mt-2 block hover:text-gold transition-colors">
                  Book Now →
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-gold/15"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl text-charcoal mb-1">{stat.value}</p>
              <p className="text-xs tracking-widest uppercase text-warm-gray font-body">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
      >
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        <span className="text-[9px] tracking-[0.3em] uppercase font-body text-warm-gray">Scroll</span>
      </motion.div>
    </section>
  );
}
