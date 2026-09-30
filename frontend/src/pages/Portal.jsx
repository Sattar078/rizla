import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Portal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/admin/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Welcome to Rizla
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Please select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User/Customer Card */}
          <Link 
            to="/products"
            className="group relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-primary-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            
            <div className="relative z-10 w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
              <svg className="w-10 h-10 text-primary-900 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            
            <h2 className="relative z-10 text-2xl font-bold text-gray-900 group-hover:text-white transition-colors mb-4">
              Customer Portal
            </h2>
            <p className="relative z-10 text-gray-500 group-hover:text-gray-200 transition-colors">
              Browse our premium collection, manage your cart, and track your orders.
            </p>
            
            <div className="relative z-10 mt-8 flex items-center text-primary-900 group-hover:text-white font-bold transition-colors">
              Enter Store 
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* Admin Card */}
          <button 
            onClick={handleAdminClick}
            className="group relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col items-center text-center w-full"
          >
            <div className="absolute inset-0 bg-gray-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            
            <div className="relative z-10 w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
              <svg className="w-10 h-10 text-gray-900 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h2 className="relative z-10 text-2xl font-bold text-gray-900 group-hover:text-white transition-colors mb-4">
              Admin Portal
            </h2>
            <p className="relative z-10 text-gray-500 group-hover:text-gray-200 transition-colors">
              Manage inventory, process orders, and oversee store analytics securely.
            </p>
            
            <div className="relative z-10 mt-8 flex items-center text-gray-900 group-hover:text-white font-bold transition-colors">
              Access Dashboard 
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Portal;
