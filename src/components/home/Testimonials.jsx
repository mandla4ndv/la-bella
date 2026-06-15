import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const FALLBACK = [
  { id: '1', name: 'Kedibone M.', service: 'Microneedling', rating: 5, text: 'Absolutely incredible experience! My skin has never looked better. The team at La Bella is so professional and caring. I left feeling like a brand new person.' },
  { id: '2', name: 'Thandi N.', service: 'Lash Extensions', rating: 5, text: "I've been coming to La Bella for over a year and I wouldn't go anywhere else. The attention to detail is unmatched and the results always exceed my expectations." },
  { id: '3', name: 'Lerato S.', service: 'Chemical Peel', rating: 5, text: 'The chemical peel transformed my skin! The therapist was so knowledgeable and made me feel completely at ease. My confidence has soared since my treatments.' },
  { id: '4', name: 'Nomsa K.', service: 'Facial', rating: 5, text: 'La Bella is a true sanctuary. From the moment you walk in to the moment you leave, every detail is perfect. My skin glows and I get compliments everywhere I go!' },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(FALLBACK);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'testimonials'), where('active', '==', true));
        const snap = await getDocs(q);
        if (!snap.empty) setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {}
    };
    fetch();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  return (
    <section className="py-28 px-6 lg:px-10 bg-gradient-to-br from-charcoal to-[#1a1a1a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C8858A 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C9A96E 0%, transparent 50%)' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label text-gold">Client Love</span>
          <h2 className="section-title text-cream">What Our Clients Say</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="text-center px-8 md:px-16"
            >
              <Quote size={36} className="text-gold/30 mx-auto mb-8" />
              <p className="font-display text-xl md:text-2xl lg:text-3xl text-cream/90 leading-relaxed mb-8 italic font-light">
                "{testimonials[current].text}"
              </p>
              <div className="flex justify-center gap-1 mb-5">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`text-sm ${i <= (testimonials[current].rating || 5) ? 'text-gold' : 'text-white/20'}`}>★</span>
                ))}
              </div>
              <p className="font-body font-500 text-cream text-sm tracking-wider">{testimonials[current].name}</p>
              <p className="text-[11px] tracking-widest uppercase text-gold/60 font-body mt-1">{testimonials[current].service}</p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8 mt-14">
            <button onClick={prev} className="w-10 h-10 border border-cream/20 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 ${i === current ? 'w-8 h-1.5 bg-gold' : 'w-2 h-1.5 bg-cream/20 hover:bg-cream/40'}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 border border-cream/20 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
