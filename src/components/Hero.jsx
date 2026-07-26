import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Hero = () => {
  const navigate = useNavigate();

  useEffect(() => {
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

  const scrollToProducts = () => {
    document.querySelector('.collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 sm:pt-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://i.pinimg.com/1200x/d3/36/8e/d3368e1e0a540acb38443c46ffdc3bdc.jpg)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/70 to-black/40" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          Streetwear • Premium • Boutique
        </motion.div>

        <motion.h1
          className="hero-title mb-6 max-w-5xl font-playfair text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        >
          Discover <span className="text-accent">Your</span> Street Style With Our Diverse Collection
        </motion.h1>
        <br />

        <motion.p
          className="hero-subtitle mb-10 max-w-2xl text-base text-gray-200 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        >
          Get your unique streetwear style with curated looks, elevated essentials, and standout pieces made to move with you.
        </motion.p>
        <br />

        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'backOut', delay: 0.7 }}
        >
          <button
            onClick={() => navigate('/shop')}
            className="hero-button flex place-items-center justify-center rounded-md px-8 py-3.5 font-montserrat text-sm font-bold uppercase tracking-[0.25em] text-background shadow-lg shadow-accent/20 transition-all duration-300 hover:-translate-y-1 hover:bg-green-500 hover:text-black sm:px-10 sm:py-3"
          >
            Shop Now
          </button>
          <button
            onClick={() => navigate('/collections')}
            className="hero-button flex items-center justify-center rounded-full border border-accent/100 px-8 py-3.5 font-montserrat text-sm font-bold uppercase tracking-[0.25em] text-accent backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black sm:px-10 sm:py-4"
          >
            Explore Collections
          </button>
        </motion.div>
      </div>

      <motion.button
        onClick={scrollToProducts}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to products"
      >
        <svg
          className="h-6 w-6 text-white/70 transition-colors hover:text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.button>
    </section>
  );
};

export default Hero;
