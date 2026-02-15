import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artistData } from '../data/artistData';

const navLinks = [
  { label: 'MUSIC', href: '#music' },
  { label: 'VIDEOS', href: '#videos' },
  { label: 'STORY', href: '#story' },
  { label: 'GALLERY', href: '#gallery' },
];

const ArtistNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-black/90 backdrop-blur-xl py-3' : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-[0.3em]"
             style={{ color: artistData.theme.primaryColor }}>
            AZER
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleClick(link.href)}
                className="text-xs tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                      style={{ backgroundColor: artistData.theme.primaryColor }} />
              </button>
            ))}
            <a href={artistData.featuredAlbum.spotifyUrl}
               target="_blank" rel="noopener noreferrer"
               className="text-xs tracking-[0.2em] px-4 py-2 border rounded-full transition-all duration-300 hover:text-black"
               style={{
                 borderColor: artistData.theme.primaryColor,
                 color: artistData.theme.primaryColor
               }}
               onMouseEnter={e => {
                 (e.target as HTMLElement).style.backgroundColor = artistData.theme.primaryColor;
                 (e.target as HTMLElement).style.color = '#000';
               }}
               onMouseLeave={e => {
                 (e.target as HTMLElement).style.backgroundColor = 'transparent';
                 (e.target as HTMLElement).style.color = artistData.theme.primaryColor;
               }}>
              STREAM NOW
            </a>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <motion.span className="block w-6 h-px bg-white" animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} />
            <motion.span className="block w-6 h-px bg-white" animate={{ opacity: menuOpen ? 0 : 1 }} />
            <motion.span className="block w-6 h-px bg-white" animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/95 flex flex-col items-center justify-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => handleClick(link.href)}
                className="text-2xl tracking-[0.3em] text-white/80 hover:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.a
              href={artistData.featuredAlbum.spotifyUrl}
              target="_blank" rel="noopener noreferrer"
              className="text-lg tracking-[0.2em] px-8 py-3 border rounded-full"
              style={{ borderColor: artistData.theme.primaryColor, color: artistData.theme.primaryColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              STREAM NOW
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArtistNav;
