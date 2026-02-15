import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { artistData } from '../data/artistData';

const LatestRelease: React.FC = () => {
  const { featuredAlbum, theme } = artistData;
  const [typedTitle, setTypedTitle] = useState('');
  const [titleVisible, setTitleVisible] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);

  const handleIframeLoad = useCallback(() => setEmbedLoaded(true), []);

  // Typewriter for album title
  useEffect(() => {
    if (!titleVisible) return;
    let i = 0;
    const text = featuredAlbum.title;
    setTypedTitle('');
    const interval = setInterval(() => {
      setTypedTitle(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [titleVisible, featuredAlbum.title]);

  return (
    <section className="pt-6 pb-12 md:pt-10 md:pb-20 px-4 md:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setTitleVisible(true)}
          viewport={{ once: true }}
        >
          {/* Album info + Spotify embed side by side */}
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-8 items-center">
            <div className="overflow-hidden min-w-0">
              <p className="text-[10px] tracking-[0.4em] mb-2" style={{ color: theme.primaryColor }}>LATEST RELEASE</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 min-h-[1.2em]">
                {typedTitle}
                <motion.span
                  className="inline-block w-[3px] h-[0.8em] ml-1 align-middle"
                  style={{ backgroundColor: theme.primaryColor }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              </h2>
              <p className="text-white/30 text-xs tracking-wider mb-1">{featuredAlbum.subtitle}</p>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-5">{featuredAlbum.description}</p>
              <div className="flex flex-wrap gap-3">
                <a href={featuredAlbum.spotifyUrl} target="_blank" rel="noopener noreferrer"
                   className="px-6 py-2.5 text-[10px] md:text-xs tracking-[0.2em] rounded-full text-black font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,85,0.3)]"
                   style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientTo})` }}>
                  SPOTIFY
                </a>
                <a href={featuredAlbum.appleMusicUrl} target="_blank" rel="noopener noreferrer"
                   className="px-6 py-2.5 text-[10px] md:text-xs tracking-[0.2em] rounded-full border border-white/15 text-white/50 hover:border-white/40 hover:text-white transition-all duration-300">
                  APPLE MUSIC
                </a>
              </div>
            </div>
            <div className="relative mt-2 md:mt-0">
              <div className="relative rounded-xl overflow-hidden border border-white/5 bg-[#121212]">
                <iframe
                  src={featuredAlbum.spotifyEmbed}
                  width="100%" height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="rounded-xl" style={{ border: 'none', opacity: embedLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
                  title={`${featuredAlbum.title} on Spotify`}
                  onLoad={handleIframeLoad}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestRelease;
