import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.products.getCollections().then(({ collections: cols }) => setCollections(cols));
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Curated For You</p>
          <h1 className="font-playfair text-4xl font-bold text-white sm:text-5xl">Our Collections</h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Explore signature looks crafted for every mood — from street style to vintage vibes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="group relative h-80 overflow-hidden rounded-[1.5rem] border border-white/10"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="mb-2 font-playfair text-2xl font-bold text-white">{collection.name}</h3>
                <p className="mb-4 text-sm text-gray-200">{collection.description}</p>
                <Link
                  to={`/shop?collection=${encodeURIComponent(collection.name.split(' ')[0])}`}
                  className="inline-block w-fit rounded-full bg-accent px-6 py-2 text-sm font-bold uppercase tracking-wider text-background hover:bg-green-600"
                >
                  Shop Collection
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
