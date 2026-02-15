import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { artistData } from '../data/artistData';

/** Word-by-word reveal on scroll */
const RevealText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.replace(/"/g, '').split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.04, duration: 0.3 }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

const StorySection: React.FC = () => {
  const { story, theme } = artistData;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="story" className="py-16 md:py-36 px-4 md:px-6 relative overflow-hidden" ref={containerRef}>
      {/* Section divider */}
      <motion.div
        className="absolute top-0 left-1/4 right-1/4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryColor}40, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[250px] opacity-[0.04]"
           style={{ backgroundColor: theme.primaryColor }} />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-[10px] tracking-[0.6em] mb-3" style={{ color: theme.primaryColor }}>ORIGIN</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">THE STORY</h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical progress line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/5">
            <motion.div className="w-full" style={{ height: lineHeight, backgroundColor: theme.primaryColor, opacity: 0.3 }} />
          </div>

          {story.chapters.map((chapter, i) => (
            <React.Fragment key={chapter.number}>
              {/* 3·6·9 separator between chapters */}
              {i > 0 && (
                <motion.div
                  className="text-center my-6 md:my-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-[10px] tracking-[0.8em]" style={{ color: `${theme.primaryColor}30` }}>
                    3 · 6 · 9
                  </span>
                </motion.div>
              )}

              <motion.div
                className={`relative pl-10 md:pl-0 mb-20 last:mb-0 ${
                  i % 2 === 0 ? 'md:pr-[55%]' : 'md:pl-[55%]'
                }`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 top-2 -translate-x-1/2 z-10">
                  <motion.div
                    className="w-3 h-3 rounded-full border-2"
                    style={{ borderColor: chapter.accent || theme.primaryColor, backgroundColor: '#050505' }}
                    whileInView={{ boxShadow: `0 0 12px ${chapter.accent || theme.primaryColor}40` }}
                    viewport={{ once: true }}
                  >
                    <div className="w-1 h-1 rounded-full m-[3px]"
                         style={{ backgroundColor: chapter.accent || theme.primaryColor }} />
                  </motion.div>
                </div>

                {/* Card with 3D tilt on hover */}
                <motion.div
                  className="bg-white/[0.015] border border-white/5 rounded-2xl p-8 md:p-10 transition-colors duration-500 cursor-default"
                  whileHover={{
                    rotateY: i % 2 === 0 ? 2 : -2,
                    rotateX: -1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    boxShadow: `0 20px 60px -20px ${(chapter.accent || theme.primaryColor)}15`,
                  }}
                  style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-baseline gap-4 mb-5">
                    <span className="text-4xl font-black opacity-15" style={{ color: chapter.accent || theme.primaryColor }}>
                      {chapter.number}
                    </span>
                    <h3 className="text-xl font-bold tracking-[0.1em]">{chapter.title}</h3>
                  </div>
                  <p className="text-white/45 text-sm leading-[1.8]">
                    {chapter.content}
                  </p>
                  {chapter.highlight && (
                    <motion.span
                      className="inline-block mt-5 text-[10px] tracking-[0.25em] px-4 py-1.5 rounded-full border"
                      style={{ borderColor: `${chapter.accent || theme.primaryColor}40`, color: chapter.accent || theme.primaryColor }}
                      whileHover={{ borderColor: chapter.accent || theme.primaryColor, scale: 1.05 }}
                    >
                      {chapter.highlight.toUpperCase()}
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* Quote — word by word reveal */}
        <motion.blockquote
          className="mt-28 text-center relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="text-7xl opacity-[0.06] font-serif mb-4" style={{ color: theme.primaryColor }}>"</div>
          <RevealText
            text={story.quote}
            className="text-lg md:text-xl italic text-white/50 leading-[1.9] max-w-2xl mx-auto"
          />
          <motion.cite
            className="block mt-8 text-[10px] tracking-[0.4em] not-italic"
            style={{ color: theme.primaryColor }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
          >
            {story.quoteAttribution}
          </motion.cite>
        </motion.blockquote>
      </div>
    </section>
  );
};

export default StorySection;
