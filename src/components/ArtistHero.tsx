import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { artistData } from '../data/artistData';

const ArtistHero: React.FC = () => {
  const { hero, theme } = artistData;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glitch, setGlitch] = useState(false);

  // Glitch effect every ~6s
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // 36 particles (3×6×...9 implied)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; pulse: number }[] = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 36; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 2.5 + 0.5,
        a: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const pulsedAlpha = p.a * (0.5 + 0.5 * Math.sin(time + p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 85, ${pulsedAlpha})`;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 85, ${pulsedAlpha * 0.15})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" id="hero">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0002] to-[#050505]" />
      <canvas ref={canvasRef} className="absolute inset-0 z-[1]" />

      {/* Scan lines overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.04]"
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)', backgroundSize: '100% 4px' }} />

      {/* Radial glow */}
      <div className="absolute inset-0 z-[2]"
           style={{ background: `radial-gradient(ellipse at 50% 40%, ${theme.primaryColor}18 0%, transparent 55%)` }} />

      {/* 369 watermark */}
      <motion.div
        className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none select-none"
        style={{ transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -5}px)` }}
      >
        <span className="text-[30vw] md:text-[25vw] font-black opacity-[0.025] tracking-[0.1em]"
              style={{ color: theme.primaryColor, WebkitTextStroke: `1px ${theme.primaryColor}20` }}>
          369
        </span>
      </motion.div>

      {/* Content with parallax */}
      <div className="relative z-10 text-center px-6 max-w-5xl"
           style={{ transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 5}px)` }}>
        <motion.p
          className="text-[10px] md:text-xs tracking-[0.6em] mb-6 uppercase"
          style={{ color: theme.primaryColor }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.369 }}
        >
          {hero.subtitle}
        </motion.p>

        {/* Glitch title */}
        <motion.h1
          className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tight leading-none mb-6 relative"
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="bg-clip-text text-transparent relative"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientTo})`,
                  filter: glitch ? 'hue-rotate(90deg)' : 'none',
                  transition: 'filter 0.05s'
                }}>
            {hero.artistName}
          </span>
          {/* Glitch layers */}
          {glitch && (
            <>
              <span className="absolute inset-0 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, #00ffff, ${theme.primaryColor})`,
                      transform: 'translate(3px, -2px)',
                      opacity: 0.7,
                      clipPath: 'polygon(0 15%, 100% 15%, 100% 40%, 0 40%)'
                    }}>
                {hero.artistName}
              </span>
              <span className="absolute inset-0 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme.gradientTo}, #ff00ff)`,
                      transform: 'translate(-3px, 2px)',
                      opacity: 0.7,
                      clipPath: 'polygon(0 65%, 100% 65%, 100% 85%, 0 85%)'
                    }}>
                {hero.artistName}
              </span>
            </>
          )}
        </motion.h1>

        <motion.p
          className="text-white/40 text-sm md:text-base max-w-lg mx-auto mb-10 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {hero.description}
        </motion.p>

        {/* CTA Buttons with glow */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <a href={hero.ctaLink} target="_blank" rel="noopener noreferrer"
             className="group relative px-10 py-4 text-sm tracking-[0.25em] font-bold text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,0,85,0.4)]"
             style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientTo})` }}>
            <span className="relative z-10">{hero.ctaText}</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          {hero.secondaryCta && (
            <a href={hero.secondaryCta.link}
               className="px-10 py-4 text-sm tracking-[0.25em] border border-white/15 rounded-full text-white/50 hover:text-white hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500">
              {hero.secondaryCta.text}
            </a>
          )}
        </motion.div>

        {/* Release badge */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase"
                style={{ color: theme.primaryColor }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 12px ${theme.primaryColor}` }} />
            {hero.tagline}
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-5 h-9 border border-white/15 rounded-full flex justify-center"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <motion.div
            className="w-1 h-2 rounded-full mt-1.5"
            style={{ backgroundColor: theme.primaryColor }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ArtistHero;
