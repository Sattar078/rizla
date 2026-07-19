import React from 'react';
import { FiHeart, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { name, brand, price, image, isNew } = product;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative overflow-hidden rounded-lg shadow-md bg-gray-900/20"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        {isNew && (
          <span className="absolute top-3 left-3 bg-accent text-background font-montserrat text-xs font-bold uppercase px-2 py-1 rounded">
            New
          </span>
        )}
        {/* Hover Overlay with Actions */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button className="bg-white text-background p-3 rounded-full hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
            <FiHeart />
          </button>
          <button className="bg-white text-background p-3 rounded-full hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
            <FiEye />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 text-center">
        <p className="font-montserrat text-xs text-gray-400 uppercase tracking-wider mb-1">
          {brand}
        </p>
        <h3 className="font-playfair text-lg text-white capitalize mb-2 truncate">
          {name}
        </h3>
        <p className="font-montserrat text-base text-accent font-semibold">
          ${price.toFixed(2)}
        </p>
      </div>

      {/* Quick Add to Cart Button (appears on hover) */}
      <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
        <button className="w-full bg-accent text-background font-montserrat font-bold uppercase text-sm py-3">
          Add to Bag
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;