import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-accent text-background overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 py-2.5 flex justify-between items-center">
            <p className="text-center text-sm font-medium font-montserrat tracking-wider grow">
              FREE SHIPPING ON ALL ORDERS OVER $150
            </p>
            <button onClick={() => setIsVisible(false)} className="text-background hover:opacity-75 transition-opacity" aria-label="Dismiss announcement">
              <FiX size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBar;