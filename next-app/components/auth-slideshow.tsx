'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function AuthSlideshow() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 via-zinc-950 to-blue-500/10 opacity-80" />
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px]" />

      {/* Collage Container */}
      <div className="relative w-[140%] h-[120%] -rotate-6 scale-90 origin-center select-none pointer-events-none">
        {/* Center Main Dashboard */}
        <motion.div
          className="absolute top-[25%] left-[15%] w-[65%] h-[50%] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: [0, -10, 0], opacity: 1 }}
          transition={{
            opacity: { duration: 0.8, ease: 'easeOut' },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Image
            src="/Dashboard.png"
            alt="Dashboard"
            fill
            className="object-cover object-left-top"
          />
        </motion.div>

        {/* Floating Card: Habit */}
        <motion.div
          className="absolute bottom-[15%] left-[5%] w-[40%] h-[30%] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-zinc-900"
          initial={{ y: 40, opacity: 0, x: -20 }}
          animate={{ y: [0, 15, 0], opacity: 1, x: 0 }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3 },
            x: { duration: 0.8, delay: 0.3 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          }}
        >
          <Image src="/habit_1.png" alt="Habits" fill className="object-cover object-left-top" />
        </motion.div>

        {/* Floating Card: Stats */}
        <motion.div
          className="absolute top-[15%] right-[5%] w-[35%] h-[30%] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-zinc-900"
          initial={{ y: 30, opacity: 0, x: 20 }}
          animate={{ y: [0, -15, 0], opacity: 1, x: 0 }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            x: { duration: 0.8, delay: 0.4 },
            y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        >
          <Image src="/stats_1.png" alt="Stats" fill className="object-cover object-left-top" />
        </motion.div>

        {/* Floating Card: Timer */}
        <motion.div
          className="absolute bottom-[20%] right-[15%] w-[30%] h-[25%] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-zinc-900"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: [0, 10, 0], opacity: 1 }}
          transition={{
            opacity: { duration: 0.8, delay: 0.6 },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
          }}
        >
          <Image src="/timer.png" alt="Timer" fill className="object-cover object-left-top" />
        </motion.div>
      </div>
    </div>
  );
}
