import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HelmetProvider } from 'react-helmet-async';
import { Heart, Music, Sparkles, Wallet, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { artistData } from '../data/artistData';
import CustomCursor from '../components/CustomCursor';
import ThreeSixNine from '../components/ThreeSixNine';
import SupportChatbot from '../components/SupportChatbot';

const tiers = [
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'SUPPORTER',
    description: 'Buy me a coffee. Keep the late-night sessions alive.',
    amount: '₹99+',
    accent: '#ff0055',
  },
  {
    icon: <Music className="w-5 h-5" />,
    title: 'BELIEVER',
    description: 'Fund the next single. Your name in the credits.',
    amount: '₹499+',
    accent: '#ff6b00',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'LEGEND',
    description: 'Back the vision. Early access to unreleased tracks.',
    amount: '₹999+',
    accent: '#D4AF37',
  },
];

const qrMethods = [
  {
    id: 'upi',
    label: 'UPI DIRECT',
    icon: <Wallet className="w-4 h-4" />,
    image: '/images/QR DONATE UPI.png',
    subtitle: 'ASHWIN AZER',
    description: 'Google Pay · PhonePe · Paytm · Any UPI App',
    badgeColor: '#ff0055',
  },
  {
    id: 'razorpay',
    label: 'RAZORPAY',
    icon: <CreditCard className="w-4 h-4" />,
    image: '/images/QrCode (1).jpeg',
    subtitle: 'ASHWIN RAMESH',
    description: 'Razorpay · BHIM UPI · Cards · Net Banking',
    badgeColor: '#528FF0',
  },
];

const SupportPage: React.FC = () => {
  const { theme } = artistData;
  const [activeMethod, setActiveMethod] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

  // Particle canvas — 36 particles like hero
  useEffect(() => {
    if (isMobile) return;
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
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.4 + 0.05,
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
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 85, ${pulsedAlpha * 0.15})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [isMobile]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Support Ashwin Azer | Donate</title>
        <meta name="description" content="Support Ashwin Azer's independent music. Donate via UPI or Razorpay to fuel the next album, music video, and live performance." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff0055] selection:text-black overflow-hidden">
        <CustomCursor />
        <ThreeSixNine />

        {/* Global noise texture — same as LandingPage */}
        <div className="fixed inset-0 pointer-events-none z-[4] opacity-[0.015] mix-blend-overlay global-noise-texture" />

        {/* Scroll progress bar — same gradient as LandingPage */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
          style={{ scaleX, background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.gradientTo})` }}
        />

        {/* Particle canvas — same as ArtistHero */}
        <canvas ref={canvasRef} className="fixed inset-0 z-[1]" style={{ display: isMobile ? 'none' : 'block' }} />

        {/* ── HERO SECTION ── */}
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background gradient — same as ArtistHero */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0002] to-[#050505]" />

          {/* Scan lines — same as ArtistHero */}
          <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.04]"
               style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)', backgroundSize: '100% 4px' }} />

          {/* Radial glow */}
          <div className="absolute inset-0 z-[2]"
               style={{ background: `radial-gradient(ellipse at 50% 40%, ${theme.primaryColor}18 0%, transparent 55%)` }} />

          {/* 369 watermark — same as ArtistHero */}
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
          <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl"
               style={{ transform: isMobile ? 'none' : `translate(${mousePos.x * 8}px, ${mousePos.y * 5}px)` }}>
            <motion.p
              className="text-[10px] md:text-xs tracking-[0.6em] mb-6 uppercase"
              style={{ color: theme.primaryColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.369 }}
            >
              INDEPENDENT ARTIST
            </motion.p>

            {/* Glitch title — same effect as ArtistHero */}
            <motion.h1
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-none mb-4 md:mb-6 relative"
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
                SUPPORT
              </span>
              {glitch && (
                <>
                  <span className="absolute inset-0 bg-clip-text text-transparent"
                        style={{
                          backgroundImage: `linear-gradient(135deg, #00ffff, ${theme.primaryColor})`,
                          transform: 'translate(3px, -2px)',
                          opacity: 0.7,
                          clipPath: 'polygon(0 15%, 100% 15%, 100% 40%, 0 40%)'
                        }}>
                    SUPPORT
                  </span>
                  <span className="absolute inset-0 bg-clip-text text-transparent"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${theme.gradientTo}, #ff00ff)`,
                          transform: 'translate(-3px, 2px)',
                          opacity: 0.7,
                          clipPath: 'polygon(0 65%, 100% 65%, 100% 85%, 0 85%)'
                        }}>
                    SUPPORT
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              className="text-white/40 text-xs md:text-base max-w-lg mx-auto mb-8 md:mb-10 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              No major label. No corporate backing. Just raw talent, late nights,
              and a mic. Every rupee goes directly into creating music that moves you.
            </motion.p>

            {/* CTA — same style as hero buttons */}
            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <a href="#donate"
                 className="group relative px-8 md:px-10 py-3.5 md:py-4 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] font-bold text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,0,85,0.4)]"
                 style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientTo})` }}>
                <span className="relative z-10">DONATE NOW</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </motion.div>

            {/* Pulse badge — same as hero */}
            <motion.div
              className="mt-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase"
                    style={{ color: theme.primaryColor }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 12px ${theme.primaryColor}` }} />
                FUEL THE VISION
              </span>
            </motion.div>
          </div>

          {/* Scroll indicator — same as hero */}
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

        {/* ── DONATE SECTION ── */}
        <section id="donate" className="py-16 md:py-36 px-4 md:px-6 relative overflow-hidden bg-[#050505]">
          {/* Section divider — same as StorySection */}
          <motion.div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}40, transparent)` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          {/* Background glow — same as StorySection */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[250px] opacity-[0.04]"
               style={{ backgroundColor: theme.primaryColor }} />

          {/* Noise texture — same as StorySection */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Section header — same pattern as StorySection */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className="text-[10px] tracking-[0.6em] mb-3" style={{ color: theme.primaryColor }}>SCAN TO DONATE</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">CHOOSE METHOD</h2>
            </motion.div>

            {/* Mobile toggle pills */}
            <motion.div
              className="flex md:hidden justify-center gap-2 mb-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {qrMethods.map((method, i) => (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(i)}
                  className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] font-medium transition-all duration-300"
                  style={{
                    background: activeMethod === i ? `${method.badgeColor}15` : 'transparent',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: activeMethod === i ? `${method.badgeColor}40` : 'rgba(255,255,255,0.05)',
                    color: activeMethod === i ? method.badgeColor : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {method.icon}
                  {method.label}
                </button>
              ))}
            </motion.div>

            {/* Desktop: side by side — card style from StorySection */}
            <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {qrMethods.map((method, i) => (
                <motion.div
                  key={method.id}
                  className="relative"
                  initial={{ opacity: 0, x: i === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Card — bg-white/[0.015] border border-white/5 rounded-2xl like StorySection */}
                  <motion.div
                    className="bg-white/[0.015] border border-white/5 rounded-2xl p-8 md:p-10 text-center h-full flex flex-col items-center transition-colors duration-500 cursor-default"
                    whileHover={{
                      rotateY: i === 0 ? 2 : -2,
                      rotateX: -1,
                      borderColor: 'rgba(255,255,255,0.1)',
                      boxShadow: `0 20px 60px -20px ${method.badgeColor}15`,
                    }}
                    style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Badge pill — like chapter highlight pills in StorySection */}
                    <motion.span
                      className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] px-4 py-1.5 rounded-full border mb-8"
                      style={{ borderColor: `${method.badgeColor}40`, color: method.badgeColor }}
                      whileHover={{ borderColor: method.badgeColor, scale: 1.05 }}
                    >
                      {method.icon}
                      {method.label}
                    </motion.span>

                    {/* QR Image */}
                    <div className="relative mx-auto w-52 h-52 mb-8 rounded-2xl overflow-hidden bg-white p-2.5">
                      <img
                        src={method.image}
                        alt={`Donate to Ashwin Azer via ${method.label}`}
                        className="w-full h-full object-contain"
                        loading="eager"
                      />
                    </div>

                    <p className="text-white/60 text-xs tracking-[0.15em] mb-1.5">
                      {method.subtitle}
                    </p>
                    <p className="text-white/25 text-[10px] tracking-wider">
                      {method.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Mobile: animated card swap */}
            <div className="md:hidden flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={qrMethods[activeMethod].id}
                  className="relative w-full max-w-sm"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div className="bg-white/[0.015] border border-white/5 rounded-2xl p-8 text-center">
                    <span
                      className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] px-4 py-1.5 rounded-full border mb-8"
                      style={{ borderColor: `${qrMethods[activeMethod].badgeColor}40`, color: qrMethods[activeMethod].badgeColor }}
                    >
                      {qrMethods[activeMethod].icon}
                      {qrMethods[activeMethod].label}
                    </span>

                    <div className="relative mx-auto w-56 h-56 mb-6 rounded-2xl overflow-hidden bg-white p-2.5">
                      <img
                        src={qrMethods[activeMethod].image}
                        alt={`Donate via ${qrMethods[activeMethod].label}`}
                        className="w-full h-full object-contain"
                        loading="eager"
                      />
                    </div>

                    <p className="text-white/60 text-xs tracking-[0.15em] mb-1.5">
                      {qrMethods[activeMethod].subtitle}
                    </p>
                    <p className="text-white/25 text-[10px] tracking-wider">
                      {qrMethods[activeMethod].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Receipt Instructions ── */}
            <motion.div
              className="mt-16 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/[0.015] border border-white/5 rounded-2xl p-8 md:p-10 text-center">
                <p className="text-[10px] tracking-[0.6em] mb-4" style={{ color: theme.accentGold }}>
                  AFTER PAYMENT
                </p>
                <h3 className="text-lg md:text-xl font-bold tracking-[0.1em] mb-5">
                  GET YOUR RECEIPT
                </h3>
                <p className="text-white/45 text-sm leading-[1.8] mb-6">
                  Screenshot your payment with the <span className="text-white/70">Transaction ID visible</span> and
                  email it along with your <span className="text-white/70">name</span> and a <span className="text-white/70">comment</span> to:
                </p>
                <a
                  href="mailto:admin@ashwinazer.me?subject=Donation%20Receipt%20Request&body=Hi%20Ashwin%2C%0A%0AAttached%20is%20my%20payment%20screenshot.%0A%0AName%3A%20%0ATransaction%20ID%3A%20%0AComment%3A%20%0A%0AThanks!"
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-xs md:text-sm tracking-[0.2em] font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]"
                  style={{ background: `linear-gradient(135deg, ${theme.accentGold}, ${theme.gradientTo})`, color: '#000' }}
                >
                  <span className="relative z-10">admin@ashwinazer.me</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-white/20 text-[10px] tracking-[0.15em] mt-5">
                  INCLUDE: SCREENSHOT · TRANSACTION ID · YOUR NAME · COMMENT
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3·6·9 separator — same as StorySection */}
        <div className="text-center py-6 md:py-10">
          <span className="text-[10px] tracking-[0.8em]" style={{ color: `${theme.primaryColor}30` }}>
            3 · 6 · 9
          </span>
        </div>

        {/* ── IMPACT SECTION ── */}
        <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden bg-[#050505]">
          {/* Section divider */}
          <motion.div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.accentGold}40, transparent)` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className="text-[10px] tracking-[0.6em] mb-3" style={{ color: theme.primaryColor }}>YOUR CONTRIBUTION</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">YOUR IMPACT</h2>
            </motion.div>

            {/* Tier cards — styled like StorySection chapter cards with 3D tilt */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="bg-white/[0.015] border border-white/5 rounded-2xl p-8 md:p-10 transition-colors duration-500 cursor-default h-full"
                    whileHover={{
                      rotateY: i === 0 ? 2 : i === 2 ? -2 : 0,
                      rotateX: -1,
                      borderColor: 'rgba(255,255,255,0.1)',
                      boxShadow: `0 20px 60px -20px ${tier.accent}15`,
                    }}
                    style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Number — like chapter numbers in StorySection */}
                    <span className="text-4xl font-black opacity-15" style={{ color: tier.accent }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-center gap-3 mt-4 mb-4">
                      <div style={{ color: tier.accent }}>{tier.icon}</div>
                      <h3 className="text-sm font-bold tracking-[0.2em]">{tier.title}</h3>
                    </div>
                    <p className="text-white/45 text-sm leading-[1.8] mb-5">{tier.description}</p>
                    {/* Amount badge — like chapter highlight pills */}
                    <motion.span
                      className="inline-block text-[10px] tracking-[0.25em] px-4 py-1.5 rounded-full border"
                      style={{ borderColor: `${tier.accent}40`, color: tier.accent }}
                      whileHover={{ borderColor: tier.accent, scale: 1.05 }}
                    >
                      {tier.amount}
                    </motion.span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3·6·9 separator */}
        <div className="text-center py-6 md:py-10">
          <span className="text-[10px] tracking-[0.8em]" style={{ color: `${theme.primaryColor}30` }}>
            3 · 6 · 9
          </span>
        </div>

        {/* ── WHERE IT GOES ── */}
        <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden bg-[#050505]">
          <motion.div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.gradientTo}40, transparent)` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px] opacity-[0.03]"
               style={{ backgroundColor: theme.accentGold }} />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className="text-[10px] tracking-[0.6em] mb-3" style={{ color: theme.primaryColor }}>TRANSPARENCY</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">WHERE IT GOES</h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-10 md:gap-16">
              {[
                { label: 'STUDIO TIME', pct: '40%', accent: '#ff0055' },
                { label: 'MUSIC VIDEOS', pct: '25%', accent: '#ff6b00' },
                { label: 'DISTRIBUTION', pct: '20%', accent: '#D4AF37' },
                { label: 'LIVE SHOWS', pct: '15%', accent: '#ff0055' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <p className="text-4xl md:text-5xl font-black tracking-tight mb-2 bg-clip-text text-transparent"
                     style={{ backgroundImage: `linear-gradient(135deg, ${item.accent}, ${theme.gradientTo})` }}>
                    {item.pct}
                  </p>
                  <p className="text-[9px] md:text-[10px] tracking-[0.4em] text-white/25">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE — same pattern as StorySection blockquote ── */}
        <section className="py-20 md:py-36 px-4 md:px-6 relative overflow-hidden bg-[#050505]">
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.blockquote
              className="text-center relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="text-7xl opacity-[0.06] font-serif mb-4" style={{ color: theme.primaryColor }}>"</div>
              <p className="text-lg md:text-xl italic text-white/50 leading-[1.9] max-w-2xl mx-auto">
                They deleted my music. They couldn't delete the soul.
                Every donation is proof that independent art survives.
              </p>
              <motion.cite
                className="block mt-8 text-[10px] tracking-[0.4em] not-italic"
                style={{ color: theme.primaryColor }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                — ASHWIN AZER
              </motion.cite>
            </motion.blockquote>
          </div>
        </section>

        {/* ── Footer — same as ArtistFooter ── */}
        <footer className="py-12 md:py-16 px-4 md:px-6 border-t border-white/5 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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

              <Link
                to="/"
                className="text-[10px] tracking-[0.15em] hover:text-white/40 transition-colors"
                style={{ color: `${theme.primaryColor}60` }}
              >
                BACK TO HOME →
              </Link>
            </div>
          </div>
        </footer>

        {/* AI Chatbot */}
        <SupportChatbot />

        {/* Bottom gradient pulse — same as LoadingScreen */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-[1px] z-50 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}, ${theme.gradientTo}, transparent)` }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
      </div>
    </HelmetProvider>
  );
};

export default SupportPage;
