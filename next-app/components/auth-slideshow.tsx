'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const images = ['/Dashboard.png', '/banner.png', '/workspace example.png'];

export function AuthSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted dark:bg-black">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            fill
            priority={currentIndex === 0}
            className="object-cover object-center dark:brightness-[0.5] transition-all duration-700"
            sizes="50vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Slideshow indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-8 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white opacity-100 w-12'
                : 'bg-white/50 opacity-50 hover:opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
