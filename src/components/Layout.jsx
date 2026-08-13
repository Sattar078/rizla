import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Layout = () => (
  <div className="min-h-screen bg-background text-black">
    <Navbar />
    <Outlet />
    <Footer />
  </div>
);

export default Layout;
