import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LegendsGame from './pages/LegendsGame';

const App: React.FC = () => {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
      // In a real GA setup, we'd send pageview hits here
      // For gtag.js, it handles it mostly automatically, but manual events can be added
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<LegendsGame />} />
      <Route path="/legends-and-lovers" element={<LegendsGame />} />
    </Routes>
  );
};

export default App;
