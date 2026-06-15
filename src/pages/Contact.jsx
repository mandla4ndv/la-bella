import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Layout from '../components/layout/Layout';
import { useSettings } from '../contexts/SettingsContext';
import { Phone, Mail, MapPin, MessageCircle, Globe, Share2, Clock, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), { ...form, createdAt: serverTimestamp(), read: false });
      setSent(true);
      toast.success('Message sent successfully!');
    } catch { toast.error('Failed to send. Please try WhatsApp or email directly.'); }
    setLoading(false);
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact Us | La Bella Aesthetic Polokwane</title>
        <meta name="description" content="Contact La Bella Aesthetic in Polokwane. Call, WhatsApp, email or visit us. Book your appointment today." />
      </Helmet>

      <div className="pt-40 pb-20 bg-gradient-to-b from-cream to-white px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-label">Reach Us</span>
          <h1 className="section-title">Get In Touch</h1>
          <div className="gold-divider" />
        </motion.div>
      </div>

      <div className="py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-3xl text-charcoal mb-8">We'd Love to Hear From You</h2>
              <p className="text-warm-gray font-body font-300 leading-relaxed mb-10">
                Whether you have questions about a treatment, want to discuss a skin concern, or are ready to book your appointment — we're here for you.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { icon: Phone, label: 'Phone', value: settings.phone, href: `tel:${settings.phone}`, action: 'Call Now' },
                  { icon: MessageCircle, label: 'WhatsApp', value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp}`, action: 'Chat Now' },
                  { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}`, action: 'Email Us' },
                  { icon: MapPin, label: 'Address', value: settings.address, href: '#map', action: null },
                ].map(({ icon: Icon, label, value, href, action }) => (
                  <div key={label} className="flex gap-5 group">
                    <div className="w-12 h-12 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60 mb-0.5">{label}</p>
                      <p className="text-sm font-body text-charcoal">{value}</p>
                      {action && (
                        <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                          className="text-[10px] tracking-widest uppercase font-body text-rose hover:text-rose-deep transition-colors mt-0.5 block">
                          {action} →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="bg-cream border border-gold/20 p-6 mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={14} className="text-gold" />
                  <span className="section-label mb-0">Business Hours</span>
                </div>
                <div className="space-y-2">
                  {DAYS.map((day, i) => {
                    const hours = settings.businessHours?.[DAY_KEYS[i]];
                    return (
                      <div key={day} className="flex justify-between text-sm font-body">
                        <span className="text-charcoal">{day}</span>
                        <span className={hours?.closed ? 'text-warm-gray/50' : 'text-warm-gray'}>
                          {hours?.closed ? 'Closed' : `${hours?.open} – ${hours?.close}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-4">
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-charcoal/60 hover:text-rose transition-colors border border-gold/20 px-4 py-2.5">
                  <Globe size={13} /> Instagram
                </a>
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-charcoal/60 hover:text-rose transition-colors border border-gold/20 px-4 py-2.5">
                  <Share2 size={13} /> Facebook
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <CheckCircle2 size={48} className="text-gold mb-5" />
                  <h3 className="font-display text-3xl text-charcoal mb-3">Message Received!</h3>
                  <p className="text-warm-gray font-body font-300">We'll get back to you within 24 hours. <br/>For urgent matters, please WhatsApp us.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-display text-3xl text-charcoal mb-6">Send a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="section-label mb-2">Your Name *</label>
                      <input type="text" required placeholder="Full name" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="input-luxury" />
                    </div>
                    <div>
                      <label className="section-label mb-2">Phone</label>
                      <input type="tel" placeholder="+27 72 000 0000" value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="input-luxury" />
                    </div>
                  </div>
                  <div>
                    <label className="section-label mb-2">Email *</label>
                    <input type="email" required placeholder="your@email.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="input-luxury" />
                  </div>
                  <div>
                    <label className="section-label mb-2">Subject</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="input-luxury">
                      <option value="">Select a topic...</option>
                      <option>Booking Enquiry</option>
                      <option>Treatment Question</option>
                      <option>Pricing Information</option>
                      <option>Product Enquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="section-label mb-2">Message *</label>
                    <textarea required rows={5} placeholder="Tell us how we can help..." value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="input-luxury resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center py-4 disabled:opacity-50">
                    <Send size={14} />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div id="map" className="h-80 bg-cream">
        {settings.mapEmbedUrl ? (
          <iframe src={settings.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-warm-gray font-body">{settings.address}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
