import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { artistData } from './data/artistData';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import ThreeSixNine from './components/ThreeSixNine';
import ArtistHero from './components/ArtistHero';
import LatestRelease from './components/LatestRelease';
import MusicSection from './components/MusicSection';
import VideoShowcase from './components/VideoShowcase';
import StorySection from './components/StorySection';
import GallerySection from './components/GallerySection';
import ArtistFooter from './components/ArtistFooter';
import ArtistNav from './components/ArtistNav';

const App: React.FC = () => {
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

export default App;
