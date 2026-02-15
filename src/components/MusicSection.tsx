import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artistData } from '../data/artistData';

const MusicSection: React.FC = () => {
  const { featuredAlbum, personas, theme, upcoming } = artistData;
  const [activePersona, setActivePersona] = useState(0);
  const [typedTitle, setTypedTitle] = useState('');
  const [titleVisible, setTitleVisible] = useState(false);
  const [flickerOn, setFlickerOn] = useState(true);

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

  // Upcoming flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerOn(false);
      setTimeout(() => setFlickerOn(true), 100 + Math.random() * 200);
    }, 3690);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="music" className="py-24 md:py-36 px-6 relative overflow-hidden">
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-[10px] tracking-[0.6em] mb-3" style={{ color: theme.primaryColor }}>LISTEN</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">THE MUSIC</h2>
        </motion.div>

        {/* Featured Album */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setTitleVisible(true)}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] tracking-[0.4em] mb-3" style={{ color: theme.primaryColor }}>LATEST ALBUM</p>
              <h3 className="text-5xl md:text-8xl font-black mb-4 min-h-[1.2em]">
                {typedTitle}
                <motion.span
                  className="inline-block w-[3px] h-[0.8em] ml-1 align-middle"
                  style={{ backgroundColor: theme.primaryColor }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              </h3>
              <p className="text-white/30 text-sm tracking-wider mb-2">{featuredAlbum.subtitle}</p>
              <p className="text-white/50 text-sm leading-relaxed mb-8">{featuredAlbum.description}</p>
              <div className="flex gap-4">
                <a href={featuredAlbum.spotifyUrl} target="_blank" rel="noopener noreferrer"
                   className="px-8 py-3 text-xs tracking-[0.2em] rounded-full text-black font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,85,0.3)]"
                   style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientTo})` }}>
                  SPOTIFY
                </a>
                <a href={featuredAlbum.appleMusicUrl} target="_blank" rel="noopener noreferrer"
                   className="px-8 py-3 text-xs tracking-[0.2em] rounded-full border border-white/15 text-white/50 hover:border-white/40 hover:text-white transition-all duration-300">
                  APPLE MUSIC
                </a>
              </div>
            </div>
            <div className="relative">
              {/* Red spotlight behind embed */}
              <div className="absolute -inset-4 rounded-2xl blur-3xl opacity-10"
                   style={{ background: `radial-gradient(circle, ${theme.primaryColor}, transparent)` }} />
              <div className="relative rounded-xl overflow-hidden border border-white/5">
                <iframe
                  src={featuredAlbum.spotifyEmbed}
                  width="100%" height="380"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy" className="rounded-xl" style={{ border: 'none' }}
                  title={`${featuredAlbum.title} on Spotify`}
                />
              </div>
            </div>
          </div>
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

          <div className="flex justify-center gap-4 mb-10">
            {personas.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActivePersona(i)}
                className={`relative px-8 py-3 text-xs tracking-[0.2em] rounded-full border transition-all duration-500 overflow-hidden ${
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
                <div className="relative rounded-xl overflow-hidden border border-white/5">
                  <iframe
                    src={personas[activePersona].spotifyEmbed}
                    width="100%" height="380"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy" className="rounded-xl" style={{ border: 'none' }}
                    title={`${personas[activePersona].name} on Spotify`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Upcoming teaser */}
        {upcoming && (
          <motion.div
            className="mt-24 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-10 py-8 border border-white/5 rounded-2xl bg-white/[0.01] relative overflow-hidden">
              <div className="absolute inset-0 opacity-5"
                   style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,107,0,0.1) 3px, rgba(255,107,0,0.1) 4px)' }} />
              <p className="text-[10px] tracking-[0.4em] text-white/20 mb-3">COMING {upcoming.year}</p>
              <motion.p
                className="text-3xl md:text-4xl font-black"
                style={{ color: flickerOn ? theme.gradientTo : 'transparent' }}
                transition={{ duration: 0.05 }}
              >
                {upcoming.title}
              </motion.p>
              <p className="text-white/30 text-sm mt-3">{upcoming.description}</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MusicSection;
