import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artistData } from '../data/artistData';

const VideoShowcase: React.FC = () => {
  const { videos, theme } = artistData;
  const [activeVideo, setActiveVideo] = useState(videos.featured);
  const [filter, setFilter] = useState<string>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...new Set(videos.all.map(v => v.category))];
  const filtered = filter === 'All' ? videos.all : videos.all.filter(v => v.category === filter);

  return (
    <section id="videos" className="py-10 md:py-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 video-bg-gradient" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header + Filters */}
        <motion.div
          className="flex flex-col gap-3 mb-5 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.4em] mb-1.5 font-syne" style={{ color: theme.primaryColor }}>VISUALS</p>
              <h2 className="text-xl md:text-5xl font-black tracking-tighter uppercase">Cinematography</h2>
            </div>
            {/* View Channel — desktop only inline */}
            <a
              href="https://www.youtube.com/@ashwinazer"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              <span>VIEW CHANNEL</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Category Filter Pills — compact scrollable row */}
          <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient-right">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px] tracking-[0.12em] whitespace-nowrap rounded-full border transition-all duration-300 ${
                  filter === cat
                    ? 'text-black font-bold'
                    : 'text-white/40 border-white/10 hover:border-white/30 hover:text-white'
                }`}
                style={filter === cat ? { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor } : {}}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-3 md:gap-8 items-start">

          {/* Featured Player */}
          <motion.div
            className="lg:col-span-2 relative group"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-video rounded-lg md:rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-black/50">
              <AnimatePresence mode="wait">
                <motion.iframe
                  key={activeVideo.id}
                  src={`https://www.youtube.com/embed/${activeVideo.id}?rel=0&modestbranding=1&autoplay=1&mute=0`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              {/* Glass overlay details */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                <h3 className="text-sm md:text-2xl font-bold tracking-tight text-white mb-0.5">{activeVideo.title}</h3>
                <p className="text-white/50 text-[10px] md:text-sm">{activeVideo.category} • Official Video</p>
              </div>
            </div>
          </motion.div>

          {/* Up Next List */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <h4 className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/50">UP NEXT</h4>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Mobile: compact 2-column grid | Desktop: vertical list */}
            <div
              ref={scrollContainerRef}
              className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-1 lg:overflow-y-auto lg:max-h-[500px] lg:pr-2"
            >
              {filtered.filter(v => v.id !== activeVideo.id).map((video, i) => (
                <motion.button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="group text-left rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300 overflow-hidden
                    flex flex-col lg:flex-row lg:gap-3 lg:p-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full lg:w-28 aspect-video rounded-lg lg:rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 lg:w-6 lg:h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                        <svg className="w-2.5 h-2.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="px-2 py-1.5 lg:py-1 min-w-0 flex-1">
                    <p className="text-[11px] lg:text-xs font-semibold leading-tight group-hover:text-white transition-colors line-clamp-2">{video.title}</p>
                    <p className="text-[9px] lg:text-[10px] text-white/30 mt-0.5">{video.category}</p>
                  </div>
                </motion.button>
              ))}

              {filtered.filter(v => v.id !== activeVideo.id).length === 0 && (
                <p className="col-span-2 text-center text-[10px] text-white/30 py-6">No other videos in this category.</p>
              )}
            </div>

            {/* View Channel link — mobile */}
            <a
              href="https://www.youtube.com/@ashwinazer"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 md:mt-5 w-full py-2 md:py-3 border border-white/10 rounded-lg md:rounded-xl text-[10px] md:text-xs tracking-[0.2em] text-center hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
            >
              <span>VIEW CHANNEL</span>
              <svg className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
