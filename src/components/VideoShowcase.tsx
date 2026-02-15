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
    <section id="videos" className="py-12 md:py-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 video-bg-gradient" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
           className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 md:mb-8 gap-3 md:gap-4"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
        >
          <div>
            <p className="text-[10px] tracking-[0.4em] mb-2 font-syne" style={{ color: theme.primaryColor }}>VISUALS</p>
            <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase">Cinematography</h2>
          </div>
          
          {/* Category Filter - Scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-gradient-right w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 md:px-4 py-1.5 text-[10px] tracking-[0.15em] whitespace-nowrap rounded-full border transition-all duration-300 ${
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

        {/* Main Content Layout — Stack on mobile, side-by-side on desktop */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-8 items-start">
          
          {/* Featured Player */}
          <motion.div 
            className="lg:col-span-2 relative group"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-black/50">
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
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                <h3 className="text-base md:text-2xl font-bold tracking-tight text-white mb-1">{activeVideo.title}</h3>
                <p className="text-white/60 text-xs md:text-sm">{activeVideo.category} • Official Video</p>
              </div>
            </div>
          </motion.div>

          {/* Up Next List — Horizontal scroll on mobile, vertical on desktop */}
          <div className="lg:col-span-1 flex flex-col h-full lg:min-h-[400px]">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h4 className="text-xs font-bold tracking-[0.2em] text-white/50">UP NEXT</h4>
              <div className="h-px flex-1 ml-4 bg-white/10" />
            </div>

            <div 
              ref={scrollContainerRef}
              className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] pb-4 lg:pb-0 pr-2 snap-x lg:snap-y scrollbar-hide"
            >
              {filtered.filter(v => v.id !== activeVideo.id).map((video, i) => (
                <motion.button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="group flex-shrink-0 w-[200px] md:w-[240px] lg:w-full flex gap-3 text-left p-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300 snap-start"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="relative w-24 md:w-28 aspect-video rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <img 
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                      alt={video.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                         <svg className="w-2.5 h-2.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                       </div>
                    </div>
                  </div>
                  <div className="flex-1 py-1 min-w-0">
                    <p className="text-xs font-bold leading-tight group-hover:text-accent transition-colors line-clamp-2">{video.title}</p>
                    <p className="text-[10px] text-white/40 mt-1">{video.category}</p>
                  </div>
                </motion.button>
              ))}
              
              {filtered.filter(v => v.id !== activeVideo.id).length === 0 && (
                 <p className="text-center text-xs text-white/30 py-8">No other videos in this category.</p>
              )}
            </div>
            
             <a href="https://www.youtube.com/@ashwinazer" target="_blank" rel="noopener noreferrer"
               className="mt-4 md:mt-6 w-full py-2.5 md:py-3 border border-white/10 rounded-xl text-xs tracking-[0.2em] text-center hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
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
