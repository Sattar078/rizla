import React from 'react';
import { motion } from 'framer-motion';

const VisitStore = () => {
  return (
    <section className="w-full bg-background py-16 sm:py-24 px-4 sm:px-6">
      <div className="container mx-auto">
        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden group cursor-pointer"
        >
          {/* Background Image */}
          <img
            src="https://via.placeholder.com/1200x600?text=Grab+Exciting+Deals"
            alt="Special Promo"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/55 transition-all duration-500" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center px-6 sm:px-12 text-center z-10">
            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-accent mb-4 max-w-3xl"
            >
              Grab Exciting Deals and Special Promos Today, Don't Miss Out!
            </motion.h2>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="font-poppins text-gray-100 max-w-2xl mb-8 text-base sm:text-lg"
            >
              Take advantage of today's special promotions with a variety of attractive offers such as discounts and exclusive offers. Get it soon before it runs out!
            </motion.p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-accent text-background font-montserrat font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full hover:bg-white hover:text-background transition-all duration-300 shadow-xl uppercase tracking-wider text-base sm:text-lg"
            >
              Grab Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisitStore;
