import React, { Suspense, useEffect, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

// Lazy-load the game page to code-split heavy Three.js dependencies
const LegendsGame = lazy(() => import('./pages/LegendsGame'));

const App: React.FC = () => {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
      // In a real GA setup, we'd send pageview hits here
      // For gtag.js, it handles it mostly automatically, but manual events can be added
  }, [location]);

  return (
    <Suspense fallback={
      <div style={{ width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontSize: '10px', letterSpacing: '0.3em' }}>
        LOADING...
      </div>
    }>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<LegendsGame />} />
        <Route path="/legends-and-lovers" element={<LegendsGame />} />
      </Routes>
    </Suspense>
  );
};

export default App;
