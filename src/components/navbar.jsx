import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiMapPin, FiUser, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav
      className="bg-white/95 text-slate-900 backdrop-blur-md fixed top-0 z-50 w-full transition-colors duration-300 shadow-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <Link to="/" className="font-playfair text-2xl font-bold tracking-[0.3em] text-accent sm:text-3xl">
            RIZLA
          </Link>
        </div>

        <div className="hidden items-center gap-3 text-sm text-gray-300 lg:flex">
          <FiMapPin />
          <Link to="/contact" className="transition-colors hover:text-accent">
            Nalasupara, Mumbai
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md lg:block">
          <div className="relative mx-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections, brands..."
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-3 pl-5 pr-12 text-sm text-slate-900 placeholder-slate-500 transition-colors focus:border-accent focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-accent">
              <FiSearch />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-5 sm:gap-6">
          <button
            onClick={() => navigate(`/shop${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`)}
            className="transition-colors hover:text-accent lg:hidden"
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>
          <Link to="/wishlist" className="relative transition-colors hover:text-accent" aria-label="Wishlist">
            <FiHeart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-background">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative transition-colors hover:text-accent" aria-label="Shopping Bag">
            <FiShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-background">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link
              to="/account"
              className="hidden items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-montserrat text-sm uppercase tracking-[0.25em] text-slate-900 transition-colors hover:border-accent hover:text-accent sm:flex"
            >
              <FiUser />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-montserrat text-sm uppercase tracking-[0.25em] text-slate-900 transition-colors hover:border-accent hover:text-accent sm:flex"
            >
              <FiUser />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
