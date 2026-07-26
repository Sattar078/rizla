import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => (
  <div className="min-h-screen pt-28 pb-20">
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Our Story</p>
        <h1 className="mb-8 font-playfair text-4xl font-bold text-white sm:text-5xl">About RIZLA Boutique</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Born in the heart of Nalasupara, Mumbai, RIZLA Boutique is where street culture meets refined fashion.
            We curate premium streetwear that speaks to the bold, the creative, and the effortlessly stylish.
          </p>
          <p>
            From elevated essentials to statement pieces, every item in our collection is handpicked to help you
            define your unique look. We believe fashion is more than clothing — it&apos;s an expression of identity.
          </p>
          <p>
            Visit our store or shop online to discover collections inspired by street style, Korean fashion trends,
            and vintage vibes that never go out of style.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { label: 'Curated Pieces', value: '500+' },
            { label: 'Happy Customers', value: '2K+' },
            { label: 'Collections', value: '12+' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="font-playfair text-3xl font-bold text-accent">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-block rounded-full bg-accent px-10 py-4 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-background hover:bg-green-600"
          >
            Shop Our Collection
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

export default About;
