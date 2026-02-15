import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artistData } from '../data/artistData';

const MusicSection: React.FC = () => {
  const { personas, theme, upcoming } = artistData;
  const [activePersona, setActivePersona] = useState(0);
  const [flickerOn, setFlickerOn] = useState(true);

  // Upcoming flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerOn(false);
      setTimeout(() => setFlickerOn(true), 100 + Math.random() * 200);
    }, 3690);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="music" className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">
      {/* Spotlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[200px] opacity-[0.08]"
           style={{ background: `radial-gradient(circle, ${theme.primaryColor}, transparent)` }} />

      {/* Section divider line */}
      <motion.div
        className="absolute top-0 left-1/4 right-1/4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}40, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-[10px] tracking-[0.6em] mb-3" style={{ color: theme.primaryColor }}>LISTEN</p>
          <h2 className="text-3xl md:text-6xl font-black tracking-tight">THE MUSIC</h2>
        </motion.div>

        {/* Two Personas */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] tracking-[0.6em] text-center mb-10" style={{ color: theme.primaryColor }}>
            TWO PERSONAS · ONE ARTIST
          </p>

          <div className="flex justify-center gap-3 md:gap-4 mb-8 md:mb-10">
            {personas.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActivePersona(i)}
                className={`relative px-5 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] rounded-full border transition-all duration-500 overflow-hidden ${
                  activePersona === i ? 'text-black font-bold' : 'text-white/40 border-white/10 hover:border-white/25'
                }`}
                style={activePersona === i ? { backgroundColor: p.color, borderColor: p.color, boxShadow: `0 0 25px ${p.color}30` } : {}}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePersona}
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-center text-white/40 text-sm mb-6">
                  <span className="font-semibold text-white">{personas[activePersona].role}</span> — {personas[activePersona].description}
                </p>
                <div className="relative rounded-xl overflow-hidden border border-white/5 bg-[#121212]">
                  <iframe
                    src={personas[activePersona].spotifyEmbed}
                    width="100%" height="380"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="rounded-xl" style={{ border: 'none' }}
                    title={`${personas[activePersona].name} on Spotify`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Legends & Lovers Promo */}
        {upcoming && (
          <motion.div
            className="mt-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-4xl mx-auto rounded-xl md:rounded-2xl overflow-hidden border border-white/5 group cursor-pointer"
                 style={{ aspectRatio: '16/9' }}>
              {/* Looping muted video background */}
              <video
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[3s]"
                poster="/video/legends-lovers-teaser.mp4#t=0.5"
              >
                <source src="/video/legends-lovers-teaser.mp4" type="video/mp4" />
              </video>

              {/* Overlays */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-700" />
              <div className="absolute inset-0"
                   style={{ background: `linear-gradient(180deg, transparent 30%, ${theme.primaryColor}15 100%)` }} />
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                   style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)' }} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
                <motion.p
                  className="text-[10px] tracking-[0.6em] text-white/40 mb-4"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3.69 }}
                >
                  COMING {upcoming.year}
                </motion.p>
                <motion.h3
                  className="text-2xl sm:text-4xl md:text-7xl font-black tracking-tight mb-3 md:mb-4 text-center"
                  style={{ color: flickerOn ? 'white' : 'transparent' }}
                  transition={{ duration: 0.05 }}
                >
                  {upcoming.title}
                </motion.h3>
                <p className="text-white/40 text-xs md:text-base max-w-md text-center tracking-wide mb-4 md:mb-8 px-2">
                  {upcoming.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase"
                     style={{ color: theme.primaryColor }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 12px ${theme.primaryColor}` }} />
                  PRESS FOLLOW TO BE READY
                </div>
              </div>

              {/* Vignette */}
              <div className="absolute inset-0 pointer-events-none"
                   style={{ boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.6)' }} />
            </div>

            {/* Follow on Spotify CTA */}
            <motion.div
              className="flex justify-center mt-8 md:mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <a
                href="https://open.spotify.com/artist/6M1VSmwtcuwS1DnvXTGk7P"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 md:px-10 py-3.5 md:py-4 text-xs md:text-sm tracking-[0.2em] font-bold text-white rounded-full border-2 border-[#1DB954] bg-[#1DB954]/10 hover:bg-[#1DB954] hover:text-black transition-all duration-500 hover:shadow-[0_0_40px_rgba(29,185,84,0.35)] hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                FOLLOW ON SPOTIFY
              </a>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MusicSection;
