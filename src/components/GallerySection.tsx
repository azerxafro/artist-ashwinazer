import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { artistData } from '../data/artistData';

const GallerySection: React.FC = () => {
  const { gallery, socials, label, theme } = artistData;
  const [selected, setSelected] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  // Different parallax speeds per image
  const y0 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const parallaxValues = [y0, y1, y2, y3];

  // Masonry heights
  const heights = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]'];

  return (
    <section id="gallery" className="py-24 md:py-36 px-6 relative overflow-hidden" ref={sectionRef}>
      {/* Section divider */}
      <motion.div
        className="absolute top-0 left-1/4 right-1/4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}40, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] tracking-[0.6em] mb-3" style={{ color: theme.primaryColor }}>VISUAL</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">GALLERY</h2>
        </motion.div>

        {/* Masonry grid with parallax */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {gallery.map((img, i) => (
            <motion.button
              key={i}
              className={`group relative ${heights[i % heights.length]} w-full rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500 break-inside-avoid block`}
              onClick={() => setSelected(i)}
              style={{ y: parallaxValues[i % parallaxValues.length] }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <img src={img.url} alt={img.title}
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
                   loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-xs font-bold tracking-[0.15em]">{img.title}</p>
                <p className="text-[10px] text-white/40 mt-1">{img.caption}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lightbox — blur zoom */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
              onClick={() => setSelected(null)}
            >
              <motion.img
                src={gallery[selected].url}
                alt={gallery[selected].title}
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
                initial={{ scale: 0.85, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.85, opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="absolute bottom-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm font-bold tracking-[0.15em]">{gallery[selected].title}</p>
                <p className="text-[10px] text-white/40 mt-1">{gallery[selected].caption}</p>
              </motion.div>
              <button className="absolute top-6 right-6 text-white/40 hover:text-white text-2xl transition-colors" onClick={() => setSelected(null)}>✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connect section */}
        <motion.div
          className="mt-28 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] tracking-[0.6em] mb-3" style={{ color: theme.primaryColor }}>CONNECT</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-10">JOIN THE MOVEMENT</h2>

          <div className="flex flex-wrap justify-center gap-4 mb-14">
            {socials.map((s) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank" rel="noopener noreferrer"
                className="px-7 py-3 rounded-full border border-white/8 text-white/40 text-[10px] tracking-[0.2em] transition-all duration-300"
                whileHover={{
                  scale: 1.06,
                  borderColor: s.color,
                  color: s.color,
                  boxShadow: `0 0 20px ${s.color}20`,
                }}
              >
                {s.name.toUpperCase()}
              </motion.a>
            ))}
          </div>

          <a href={label.url} target="_blank" rel="noopener noreferrer"
             className="inline-block border border-white/5 rounded-2xl p-7 bg-white/[0.01] hover:border-white/10 transition-all duration-500 group">
            <p className="text-[10px] tracking-[0.4em] text-white/25 mb-1">{label.name}</p>
            <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{label.description}</p>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
