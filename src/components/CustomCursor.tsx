import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const location = useLocation();

  // Detect touch/mobile — skip cursor entirely
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleHover = () => setIsHovering(true);
    const handleUnhover = () => setIsHovering(false);

    window.addEventListener('mousemove', mouseMove);

    const addListeners = () => {
      document.querySelectorAll('a, button, .interactive, input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('mouseleave', handleUnhover);
      });
    };

    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      observer.disconnect();
    };
  }, [isTouchDevice]);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      transition: { type: 'spring' as const, damping: 20, stiffness: 250, mass: 0.5 }
    },
    hover: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: '#ff0055',
      mixBlendMode: 'difference' as const,
      transition: { type: 'spring' as const, damping: 20, stiffness: 250, mass: 0.5 }
    }
  };

  // Hide on mobile, touch devices, and game page
  if (isTouchDevice) return null;
  if (location.pathname === '/game') return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#ff0055] pointer-events-none z-[9999] hidden md:block"
      variants={variants}
      animate={isHovering ? 'hover' : 'default'}
    />
  );
};

export default CustomCursor;
