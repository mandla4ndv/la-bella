import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { useSettings } from '../contexts/SettingsContext';
import { Award, Heart, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Sharon Matshimbwe', role: 'Co-Founder', bio: 'Specialises in advanced skin treatments and aesthetic procedures.', initials: 'SM' },
  { name: 'Taki Alie', role: 'Co-Founder', bio: 'Expert lash technician and brow specialist.Specialises in advanced skin treatments and aesthetic procedures. With 6+ years experiences.', initials: 'TA' },
];

const VALUES = [
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in every treatment we perform.' },
  { icon: Heart, title: 'Care', desc: 'Every client is treated with genuine warmth, respect and personalised attention.' },
  { icon: Sparkles, title: 'Innovation', desc: 'We invest in the latest techniques and technologies for the best results.' },
  { icon: Shield, title: 'Safety', desc: 'Client safety is paramount. All treatments follow strict hygiene and safety protocols.' },
];

export default function About() {
  const { settings } = useSettings();

  return (
    <Layout>
      <Helmet>
        <title>About Us | La Bella Aesthetic Polokwane</title>
        <meta name="description" content="Learn about La Bella Aesthetic - Polokwane's premier aesthetic studio. Our story, mission, vision and team of certified professionals." />
      </Helmet>

      {/* Header */}
      <div className="pt-40 pb-20 bg-gradient-to-br from-cream via-white to-blush/10 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-label">Our Story</span>
          <h1 className="section-title">About La Bella Aesthetics</h1>
          <div className="gold-divider" />
        </motion.div>
      </div>

      {/* Story section */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative aspect-square border border-gold/20 overflow-hidden flex items-center justify-center shadow-sm">
  
                {/* 👇 1. THE BACKGROUND IMAGE 👇 */}
                <img 
                  src="/images/coach.jpg" 
                  alt="La Bella Aesthetic Est 2019" 
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* 2. THE OVERLAY (Softens the image so text is readable) */}
                <div className="absolute inset-0 bg-white/50 bg-gradient-to-br from-rose/20 to-gold/20 backdrop-blur-[2px]" />

                {/* 3. CENTER CONTENT (Added z-10 to stay on top) */}
                <div className="text-center p-10 z-10">
                  <p className="font-display text-5xl text-charcoal">2019</p>
                  <p className="text-sm text-charcoal font-body mt-2 tracking-widest uppercase font-medium">Est. Polokwane</p>
                </div>

                {/* 4. CORNER ORNAMENTS (Added z-10 to stay on top) */}
                <div className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 border-gold/70 z-10" />
                <div className="absolute top-5 right-5 w-10 h-10 border-t-2 border-r-2 border-gold/70 z-10" />
                <div className="absolute bottom-5 left-5 w-10 h-10 border-b-2 border-l-2 border-gold/70 z-10" />
                <div className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2 border-gold/70 z-10" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-label">Our Journey</span>
              <h2 className="section-title mb-6">Born from a Passion for Beauty</h2>
              <div className="w-12 h-px bg-gold mb-8" />
              <p className="text-warm-gray font-body font-300 leading-relaxed mb-5">
                {settings.aboutStory}
              </p>
              <p className="text-warm-gray font-body font-300 leading-relaxed mb-5">
                Since opening our doors in 2019, we have built a reputation for excellence, trust, and consistently beautiful results. Our approach combines the science of skincare with the art of aesthetic enhancement.
              </p>
              <p className="text-warm-gray font-body font-300 leading-relaxed">
                Today, La Bella Aesthetic is proud to serve hundreds of loyal clients across Polokwane and the greater Limpopo region, offering treatments that make a real, visible difference.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 lg:px-10 bg-charcoal text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C8858A 0%, transparent 50%), radial-gradient(circle at 70% 50%, #C9A96E 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { label: 'Our Mission', title: 'Why We Do What We Do', content: settings.aboutMission },
              { label: 'Our Vision', title: 'Where We Are Going', content: settings.aboutVision },
            ].map(({ label, title, content }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-cream/10 p-10"
              >
                <span className="section-label text-gold">{label}</span>
                <h3 className="font-display text-3xl text-cream mb-5">{title}</h3>
                <div className="w-10 h-px bg-gold mb-6" />
                <p className="text-cream/70 font-body font-300 leading-relaxed">{content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="section-label">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
            <div className="gold-divider" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-gold/15">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-r border-b border-gold/15 p-10 text-center group hover:bg-cream transition-all"
              >
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mx-auto mb-5 group-hover:bg-rose group-hover:border-rose transition-all">
                  <Icon size={18} className="text-gold group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-2xl text-charcoal mb-3">{title}</h3>
                <p className="text-sm text-warm-gray font-body font-300 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 lg:px-10 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="section-label">Meet the Experts</span>
            <h2 className="section-title">Our Team</h2>
            <div className="gold-divider" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gold/15 p-8 text-center hover:shadow-lg hover:shadow-rose/5 transition-all"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose/20 to-gold/20 flex items-center justify-center mx-auto mb-5 border-2 border-gold/20">
                  <span className="font-display text-2xl text-rose">{member.initials}</span>
                </div>
                <h3 className="font-display text-xl text-charcoal mb-1">{member.name}</h3>
                <p className="text-[10px] tracking-widest uppercase font-body text-gold mb-4">{member.role}</p>
                <p className="text-sm text-warm-gray font-body font-300 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-rose to-rose-deep text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5">Ready to Begin Your Journey?</h2>
          <p className="text-white/80 font-body font-300 mb-8 max-w-md mx-auto">Book your consultation today and let us create a personalised treatment plan for you.</p>
          <Link to="/booking" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-rose text-xs tracking-widest uppercase font-body font-500 hover:bg-cream transition-colors">
            Book Now
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
}
