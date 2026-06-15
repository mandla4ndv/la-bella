import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Globe, Share2 } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export default function ContactSection() {
  const { settings } = useSettings();

  return (
    <section className="py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Get in Touch</span>
            <h2 className="section-title mb-4">We'd Love to Hear From You</h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <p className="text-warm-gray font-body font-300 leading-relaxed mb-10">
              Have questions about our treatments or ready to begin your beauty journey? Reach out — our team is here to help.
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: Phone, label: 'Call or WhatsApp', value: settings.phone, href: `tel:${settings.phone}` },
                { icon: Mail, label: 'Email Us', value: settings.email, href: `mailto:${settings.email}` },
                { icon: MapPin, label: 'Visit Us', value: settings.address, href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex gap-5 group">
                  <div className="w-11 h-11 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-rose group-hover:border-rose transition-all duration-300">
                    <Icon size={16} className="text-gold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase font-body text-warm-gray/60 mb-0.5">{label}</p>
                    <p className="text-sm font-body text-charcoal group-hover:text-rose transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-4">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-charcoal/60 hover:text-rose transition-colors">
                <Globe size={14} /> Instagram
              </a>
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-charcoal/60 hover:text-rose transition-colors">
                <Share2 size={14} /> Facebook
              </a>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-charcoal/60 hover:text-rose transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Map placeholder + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Map */}
            <div className="aspect-video bg-gradient-to-br from-rose/5 to-gold/5 border border-gold/20 overflow-hidden">
              {settings.mapEmbedUrl ? (
                <iframe
                  src={settings.mapEmbedUrl}
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="La Bella Aesthetic Location"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center">
                  <div>
                    <MapPin size={32} className="text-gold/40 mx-auto mb-3" />
                    <p className="text-sm text-warm-gray font-body">{settings.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="btn-primary justify-center py-4 text-[10px]">
                <MessageCircle size={13} /> WhatsApp Us
              </a>
              <Link to="/booking" className="btn-outline justify-center py-4 text-[10px]">
                Book Online
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
