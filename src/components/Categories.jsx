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
    <section className="w-full bg-background py-8 px-4 sm:px-6 overflow-x-auto">
      <div className="container mx-auto">
        <div
          ref={containerRef}
          className="flex gap-3 sm:gap-4 pb-2 overflow-x-auto scrollbar-hide"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-montserrat font-semibold whitespace-nowrap transition-all duration-300 text-sm sm:text-base ${
                activeCategory === category.id
                  ? 'bg-accent text-background shadow-lg'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/20'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
