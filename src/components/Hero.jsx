import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Hero = () => {
  useEffect(() => {
    // GSAP animation for hero content
    gsap.fromTo(
      '.hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
    );
    gsap.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
    gsap.fromTo(
      '.hero-button',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out', delay: 0.7 }
    );
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/40"
        style={{
          backgroundImage:
            'url(https://via.placeholder.com/1200x800?text=Premium+Fashion)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 text-center">
        {/* Heading */}
        <motion.h1
          className="hero-title font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold text-accent max-w-4xl leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        >
          Discover Your Street Style with Our Diverse Collection
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="hero-subtitle font-poppins text-base sm:text-lg text-gray-200 max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        >
          Get your unique streetwear style with our various collections. Shop now to look fashionable with the latest trends.
        </motion.p>

        {/* Button Group */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'backOut', delay: 0.7 }}
        >
          <button className="hero-button bg-accent text-background font-montserrat font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-white hover:text-background transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wider text-sm sm:text-base">
            Shop Now
          </button>
          <button className="hero-button border-2 border-accent text-accent font-montserrat font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-accent hover:text-background transition-all duration-300 backdrop-blur-sm uppercase tracking-wider text-sm sm:text-base">
            Explore Collections
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-white/60 hover:text-accent transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;