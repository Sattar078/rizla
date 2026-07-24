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
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-black/70 py-4 shadow-lg shadow-black/20 backdrop-blur-xl' : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <a href="#" className="font-playfair text-2xl font-bold tracking-[0.3em] text-accent sm:text-3xl">
            RIZLA
          </a>
        </div>

        <div className="hidden items-center gap-3 text-sm text-gray-300 lg:flex">
          <FiMapPin />
          <a href="#" className="transition-colors hover:text-accent">
            Nalasupara, Mumbai
          </a>
        </div>

        <div className="hidden flex-1 max-w-md lg:block">
          <div className="relative mx-3">
            <input
              type="text"
              placeholder="Search collections, brands..."
              className="w-full rounded-full border border-white/15 bg-white/10 py-3 pl-5 pr-12 text-sm text-white placeholder-gray-400 transition-colors focus:border-accent focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-accent">
              <FiSearch />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          <button className="transition-colors hover:text-accent lg:hidden" aria-label="Search">
            <FiSearch size={20} />
          </button>
          <button className="transition-colors hover:text-accent" aria-label="Wishlist">
            <FiHeart size={20} />
          </button>
          <button className="transition-colors hover:text-accent" aria-label="Shopping Bag">
            <FiShoppingBag size={20} />
          </button>
          <button className="hidden items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 font-montserrat text-sm uppercase tracking-[0.25em] transition-colors hover:border-accent hover:text-accent sm:flex">
            <FiUser />
            <span>Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;