import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artistData } from '../data/artistData';

const VideoShowcase: React.FC = () => {
  const { videos, theme } = artistData;
  const [activeVideo, setActiveVideo] = useState(videos.featured);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', ...new Set(videos.all.map(v => v.category))];
  const filtered = filter === 'All' ? videos.all : videos.all.filter(v => v.category === filter);

  return (
    <section id="videos" className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
      {/* Section divider */}
      <motion.div
        className="absolute top-0 left-1/4 right-1/4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}40, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-[10px] tracking-[0.6em] mb-2" style={{ color: theme.primaryColor }}>WATCH</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">VISUALS</h2>
        </motion.div>

        {/* Featured video — compact cinema mode */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative aspect-video max-w-3xl mx-auto rounded-xl overflow-hidden border border-white/5">
            {/* Vignette overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none"
                 style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)' }} />
            <AnimatePresence mode="wait">
              <motion.iframe
                key={activeVideo.id}
                src={`https://www.youtube.com/embed/${activeVideo.id}?rel=0&modestbranding=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                title={activeVideo.title}
              />
            </AnimatePresence>
          </div>
          <div className="text-center mt-3">
            <p className="text-sm md:text-base font-bold tracking-[0.15em]">{activeVideo.title}</p>
            {activeVideo.description && (
              <p className="text-white/30 text-xs mt-0.5">{activeVideo.description}</p>
            )}
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 text-[10px] tracking-[0.2em] rounded-full border transition-all duration-300 ${
                filter === cat
                  ? 'text-black font-bold'
                  : 'text-white/30 border-white/8 hover:border-white/20 hover:text-white/50'
              }`}
              style={filter === cat ? { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor } : {}}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Video grid — compact, tighter gaps */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {filtered.map((video, i) => (
            <motion.button
              key={video.id}
              onClick={() => setActiveVideo({ ...video, description: '' })}
              className="group relative aspect-video rounded-lg overflow-hidden transition-all duration-300"
              style={activeVideo.id === video.id ? {
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: `0 0 0 2px ${theme.primaryColor}`,
              } : { border: '1px solid rgba(255,255,255,0.05)' }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              whileHover={{ scale: 1.03, y: -3 }}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/60 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-[9px] sm:text-[10px] font-bold tracking-wider truncate">{video.title}</p>
                <p className="text-[8px] text-white/30 tracking-wider mt-0.5">{video.category}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md"
                     style={{ backgroundColor: `${theme.primaryColor}30`, border: `1px solid ${theme.primaryColor}50` }}>
                  <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <a href="https://www.youtube.com/@ashwinazer" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-white/30 hover:text-white/60 transition-colors duration-300">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            VIEW ALL ON YOUTUBE
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
