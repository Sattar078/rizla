import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  Squares2X2Icon, 
  HeartIcon, 
  UserIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  Squares2X2Icon as Squares2X2IconSolid, 
  HeartIcon as HeartIconSolid, 
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

const MobileBottomNav = () => {
  const { user } = useAuth();

  const navItemClass = ({ isActive }) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      isActive ? 'text-primary-900' : 'text-gray-500 hover:text-primary-800'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fafafa] border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        <NavLink to="/" end className={navItemClass}>
          {({ isActive }) => (
            <>
              {isActive ? <HomeIconSolid className="w-6 h-6" /> : <HomeIcon className="w-6 h-6" />}
              <span className="text-[10px] font-medium">Home</span>
            </>
          )}
        </NavLink>

        <NavLink to="/products" className={navItemClass}>
          {({ isActive }) => (
            <>
              {isActive ? <Squares2X2IconSolid className="w-6 h-6" /> : <Squares2X2Icon className="w-6 h-6" />}
              <span className="text-[10px] font-medium">Shop</span>
            </>
          )}
        </NavLink>

        <NavLink to="/wishlist" className={navItemClass}>
          {({ isActive }) => (
            <>
              {isActive ? <HeartIconSolid className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
              <span className="text-[10px] font-medium">Wishlist</span>
            </>
          )}
        </NavLink>

        <NavLink to={user ? "/profile" : "/login"} className={navItemClass}>
          {({ isActive }) => (
            <>
              {isActive ? <UserIconSolid className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
              <span className="text-[10px] font-medium">{user ? 'Profile' : 'Profile'}</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default MobileBottomNav;
