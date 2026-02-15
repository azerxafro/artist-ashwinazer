import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artistData } from '../data/artistData';

const VideoShowcase: React.FC = () => {
  const { videos, theme } = artistData;
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string; category?: string }>(videos.featured);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', ...new Set(videos.all.map(v => v.category))];
  const filtered = filter === 'All' ? videos.all : videos.all.filter(v => v.category === filter);
  const upNext = filtered.filter(v => v.id !== activeVideo.id);

  return (
    <section id="videos" className="py-8 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 video-bg-gradient" />

      <div className="max-w-7xl mx-auto">
        {/* Header — padded */}
        <div className="px-4 md:px-6">
          <motion.div
            className="flex items-end justify-between mb-3 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="text-[9px] md:text-[10px] tracking-[0.4em] mb-1 font-syne" style={{ color: theme.primaryColor }}>VISUALS</p>
              <h2 className="text-lg md:text-5xl font-black tracking-tighter uppercase">Cinematography</h2>
            </div>
            <a
              href="https://www.youtube.com/@ashwinazer"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              VIEW CHANNEL →
            </a>
          </motion.div>

          {/* Filter pills */}
          <div className="flex gap-1 md:gap-2 overflow-x-auto pb-2 md:pb-3 no-scrollbar mb-2 md:mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2 md:px-4 py-0.5 md:py-1.5 text-[8px] md:text-[10px] tracking-[0.1em] whitespace-nowrap rounded-full border transition-all ${
                  filter === cat
                    ? 'text-black font-bold'
                    : 'text-white/40 border-white/10 hover:text-white'
                }`}
                style={filter === cat ? { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor } : {}}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Main layout — padded */}
        <div className="px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-2 md:gap-8 items-start">

            {/* Featured Player */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-video rounded-md md:rounded-2xl overflow-hidden border border-white/10 bg-black">
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
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 md:p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                  <h3 className="text-xs md:text-2xl font-bold text-white leading-tight">{activeVideo.title}</h3>
                  <p className="text-white/40 text-[8px] md:text-sm mt-0.5 hidden md:block">{activeVideo.category} • Official Video</p>
                </div>
              </div>
            </motion.div>

            {/* Up Next — Desktop: vertical list */}
            <div className="hidden lg:flex lg:col-span-1 flex-col">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="text-xs font-bold tracking-[0.2em] text-white/40">UP NEXT</h4>
                <div className="h-px flex-1 bg-white/8" />
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[500px]">
                {upNext.map((video, i) => (
                  <motion.button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className="group text-left rounded-md flex gap-3 p-1.5 border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="relative w-24 aspect-video rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col py-0.5 min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-tight group-hover:text-white transition-colors line-clamp-2">{video.title}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{video.category}</p>
                    </div>
                  </motion.button>
                ))}
                {upNext.length === 0 && (
                  <p className="text-center text-[9px] text-white/30 py-4">No other videos.</p>
                )}
              </div>
              <a
                href="https://www.youtube.com/@ashwinazer"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full py-3 border border-white/8 rounded-xl text-xs tracking-[0.2em] text-white/30 text-center hover:bg-white/5 transition-all flex items-center justify-center gap-1.5"
              >
                VIEW CHANNEL →
              </a>
            </div>
          </div>
        </div>

        {/* Mobile: Horizontal snap carousel — full bleed */}
        <div className="lg:hidden mt-3">
          <div className="flex items-center gap-2 mb-1.5 px-4">
            <h4 className="text-[9px] font-bold tracking-[0.2em] text-white/40">UP NEXT</h4>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          <div
            className="flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4"
            style={{ scrollPaddingLeft: '1rem' }}
          >
            {upNext.map((video, i) => (
              <motion.button
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group flex-shrink-0 w-[38vw] snap-start text-left"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="relative aspect-video rounded-md overflow-hidden bg-white/5">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  {/* Play icon on hover/active */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <svg className="w-2 h-2 text-white ml-px" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] font-medium text-white/60 mt-1 leading-tight line-clamp-1 px-0.5">{video.title}</p>
              </motion.button>
            ))}

            {upNext.length === 0 && (
              <p className="text-center text-[9px] text-white/30 py-4 w-full">No other videos.</p>
            )}

            {/* End spacer for scroll padding */}
            <div className="flex-shrink-0 w-2" aria-hidden />
          </div>

          {/* Channel link — mobile */}
          <div className="px-4 mt-2">
            <a
              href="https://www.youtube.com/@ashwinazer"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 border border-white/8 rounded-md text-[9px] tracking-[0.15em] text-white/30 text-center hover:bg-white/5 transition-all flex items-center justify-center gap-1"
            >
              VIEW CHANNEL →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
