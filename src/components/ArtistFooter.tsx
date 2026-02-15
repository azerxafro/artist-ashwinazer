import React from 'react';
import { artistData } from '../data/artistData';

const ArtistFooter: React.FC = () => {
  const { theme, socials, label } = artistData;

  return (
    <footer className="py-16 px-6 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div>
            <p className="text-2xl font-black tracking-[0.3em]" style={{ color: theme.primaryColor }}>
              ASHWIN AZER
            </p>
            <p className="text-[10px] text-white/25 tracking-[0.2em] mt-1">Artist · Producer · Visionary</p>
          </div>

          <div className="flex gap-6 text-[10px] text-white/25">
            {socials.slice(0, 4).map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="hover:text-white/50 transition-colors tracking-[0.15em]">
                {s.name.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-[10px] text-white/15 tracking-wider">
            © {new Date().getFullYear()} ASHWIN AZER. ALL RIGHTS RESERVED.
          </p>

          {/* 369 Easter egg */}
          <span className="group relative text-[10px] tracking-[0.4em] cursor-default select-none"
                style={{ color: `${theme.primaryColor}25` }}>
            369
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-[9px] text-white/60 tracking-[0.15em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Singularity & Oneness
            </span>
          </span>

          <div className="flex items-center gap-6">
            <a href={label.url} target="_blank" rel="noopener noreferrer"
               className="text-[10px] text-white/15 tracking-wider hover:text-white/30 transition-colors">
              {label.name}
            </a>
            <a href="https://press.ashwinazer.rocks" target="_blank" rel="noopener noreferrer"
               className="text-[10px] tracking-[0.15em] hover:text-white/40 transition-colors"
               style={{ color: `${theme.primaryColor}60` }}>
              PRESS KIT →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ArtistFooter;
