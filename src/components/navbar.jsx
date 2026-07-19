import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingBag, FiMapPin, FiUser, FiHeart } from 'react-icons/fi';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled ? 'py-4 bg-black/50 backdrop-blur-xl shadow-lg' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center gap-2 md:gap-4">
        {/* Logo */}
        <div className="shrink-0">
          <a href="#" className="font-playfair text-2xl sm:text-3xl font-bold tracking-wider">
            RIZLA
          </a>
        </div>

        {/* Location */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-300">
          <FiMapPin />
          <span>Our Boutique</span>
        </div>

        {/* Search Box */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for collections, brands..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-6 text-sm placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
            />
            <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Actions (like, cart) */}
        <div className="flex items-center gap-x-5">
          <button className="hover:text-accent transition-colors lg:hidden" aria-label="Search">
            <FiSearch size={20} />
          </button>
          <button className="hover:text-accent transition-colors" aria-label="Wishlist">
            <FiHeart size={20} />
          </button>
          <button className="hover:text-accent transition-colors" aria-label="Shopping Bag">
            <FiShoppingBag size={20} />
          </button>
        </div>

        {/* Login/Signup */}
        <div className="hidden sm:flex items-center gap-x-2">
          <button className="flex items-center gap-2 font-montserrat text-sm uppercase tracking-widest px-4 py-2 hover:text-accent transition-colors">
            <FiUser />
            <span>Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;