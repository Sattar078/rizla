import React from 'react';
import { motion } from 'framer-motion';

const VisitStore = () => {
  return (
    <div className="store">
    <section className="w-full px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="group relative h-[28rem] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/30 sm:h-[32rem]"
        >
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80"
            alt="Special Promo"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/30" />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center sm:px-12">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-accent"
            >
              Limited time offer
            </motion.p>
            <br />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mb-4 max-w-3xl font-playfair text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            >
              Grab exciting deals and special promos before they are gone.
            </motion.h2>
            <br />
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mb-8 max-w-2xl text-base text-gray-100 sm:text-lg"
            >
              Take advantage of a curated selection of seasonal discounts and exclusive offers designed to refresh your look.
            </motion.p>
            <br />
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center justify-center rounded-full bg-accent px-10 py-4 font-montserrat text-base font-bold uppercase tracking-[0.25em] text-background shadow-xl transition-all duration-300 hover:bg-green-600 hover:text-black sm:px-14 sm:py-5"
            >
              Grab Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
    </div>
  );
};

export default VisitStore;
