import { motion } from 'framer-motion';

/**
 * Animated Ambient Gradient Backdrops.
 * Renders large, drifting, blurred orbs of color that mutate in size and coordinates.
 */
export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Orb 1: Indigo-purple glow in upper-left / center */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[130px] opacity-[0.25]"
        style={{
          background: 'radial-gradient(circle, #6366f1 0%, rgba(99, 102, 241, 0) 70%)',
          top: '-10%',
          left: '-5%',
        }}
      />

      {/* Orb 2: Pink glow in right / lower-center */}
      <motion.div
        animate={{
          x: [0, -90, 50, 0],
          y: [0, 70, -50, 0],
          scale: [1, 0.85, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] rounded-full blur-[110px] sm:blur-[140px] opacity-[0.2]"
        style={{
          background: 'radial-gradient(circle, #ec4899 0%, rgba(236, 72, 153, 0) 70%)',
          top: '30%',
          right: '-10%',
        }}
      />

      {/* Orb 3: Cyan/teal glow in lower-left */}
      <motion.div
        animate={{
          x: [0, 50, -60, 0],
          y: [0, 80, -30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full blur-[90px] sm:blur-[120px] opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 212, 0) 70%)',
          bottom: '-10%',
          left: '10%',
        }}
      />
    </div>
  );
}
