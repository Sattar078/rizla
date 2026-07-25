import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Blog'],
    },
    {
      title: 'Discover',
      links: ['New Arrivals', 'Best Sellers', 'Collections', 'Sale'],
    },
    {
      title: 'Support',
      links: ['Contact Us', 'FAQ', 'Shipping Info', 'Returns'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    
    <footer className="w-full border-t border-white/10 bg-black/90">
      <div className="foot">
      <br />
      <br />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 sm:gap-12"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="mb-4 font-playfair text-2xl font-bold text-white sm:text-3xl">RIZLA</h3>
            <p className="mb-6 max-w-sm text-sm text-gray-400 sm:text-base">
              Experience refined streetwear and premium fashion all in one elevated space.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 flex-shrink-0 text-accent" />
                <p className="text-sm text-gray-300">Nalasupara, Mumbai</p>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 flex-shrink-0 text-accent" />
                <p className="text-sm text-gray-300">+91 98765 43210</p>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="mt-1 flex-shrink-0 text-accent" />
                <p className="text-sm text-gray-300">hello@rizla.com</p>
              </div>
            </div>
          </motion.div>

          {footerLinks.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-white">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href="#" className="text-sm text-gray-400 transition-colors duration-300 hover:text-accent">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-white">Newsletter</h4>
            <p className="mb-4 text-sm text-gray-400">Subscribe for exclusive offers and first access to new drops.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2.5 pr-12 text-sm text-white placeholder-gray-500 transition-colors focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-background transition-transform duration-300 hover:scale-110"
              >
                <FiArrowRight size={18} />
              </button>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-xs text-accent"
                >
                  ✓ Thank you for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>

        <div className="mb-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 sm:text-left">
            © 2024 RIZLA Boutique. All rights reserved. | Elevating Street Style.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-sm text-gray-400 transition-colors hover:text-accent">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 transition-colors hover:text-accent">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 transition-colors hover:text-accent">
              Cookie Policy
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
    </footer>
  
  );
};

export default Footer;