import React from 'react';
import { motion } from 'framer-motion';
import { collections } from '../data/products';

const StoreGallery = () => {
  return (
    <div className="Gallery">
    <section className="w-full px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <br />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent"
          >
            Signature looks
          </motion.p>
          <br />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-4 font-playfair text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            Elevate your look with our trendsetting collection
          </motion.h2>
          <br />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto text-base text-gray-300 sm:text-lg"
          >
            Discover modern essentials and bold statement pieces designed to define your everyday presence.
          </motion.p>
          <br />
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative h-72 overflow-hidden rounded-[1.5rem] border border-white/10 shadow-2xl shadow-black/20 sm:h-80"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                >
                  <h3 className="mb-2 font-playfair text-2xl font-bold text-white sm:text-3xl">
                    {collection.name}
                  </h3>
                  <p className="mb-4 text-sm text-gray-100 sm:text-base">
                    {collection.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        <br />

        <div className="flex justify-center">
          <br />
          <br />
          <br />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-montserrat text-sm font-bold uppercase tracking-[0.25em] text-background shadow-lg shadow-accent/20 transition-all duration-300 hover:bg-green-600 hover:text-black sm:px-12 sm:py-4"
          >
            Explore Our Collection
          </motion.button>
        </div>
        <br />
      </div>
    </section>
    </div>
  );
};

export default StoreGallery;
