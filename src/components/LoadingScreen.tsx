import { motion, AnimatePresence } from 'framer-motion';
import { artistData } from '../data/artistData';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  const { theme } = artistData;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          {/* Scan lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
               style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)', backgroundSize: '100% 4px' }} />

          {/* 369 flash */}
          <motion.div
            className="absolute text-[20vw] font-black tracking-[0.2em] select-none"
            style={{ color: theme.primaryColor, opacity: 0 }}
            animate={{
              opacity: [0, 0.15, 0.15, 0],
              scale: [0.8, 1, 1, 1.1],
            }}
            transition={{ duration: 1.2, times: [0, 0.1, 0.5, 1], ease: 'easeOut' }}
          >
            369
          </motion.div>

          {/* Pulsing ring */}
          <div className="relative w-16 h-16 mb-8">
            <div className="absolute inset-0 rounded-full border-2 opacity-20 animate-ping"
                 style={{ borderColor: theme.primaryColor }} />
            <div className="absolute inset-0 rounded-full border-t-2 animate-spin"
                 style={{ borderColor: theme.primaryColor }} />
          </div>

          {/* Artist name — slams in after 369 */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 1.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.5em]"
                style={{ color: theme.primaryColor }}>
              AZER
            </h1>
            <motion.p
              className="text-[10px] tracking-[0.6em] text-white/20 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              3 · 6 · 9
            </motion.p>
          </motion.div>

          {/* Bottom gradient pulse */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}, ${theme.gradientTo}, transparent)` }}
            animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
