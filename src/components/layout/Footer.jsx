import { Link } from 'react-router-dom';
import { Globe, Share2, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-cream/70">
      {/* Top divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="block mb-5">
              <span className="font-display text-3xl text-cream block leading-none">La Bella</span>
              <span className="text-[9px] tracking-[0.45em] text-gold uppercase font-body mt-1 block">Aesthetic</span>
            </Link>
            <p className="text-sm leading-relaxed text-cream/50 mb-6 font-body font-300">
              {settings.tagline}. Polokwane's premier destination for luxury aesthetic treatments.
            </p>
            <div className="flex gap-4">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
                <Globe size={15} />
              </a>
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
                <Share2 size={15} />
              </a>
              <a href={`https://tiktok.com/@labellaaesthetic`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300 text-xs font-bold">
                TT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="section-label text-gold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/services', label: 'Services' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/booking', label: 'Book Appointment' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-cream/60 hover:text-gold transition-colors font-body">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="section-label text-gold mb-6">Treatments</h4>
            <ul className="space-y-3">
              {['Facials', 'Microneedling', 'Chemical Peels', 'Lash Extensions', 'Brow Treatments', 'Skin Treatments'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-sm text-cream/60 hover:text-gold transition-colors font-body">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="section-label text-gold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={15} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm font-body leading-relaxed text-cream/60">{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={15} className="text-gold flex-shrink-0 mt-0.5" />
                <a href={`tel:${settings.phone}`} className="text-sm font-body text-cream/60 hover:text-gold transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={15} className="text-gold flex-shrink-0 mt-0.5" />
                <a href={`mailto:${settings.email}`} className="text-sm font-body text-cream/60 hover:text-gold transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>

            {/* Hours snippet */}
            <div className="mt-6 pt-6 border-t border-cream/10">
              <p className="section-label mb-3">Mon – Fri</p>
              <p className="text-sm text-cream/60 font-body">09:00 – 17:00</p>
              <p className="section-label mt-3 mb-1">Saturday</p>
              <p className="text-sm text-cream/60 font-body">09:00 – 13:00</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40 font-body tracking-wide">
            © {year} La Bella Aesthetic. All rights reserved.
          </p>
          <p className="text-xs text-cream/30 font-body flex items-center gap-1.5">
            Made with <Heart size={11} className="text-rose fill-rose" /> in Polokwane, South Africa
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-cream/40 hover:text-gold transition-colors font-body">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-cream/40 hover:text-gold transition-colors font-body">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
