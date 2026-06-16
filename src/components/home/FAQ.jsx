import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  { q: 'How do I book an appointment?', a: 'You can book online through our booking page, WhatsApp us directly, or give us a call. Our online booking system allows you to choose your service, date, and time in minutes.' },
  { q: 'Is a deposit required to secure my booking?', a: 'Yes, a 50% deposit is required to confirm your appointment. This deposit is deducted from your total treatment cost on the day. Banking details are provided during the booking process.' },
  { q: 'What should I bring on the day of my appointment?', a: 'Please bring your proof of deposit payment (screenshot or receipt is fine), arrive 5-10 minutes early, and come with a clean face if possible for facial treatments.' },
  { q: 'Can I reschedule my appointment?', a: 'Yes, we ask for at least 24 hours notice for rescheduling to avoid losing your deposit. Contact us via WhatsApp or phone and we\'ll find the next available slot for you.' },
  { q: 'What products do you use?', a: 'Contact therapist for best recommendations. All our products are suited for South African skin types and carefully selected for safety and efficacy.' },
  { q: 'Are your therapists qualified?', a: 'Absolutely. All our therapists are fully certified and hold relevant qualifications in aesthetic therapy. We invest in ongoing training to ensure you receive the most advanced treatments available.' },
  { q: 'How long do treatments take?', a: 'Treatment durations vary depending on the service. Facials typically take 30-60 minutes, lash extensions 20-40 minutes, and brow treatments 20-40 minutes. Exact durations are listed on each service.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-28 px-6 lg:px-10 bg-cream">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Common Questions</span>
          <h2 className="section-title">Everything You Need to Know</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="divide-y divide-gold/15">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span className={`font-display text-lg transition-colors ${open === i ? 'text-rose' : 'text-charcoal group-hover:text-rose'}`}>
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 ml-4 w-8 h-8 border flex items-center justify-center transition-all ${open === i ? 'border-rose text-rose bg-rose/5' : 'border-gold/30 text-gold/60 group-hover:border-gold'}`}>
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-warm-gray font-body font-300 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
