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
    <footer className="w-full bg-black border-t border-white/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-16"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-4">RIZLA</h3>
            <p className="text-gray-400 font-poppins text-sm sm:text-base mb-6 max-w-sm">
              Experience luxury streetwear and premium fashion. Discover our diverse collection of trendsetting styles.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-accent mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm font-poppins">
                  Jakarta, Indonesia
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="text-accent mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm font-poppins">
                  +62 (0)21 123 4567
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="text-accent mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm font-poppins">
                  hello@rizla.com
                </p>
              </div>
            </div>
          </motion.div>

          {/* Links Columns */}
          {footerLinks.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="font-montserrat font-bold text-white uppercase tracking-wider mb-6 text-sm">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-accent font-poppins text-sm transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h4 className="font-montserrat font-bold text-white uppercase tracking-wider mb-6 text-sm">
              Newsletter
            </h4>
            <p className="text-gray-400 font-poppins text-sm mb-4">
              Subscribe to get exclusive offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-accent text-background p-2 rounded-full hover:scale-110 transition-transform duration-300"
              >
                <FiArrowRight size={18} />
              </button>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-accent text-xs mt-2 font-poppins"
                >
                  ✓ Thank you for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col sm:flex-row justify-between items-center gap-6"
        >
          {/* Copyright */}
          <motion.p variants={itemVariants} className="text-gray-500 font-poppins text-sm text-center sm:text-left">
            © 2024 RIZLA Boutique. All rights reserved. | Elevating Street Style.
          </motion.p>

          {/* Links */}
          <motion.div variants={itemVariants} className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-accent font-poppins text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-accent font-poppins text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-accent font-poppins text-sm transition-colors">
              Cookie Policy
            </a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;