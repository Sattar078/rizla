import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useProducts';
import { useNotification } from '../context/NotificationContext';

const navClass = ({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? 'text-primary-900' : 'text-gray-600 hover:text-primary-800'}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: categoryData } = useCategories();
  const categories = categoryData?.data?.categories || [];

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRefDesktop = useRef(null);
  const notifRefMobile = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    testPush,
    requestPushPermission,
    pushPermission,
  } = useNotification() || {};

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      const clickedDesktop = notifRefDesktop.current && notifRefDesktop.current.contains(event.target);
      const clickedMobile = notifRefMobile.current && notifRefMobile.current.contains(event.target);
      if (!clickedDesktop && !clickedMobile) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine which tab is active based on URL
  const searchParams = new URLSearchParams(location.search);
  const hasCategory = searchParams.get('category') || location.pathname.includes('/category/');
  const isCategoryTabActive = hasCategory || isCategoryOpen;

  const renderNotificationDropdown = (alignClass = 'right-0') => (
    <div className={`absolute top-full ${alignClass} mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150`}>
      <div className="p-3.5 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700">
              {unreadCount} new
            </span>
          )}
        </div>
        {user && user.role === 'admin' && (
          <button
            onClick={testPush}
            className="text-[11px] font-medium text-primary-700 hover:text-primary-900 hover:underline"
            title="Send test push notification"
          >
            ⚡ Test Push
          </button>
        )}
      </div>

      {pushPermission !== 'granted' && (
        <div className="p-2.5 bg-primary-50/80 border-b border-primary-100/60 flex items-center justify-between gap-2">
          <span className="text-[11px] text-primary-950 font-medium">Get live alerts on your device</span>
          <button
            onClick={requestPushPermission}
            className="px-2.5 py-1 bg-primary-900 text-white rounded-lg text-[10px] font-semibold hover:bg-primary-800 transition"
          >
            Enable Push
          </button>
        </div>
      )}

      <div className="max-h-72 overflow-y-auto p-2 divide-y divide-gray-50">
        {!user ? (
          <div className="p-5 text-center text-xs text-gray-500">
            Please sign in to view your notifications
          </div>
        ) : notifications?.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                if (!n.read && markAsRead) markAsRead(n._id);
                setIsNotificationOpen(false);
              }}
              className={`p-3 text-left rounded-xl transition-all cursor-pointer mb-1 ${
                !n.read
                  ? 'bg-amber-50/70 hover:bg-amber-100/60 border border-amber-200/50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className={`text-xs font-semibold ${!n.read ? 'text-primary-900' : 'text-gray-800'}`}>
                  {n.title}
                </h4>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-primary-800 shrink-0 mt-1"></span>
                )}
              </div>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug line-clamp-2">
                {n.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-[#fafafa] md:bg-[#fbfaf7]/95 md:backdrop-blur md:border-b border-black/5 pt-2 md:pt-0">
      {/* DESKTOP NAVBAR */}
      <div className="mx-auto hidden min-h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 md:flex">
        <Link to="/" className="shrink-0 text-primary-900" aria-label="Rizla Boutique home">
          <span className="block font-display text-2xl font-semibold leading-none">RIZLA</span>
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.28em] text-gray-500">Boutique</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/products" className={navClass}>Shop</NavLink>
          <NavLink to="/search" className={navClass}>Search</NavLink>
          {user && <NavLink to="/orders" className={navClass}>Orders</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
        </nav>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link to="/search" className="hidden sm:block text-gray-600 hover:text-primary-800 p-1" aria-label="Search products">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </Link>

          {/* Desktop Notification Bell */}
          <div className="relative" ref={notifRefDesktop}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-1 text-gray-600 hover:text-primary-800 transition"
              aria-label="View notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {isNotificationOpen && renderNotificationDropdown('right-0')}
          </div>

          {user ? (
            <>
              <Link to="/wishlist" className="hidden text-sm font-semibold text-gray-600 hover:text-primary-800 sm:inline">Saved</Link>
              <Link to="/cart" className="hidden md:inline text-sm font-semibold text-gray-600 hover:text-primary-800">Bag</Link>
              <Link to="/profile" className="hidden text-sm font-semibold text-gray-600 hover:text-primary-800 sm:inline">Profile</Link>
              <button onClick={logout} className="hidden border-l border-gray-200 pl-4 text-sm font-semibold text-gray-500 hover:text-primary-900 sm:block">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline text-sm font-semibold text-gray-600 hover:text-primary-800">Sign in</Link>
              <Link to="/signup" className="hidden md:inline rounded-full bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800">Create account</Link>
            </>
          )}
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="flex items-center justify-between px-4 pb-3 md:hidden relative" ref={dropdownRef}>
        <Link to="/" className="text-2xl font-serif font-bold tracking-wider text-gray-900">RIZLA</Link>
        
        <div className="flex items-center bg-gray-200/60 rounded-full p-1">
          <button 
            onClick={() => {
              setIsCategoryOpen(false);
              navigate('/products');
            }}
            className={`px-4 py-1.5 text-[11px] font-medium rounded-full transition-colors ${!isCategoryTabActive ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            All
          </button>
          <button 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className={`px-4 py-1.5 text-[11px] font-medium rounded-full transition-colors flex items-center gap-1 ${isCategoryTabActive ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Category
            <svg className={`w-3 h-3 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile Notification Bell */}
          <div className="relative" ref={notifRefMobile}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative text-gray-700 p-1"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {isNotificationOpen && renderNotificationDropdown('right-[-40px]')}
          </div>
          <Link to="/cart" className="text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </Link>
        </div>

        {/* Category Dropdown */}
        {isCategoryOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setIsCategoryOpen(false);
                    navigate(`/shop?category=${cat._id}`);
                  }}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
                  <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
              {categories.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">Loading categories...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;