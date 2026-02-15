import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { artistData } from '../data/artistData';
import LoadingScreen from '../components/LoadingScreen';
import CustomCursor from '../components/CustomCursor';
import ThreeSixNine from '../components/ThreeSixNine';
import ArtistHero from '../components/ArtistHero';
import LatestRelease from '../components/LatestRelease';
import MusicSection from '../components/MusicSection';
import VideoShowcase from '../components/VideoShowcase';
import StorySection from '../components/StorySection';
import GallerySection from '../components/GallerySection';
import ArtistFooter from '../components/ArtistFooter';
import ArtistNav from '../components/ArtistNav';

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const minLoadTime = 1800;
    const startTime = Date.now();
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);
      setTimeout(() => setIsLoading(false), remaining);
    };
    if (document.readyState === 'complete') handleLoad();
    else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const { theme, seo } = artistData;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords.join(', ')} />
        <link rel="canonical" href={seo.canonicalUrl} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
      </Helmet>

      <LoadingScreen isLoading={isLoading} />

      <div className="relative min-h-screen text-white selection:bg-[#ff0055] selection:text-black"
           style={{ backgroundColor: theme.secondaryColor }}>
        <CustomCursor />
        <ThreeSixNine />

        {/* Global noise texture */}
        <div className="fixed inset-0 pointer-events-none z-[4] opacity-[0.015]"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', mixBlendMode: 'overlay' }} />

        {/* Scroll progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
          style={{ scaleX, background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.gradientTo})` }}
        />

        <ArtistNav />

        <main>
          <ArtistHero />
          <LatestRelease />
          
          {/* Legends & Lovers Promo Banner */}
          <section className="py-12 md:py-20 relative overflow-hidden bg-black flex justify-center items-center">
             <div className="absolute inset-0 bg-[url('/images/hero-bg.webp')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
             <div className="relative z-10 text-center max-w-4xl mx-auto px-4 md:px-6 border border-white/10 bg-black/50 backdrop-blur-md p-8 md:p-12 rounded-2xl md:rounded-3xl">
                <p className="text-[10px] md:text-xs tracking-[0.6em] text-[#D4AF37] mb-3 md:mb-4">COMING 2026</p>
                <h2 className="text-3xl md:text-7xl font-black italic tracking-tighter mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#ff0055]">
                   LEGENDS & LOVERS
                </h2>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
                   <a href="/game" className="px-8 md:px-10 py-3 md:py-4 bg-white text-black font-bold tracking-widest rounded-full hover:scale-105 transition-transform duration-300 text-sm">
                      ENTER THE EXPERIENCE
                   </a>
                </div>
             </div>
          </section>

          <MusicSection />
          <VideoShowcase />
          <StorySection />
          <GallerySection />
        </main>

        <ArtistFooter />
        <Analytics />
      </div>
    </HelmetProvider>
  );
};

export default LandingPage;
