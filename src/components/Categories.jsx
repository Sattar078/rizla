import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/products';

const Categories = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const containerRef = useRef(null);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="category">
    <section className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur md:p-10 lg:p-12">
        <div className="mb-8 flex flex-col gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <br />
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Browse by vibe</p><br />
            <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl"><span className='mood'> Curated collections for every mood</span></h2>
          </div>
          <br />
          <p className="max-w-xl text-sm text-gray-300 sm:text-base">
            Explore premium essentials, refined layers, and standout statement pieces in one place.
          </p>
          <br />
        </div>
<br />
        <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:gap-5">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 font-montserrat text-sm font-semibold transition-all duration-300 sm:px-8 sm:py-3 sm:text-base ${
                activeCategory === category.id
                  ? 'bg-accent text-background shadow-lg shadow-accent/20'
                  : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
};

export default Categories;
