import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { X, ZoomIn } from 'lucide-react';

// Automatically includes all the images and videos from your public folder screenshots
const LOCAL_MEDIA = [
  { id: '1', url: '/images/laser.jpg', type: 'image' },
  { id: '2', url: '/images/facial.jpg', type: 'image' },
  { id: '3', url: '/images/skin.jpg', type: 'image' },
  { id: '4', url: '/images/lashes.jpg', type: 'image' },
  { id: '5', url: '/images/Screenshot_20260616_033835_WhatsApp.jpg', type: 'image' },
  { id: '6', url: '/images/brows.jpg', type: 'image' },
  { id: '7', url: '/images/Screenshot_20260616_033908_WhatsApp.jpg', type: 'image' },
  { id: '8', url: '/images/Screenshot_20260616_033915_WhatsApp.jpg', type: 'image' },
  { id: '9', url: '/images/Screenshot_20260616_033934_WhatsApp.jpg', type: 'image' },
  { id: '10', url: '/images/Screenshot_20260616_033944_WhatsApp.jpg', type: 'image' },
  { id: '11', url: '/images/Screenshot_20260616_033952_WhatsApp.jpg', type: 'image' },
  { id: '12', url: '/images/Screenshot_20260616_034018_WhatsApp.jpg', type: 'image' },
  { id: '13', url: '/images/Screenshot_20260616_034021_WhatsApp.jpg', type: 'image' },
  { id: '14', url: '/images/Screenshot_20260616_034024_WhatsApp.jpg', type: 'image' },
  { id: '15', url: '/images/coach.jpg', type: 'image' },
  { id: '16', url: '/images/Screenshot_20260616_034047_WhatsApp.jpg', type: 'image' },
  { id: '17', url: '/images/before-after.jpg', type: 'image' },
  { id: '18', url: '/images/desk.jpg', type: 'image' },
  { id: '19', url: '/images/logo.png', type: 'image' },
  { id: '20', url: '/videos/v1.mp4', type: 'video' },
  { id: '21', url: '/images/lash.jpg', type: 'image' },
  { id: '22', url: '/videos/v2.mp4', type: 'video' },
  { id: '23', url: '/images/sharp nails.jpg', type: 'image' },
  { id: '24', url: '/images/red nailss.jpg', type: 'image' },
  { id: '25', url: '/images/married pink.jpg', type: 'image' },
  { id: '26', url: '/images/pink pink.jpg', type: 'image' },
  { id: '27', url: '/images/lashes5.jpg', type: 'image' },
  { id: '28', url: '/images/pink nail2.jpg', type: 'image' },
  { id: '29', url: '/images/toes3.jpg', type: 'image' },
  { id: '30', url: '/videos/v3.mp4', type: 'video' },
  { id: '31', url: '/images/pink nail.jpg', type: 'image' },
  { id: '32', url: '/videos/v4.mp4', type: 'video' },
  { id: '33', url: '/images/red nail.jpg', type: 'image' },
  { id: '34', url: '/videos/v5.mp4', type: 'video' },
  { id: '35', url: '/videos/v6.mp4', type: 'video' },
  { id: '36', url: '/videos/v7.mp4', type: 'video' },
  { id: '37', url: '/images/face 2.jpg', type: 'image' },
  { id: '38', url: '/videos/v8.mp4', type: 'video' },
  { id: '39', url: '/images/toe nail 1.jpg', type: 'image' },
  { id: '40', url: '/videos/v9.mp4', type: 'video' },
  { id: '41', url: '/images/face.jpg', type: 'image' },
  { id: '42', url: '/images/white logo.jpg', type: 'image' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);
  const COLORS = ['from-rose/15 to-blush/25','from-gold/12 to-cream','from-blush/20 to-rose/10','from-gold/18 to-rose/8','from-rose/10 to-gold/15','from-blush/25 to-gold/12'];

  return (
    <Layout>
      <Helmet>
        <title>Gallery | La Bella Aesthetic Polokwane</title>
        <meta name="description" content="Browse our gallery of stunning results. See our work in facials, microneedling, lash extensions, brow treatments and more." />
      </Helmet>

      {/* Header */}
      <div className="pt-40 pb-20 bg-gradient-to-b from-cream to-white px-6 text-center border-b border-gold/15">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-label">Portfolio</span>
          <h1 className="section-title">Our Work</h1>
          <div className="gold-divider" />
          <p className="text-warm-gray font-body font-300 max-w-md mx-auto mt-5 leading-relaxed">
            Every result tells a story. Browse our gallery of transformations and discover what's possible.
          </p>
        </motion.div>
      </div>

      {/* Gallery Masonry */}
      <div className="py-16 px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {LOCAL_MEDIA.map((media, i) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="break-inside-avoid group relative cursor-pointer"
                onClick={() => setLightbox(media)}
              >
                <div className={`w-full bg-gradient-to-br ${COLORS[i % COLORS.length]} relative overflow-hidden`}
                  style={{ aspectRatio: i % 5 === 0 ? '3/4' : i % 3 === 0 ? '4/3' : '1/1' }}>
                  
                  {/* Render Video or Image based on the type */}
                  {media.type === 'video' ? (
                    <video 
                      src={media.url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <img 
                      src={media.url} 
                      alt="La Bella Aesthetic Work" 
                      className="w-full h-full object-cover" 
                    />
                  )}

                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-400 flex items-center justify-center pointer-events-none">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 w-10 h-10 border border-cream/20 flex items-center justify-center text-cream hover:text-gold transition-colors">
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-2xl w-full max-h-[85vh] flex justify-center items-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Lightbox Render Video or Image */}
              {lightbox.type === 'video' ? (
                <video 
                  src={lightbox.url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  controls 
                  className="w-full h-full object-contain max-h-[85vh]" 
                />
              ) : (
                <img 
                  src={lightbox.url} 
                  alt="La Bella Aesthetic Zoomed" 
                  className="w-full h-full object-contain max-h-[85vh]" 
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}