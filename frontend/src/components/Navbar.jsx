import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? 'text-primary-900' : 'text-gray-600 hover:text-primary-800'}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  return <header className="sticky top-0 z-40 border-b border-black/5 bg-[#fbfaf7]/95 backdrop-blur">
    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
      <Link to="/" className="shrink-0 text-primary-900" aria-label="Rizla Boutique home"><span className="block font-display text-2xl font-semibold leading-none">RIZLA</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.28em] text-gray-500">Boutique</span></Link>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation"><NavLink to="/" end className={navClass}>Home</NavLink><NavLink to="/products" className={navClass}>Shop</NavLink><NavLink to="/search" className={navClass}>Search</NavLink>{user && <NavLink to="/orders" className={navClass}>Orders</NavLink>}{user?.role === 'admin' && <NavLink to="/admin" className={navClass}>Admin</NavLink>}</nav>
      <div className="flex items-center gap-3 sm:gap-5"><Link to="/search" className="text-gray-600 hover:text-primary-800 p-1" aria-label="Search products"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></Link>{user ? <><Link to="/wishlist" className="hidden text-sm font-semibold text-gray-600 hover:text-primary-800 sm:inline">Saved</Link><Link to="/cart" className="text-sm font-semibold text-gray-600 hover:text-primary-800">Bag</Link><Link to="/profile" className="hidden text-sm font-semibold text-gray-600 hover:text-primary-800 sm:inline">Profile</Link><button onClick={logout} className="hidden border-l border-gray-200 pl-4 text-sm font-semibold text-gray-500 hover:text-primary-900 sm:block">Sign out</button></> : <><Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-primary-800">Sign in</Link><Link to="/signup" className="rounded-full bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800">Create account</Link></>}</div>
    </div>
    <nav className="mobile-nav items-center justify-center gap-6 border-t border-black/5 px-4 py-2.5" aria-label="Mobile navigation"><NavLink to="/" end className={navClass}>Home</NavLink><NavLink to="/products" className={navClass}>Shop</NavLink><NavLink to="/search" className={navClass}>Search</NavLink>{user && <NavLink to="/profile" className={navClass}>Profile</NavLink>}{user && <NavLink to="/orders" className={navClass}>Orders</NavLink>}{user?.role === 'admin' && <NavLink to="/admin" className={navClass}>Admin</NavLink>}{user && <button onClick={logout} className="text-sm font-semibold text-gray-500">Sign out</button>}</nav>
  </header>;
};

export default Navbar;