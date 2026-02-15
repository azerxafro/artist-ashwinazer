import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { artistData } from '../data/artistData';

const GallerySection: React.FC = () => {
  const { gallery, socials, label, theme } = artistData;
  const [selected, setSelected] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  return (
    <section id="gallery" className="py-20 relative overflow-hidden bg-black/40">
       <div className="absolute inset-0 pointer-events-none" 
            style={{ background: `linear-gradient(to bottom, transparent, ${theme.secondaryColor}10, transparent)` }} />

      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <p className="text-[10px] tracking-[0.4em] mb-2 font-syne" style={{ color: theme.primaryColor }}>AESTHETICS</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase relative z-10">Lookbook</h2>
        </div>
        
        {/* Socials - Integrated compact row */}
        <div className="flex gap-4">
           {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300 hover:scale-110"
                style={{ hover: { borderColor: s.color, color: s.color } } as any}
              >
                <span className="sr-only">{s.name}</span>
                {/* Simple icon mapping based on name or generic if complex */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </a>
           ))}
        </div>
      </div>

      {/* Horizontal Film Strip */}
      <div ref={containerRef} className="relative w-full overflow-x-auto pb-8 scrollbar-hide">
        <motion.div 
          className="flex gap-4 pl-6 pr-6 w-max"
          style={{ x }}
        >
          {gallery.map((img, i) => (
            <motion.button
              key={i}
              className="relative aspect-[3/4] md:aspect-[4/5] h-[400px] md:h-[500px] rounded-sm overflow-hidden group border border-white/5 bg-white/5 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-700"
              onClick={() => setSelected(i)}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <img src={img.url} alt={img.title}
                   className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                   loading="lazy" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-2xl font-black uppercase tracking-tighter text-white/90">{img.title}</p>
                <p className="text-[10px] tracking-widest text-accent mt-1 uppercase">{img.caption}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={gallery[selected].url}
              alt={gallery[selected].title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <p className="text-xs tracking-[0.2em] text-white/50">{selected + 1} / {gallery.length}</p>
             </div>
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
