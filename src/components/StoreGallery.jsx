import React from 'react';
import { motion } from 'framer-motion';
import { collections } from '../data/products';

const StoreGallery = () => {
  return (
    <section className="w-full bg-background py-16 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-accent mb-4"
          >
            Elevate Your Look with Our Trendsetting Collection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-poppins text-gray-300 max-w-2xl mx-auto text-base sm:text-lg"
          >
            Discover the latest fashion trends and enhance your style with our unique and trendsetting collection.
          </motion.p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative h-64 sm:h-72 rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2">
                    {collection.name}
                  </h3>
                  <p className="font-poppins text-gray-100 text-sm sm:text-base line-clamp-2 mb-4">
                    {collection.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-accent text-background font-montserrat font-bold px-8 sm:px-12 py-3.5 sm:py-4 rounded-full hover:bg-white hover:text-background transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wider text-sm sm:text-base"
          >
            Explore Our Collection
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default StoreGallery;
